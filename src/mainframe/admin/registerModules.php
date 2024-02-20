<?php

require_once("errorReport.php");

//-------------------------------------------------------//

class AbstractModule
{
    public $id = -1;
    public $name = "";
    public $path = "";
    public $parent = null;
    public $requiredResources = [];
    public $providedResources = [];
    public $leaf = true; //has no children ?
    
    public function __construct($name, $parent)
    {
        $this->name = $name;
        $this->parent = $parent;
        if (!is_null($this->parent))
        {
            $this->parent->leaf = false; //congratulations !!
        }
    }
    
    public function getRequiredResourcesFromParent()
    {
        if (!is_null($this->parent))
        {
            $this->requiredResources = ($this->parent->requiredResources); //inherit resources
        }
    }
    
    public function getProvidedResourcesFromParent()
    {
        if (!is_null($this->parent))
        {
            $this->providedResources = ($this->parent->providedResources); //inherit resources
        }
    }
    
    public function addRequiredResource($res)
    {
        array_push($this->requiredResources, $res);
    }
    
    public function addProvidedResource($res)
    {
        array_push($this->providedResources, $res);
    }
    
    public function setPath($path)
    {
        $this->path = $path;
    }
    
    public function toString()
    {
        $str = "[name=".$this->name.", parent=".((is_null($this->parent))?"none":$this->parent->name).", path=".$this->path.", leaf=".(($this->leaf)?"yes":"no")."]";
        $str .= "<br/>{<br/>";
        foreach ($this->requiredResources as $res) $str .= "required: ".($res->name)."<br/>";
        foreach ($this->providedResources as $res) $str .= "provided: ".($res->name)."<br/>";
        $str .= "}<br/>";
        
        return $str;
    }
}

class Resource
{
    public $id = -1;
    public $name = "";
    
    public function __construct($name)
    {
        $this->name = $name;
    }
}

//-------------------------------------------------------//

$modules = [];
$resources = [];

//add AbstractModule super class
array_push($modules, new AbstractModule("AbstractModule", null));

function findResource($resourceName)
{
    global $resources;
    
    foreach ($resources as $res)
    {
        if (strcmp($res->name, $resourceName) === 0) return $res;
    }
    
    return null;
}

function findOrCreateResource($resourceName)
{
    global $resources;
    
    $res = findResource($resourceName);
    if (!is_null($res)) return $res;
    
    $newRes = new Resource($resourceName);
    array_push($resources, $newRes);
    return $newRes;
}

function findModule($moduleName)
{
    global $modules;
    
    foreach ($modules as $mod)
    {
        if (strcmp($mod->name, $moduleName) === 0) return $mod;
    }
    
    return null;
}

function findOrCreateModule($moduleName, $parentName)
{
    global $modules;
    
    $mod = findModule($moduleName);
    if (!is_null($mod)) return $mod;
    
    $newMod = new AbstractModule($moduleName, findModule($parentName));
    array_push($modules, $newMod);
    return $newMod;
}

//-------------------------------------------------------//

$dir    = '../modules';
$files1 = scandir($dir);
$files2 = scandir($dir, 1);

//print_r($files1);

//echo "</br>";

if (is_dir($dir)) {
    if ($dh = opendir($dir))
    {
        while (($file = readdir($dh)) !== false)
        {
            if ($file == ".") continue;
            if ($file == "..") continue;
            
            //echo "<hr/>filename: $file <br/>";
            
            if ($dh2 = opendir($dir."/".$file))
            {
                while (($file2 = readdir($dh2)) !== false)
                {
                    if ($file2 == ".") continue;
                    if ($file2 == "..") continue;
                    
                    //echo " - filename: $file2 <br/>";
                    
                    if ($dh3 = opendir($dir."/".$file."/".$file2))
                    {
                        while (($file3 = readdir($dh3)) !== false)
                        {
                            if ($file3 == ".") continue;
                            if ($file3 == "..") continue;

                            //echo " -- filename: $file3 <br/>";
                            
                            if ($file3 == "main.js")
                            {
                                //echo "!!!!</br>";
                                //if it's a file, open it
                                $myfile = fopen($dir."/".$file."/".$file2."/".$file3, "r") or die("Unable to open file!");
                                $fileContents = fread($myfile,filesize($dir."/".$file."/".$file2."/".$file3));
                                fclose($myfile);
                                
                                
                                preg_match_all('#var \s*(.*?)\s*=\s*Class\.create\(\s*(.*?),#', $fileContents, $module_matches, PREG_OFFSET_CAPTURE);
                                /*
                                print "<pre>";
                                print_r($module_matches);
                                print "</pre>";
                                */
                                
                                $tmpMods = [];
                                $offsets = [];
                                
                                //create object for each module and save the offsets at which they appear in the file
                                for ($i=0; $i<count($module_matches[1]); $i++)
                                {
                                    $mod = findOrCreateModule($module_matches[1][$i][0], $module_matches[2][$i][0]);
                                    $mod->setPath($file."/".$file2);
                                    array_push($tmpMods, $mod);
                                    array_push($offsets, $module_matches[1][$i][1]);
                                }
                                
                                //add the end of the file
                                array_push($offsets, strlen($fileContents));
                                
                                //find provided resources for each module, based on splitting the file contents by offsets
                                for ($i=0; $i<count($offsets)-1; $i++)
                                {
                                    $fileSubcontents = substr($fileContents, $offsets[$i], ($offsets[$i+1] - $offsets[$i]));
                                    
                                    //find resources for this module
                                    $modResources = [];
                                    preg_match_all('#providedResources\[.*?\]\s*=\s*new \s*(.*?)\s*\(\s*\);#', $fileSubcontents, $resource_matches);
                                    $modResources = array_merge($modResources, $resource_matches[1]);
                                    preg_match_all('#providedResources.push\(\s*new \s*(.*?)\s*\(\s*\)\s*\);#', $fileSubcontents, $resource_matches2);
                                    $modResources = array_merge($modResources, $resource_matches2[1]);
                                    
                                    $tmpMods[$i]->getProvidedResourcesFromParent(); // assuming parent got parsed first
                                    
                                    foreach ($modResources as $resName)
                                    {
                                        $modRes = findOrCreateResource($resName);
                                        $tmpMods[$i]->addProvidedResource($modRes);
                                    }
                                }
                                
                                //find required resources for each module, based on splitting the file contents by offsets
                                for ($i=0; $i<count($offsets)-1; $i++)
                                {
                                    $fileSubcontents = substr($fileContents, $offsets[$i], ($offsets[$i+1] - $offsets[$i]));
                                    
                                    //find resources for this module
                                    $modResources = [];
                                    preg_match_all('#requiredResources\[.*?\]\s*=\s*new \s*(.*?)\s*\(\s*\);#', $fileSubcontents, $resource_matches);
                                    $modResources = array_merge($modResources, $resource_matches[1]);
                                    preg_match_all('#requiredResources.push\(\s*new \s*(.*?)\s*\(\s*\)\s*\);#', $fileSubcontents, $resource_matches2);
                                    $modResources = array_merge($modResources, $resource_matches2[1]);
                                    
                                    $tmpMods[$i]->getRequiredResourcesFromParent(); // assuming parent got parsed first
                                    
                                    foreach ($modResources as $resName)
                                    {
                                        $modRes = findOrCreateResource($resName);
                                        $tmpMods[$i]->addRequiredResource($modRes);
                                    }
                                }
                                
                            }

                        }
                        closedir($dh3);
                    }

                }
                closedir($dh2);
            }
        }
        closedir($dh);
    }
}

//--------------------------------------------------------------------------------------------------------------------//

function updateLocalModuleIDs($dbhandle)
{
    $getModules = 'SELECT idRegisteredModule, name FROM `RegisteredModules`;';
    $resultModules = mysqli_query($dbhandle, $getModules);
    
    while ($row = mysqli_fetch_array($resultModules))
    {
        $mod = findModule($row{'name'});
        
        if (is_null($mod))
        {
            echo "WARNING: Found module in DB with name '".$row{'name'}."' that was not found in code.<br/>";
            continue;
        }
        
        //set id from DB
        $mod->id = $row{'idRegisteredModule'};
    }
}

function updateLocalResourceIDs($dbhandle)
{
    $getResources = 'SELECT idRegisteredResource, name FROM `RegisteredResources`;';
    $resultResources = mysqli_query($dbhandle, $getResources);
    
    while ($row = mysqli_fetch_array($resultResources))
    {
        $res = findResource($row{'name'});
        
        if (is_null($res))
        {
            echo "WARNING: Found resource in DB with name '".$row{'name'}."' that was not found in code.<br/>";
            continue;
        }
        
        //set id from DB
        $res->id = $row{'idRegisteredResource'};
    }
}

//--------------------------------------------------------------------------------------------------------------------//

require_once(__DIR__."/../../app/main.config.php");

//connection to the database
$dbhandle = mysqli_connect($db_hostname, $db_username, $db_password, $db_database) or die("Unable to connect to database.");

//read and update modules from DB
updateLocalModuleIDs($dbhandle);

//read and update resources from DB
updateLocalResourceIDs($dbhandle);

//insert new modules and update existing ones in DB
$modInsertSQL = "INSERT INTO `RegisteredModules` (`name`, `path`) VALUES "; $modInsertFlag = false;
$modUpdateSQL = "UPDATE `RegisteredModules` SET "; $modUpdateFlag = false;
$resInsertSQL = "INSERT INTO `RegisteredResources` (`name`) VALUES "; $resInsertFlag = false;
//$resUpdateSQL = "UPDATE `RegisteredModules` SET "; $resUpdateFlag = false;

//insert new modules and update existing ones in DB
foreach ($modules as $mod)
{
    if (!$mod->leaf) continue;
    
    if ($mod->id == -1)
    {
        //insert
        if ($modInsertFlag) $modInsertSQL .= ",";
        else $modInsertFlag = true;
        
        $modInsertSQL .= "('".$mod->name."', '".$mod->path."')";
        
        echo "Inserting module '".$mod->name."'<br/>";
    }
    else
    {
        //update
        if ($modUpdateFlag) $modUpdateSQL .= ",";
        else $modUpdateFlag = true;
        
        $modUpdateSQL .= "(path='".$mod->path."' WHERE idRegisteredModules='".$mod->id."')";
        
        echo "Updating module '".$mod->name."'<br/>";
    }
}
$modInsertSQL .= ";";
$modUpdateSQL .= ";";

if ($modInsertFlag) mysqli_query($dbhandle, $modInsertSQL);
if ($modUpdateFlag) mysqli_query($dbhandle, $modUpdateSQL);

//insert new resources and update existing ones in DB
foreach ($resources as $res)
{
    if ($res->id == -1)
    {
        //insert
        if ($resInsertFlag) $resInsertSQL .= ",";
        else $resInsertFlag = true;
        
        $resInsertSQL .= "('".$res->name."')";
        
        echo "Inserting resource '".$res->name."'<br/>";
    }
    else
    {
        //update
        //nothing to do really
        echo "No need to update resource '".$res->name."'<br/>";
    }
}
$resInsertSQL .= ";";
//$resUpdateSQL .= ";";

if ($resInsertFlag) mysqli_query($dbhandle, $resInsertSQL);
//if ($resUpdateFlag) mysqli_query($dbhandle, $resUpdateSQL);


//read and update modules and resources from DB
updateLocalModuleIDs($dbhandle);
updateLocalResourceIDs($dbhandle);

//remake connections between modules and resources: truncate ModuleResources table and add the current connections
$moduleResourceTruncateSQL = "TRUNCATE TABLE `ModuleResources`;";
$moduleResourceInsertSQL = "INSERT INTO `ModuleResources` (`idRegisteredModule`, `idRegisteredResource`, `idResourceType`) VALUES "; $moduleResourceInsertFlag = false;

foreach ($modules as $mod)
{
    if (!$mod->leaf) continue;
    
    foreach ($mod->requiredResources as $rres)
    {
        if ($moduleResourceInsertFlag) $moduleResourceInsertSQL .= ",";
        else $moduleResourceInsertFlag = true;
        
        $moduleResourceInsertSQL .= "(".$mod->id.", ".$rres->id.", 1)";
        
        //echo "adding required resource binding ".$mod->name."-".$rres->name."<br/>";
    }
    
    foreach ($mod->providedResources as $pres)
    {
        if ($moduleResourceInsertFlag) $moduleResourceInsertSQL .= ",";
        else $moduleResourceInsertFlag = true;
        
        $moduleResourceInsertSQL .= "(".$mod->id.", ".$pres->id.", 2)";
        
        //echo "adding provided resource binding ".$mod->name."-".$pres->name."<br/>";
    }
}
$moduleResourceInsertSQL .= ";";

echo $moduleResourceInsertSQL;

if ($moduleResourceInsertFlag) mysqli_query($dbhandle, $moduleResourceTruncateSQL.$moduleResourceInsertSQL);

//close the connection
mysqli_close($dbhandle);

echo "<hr/><hr/>";
echo "Summary<br/>";
foreach ($modules as $mod)
{
    echo $mod->toString()."<br/>";
}

?>
