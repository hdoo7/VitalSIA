<?php

require_once("../admin/errorReport.php");

require_once(__DIR__."/../main.config.php");
require_once(__DIR__."/Counselling.classes.php");

$feedbackNames = [];

//execute the SQL query and return records
$lang = 13; //en-US

//connection to the database
$dbhandle = mysqli_connect($db_hostname, $db_username, $db_password, $db_database) or die("Unable to connect to database.");

//echo mysqli_real_escape_string($dbhandle, $_GET['a'][0]);

$sqlWhereClause = "";
$firstIteration = true;
foreach($_GET['a'] as $e)
{
    if ($firstIteration) $firstIteration = false;
    else
    {
        $sqlWhereClause .= " OR ";
    }
    $sqlWhereClause .= "FeedbackPlaceholders.name='".mysqli_real_escape_string($dbhandle, mysqli_real_escape_string($dbhandle, $e))."'";
}

$allFeedbackResponses = 'SELECT FeedbackTranslations.text, FeedbackPlaceholders.name
FROM FeedbackPlaceholders JOIN FeedbackTranslations ON FeedbackPlaceholders.idFeedbackPlaceholders=FeedbackTranslations.idFeedbackPlaceholders
WHERE FeedbackTranslations.idLanguage='.$lang.' AND ('.$sqlWhereClause.');';

$result = mysqli_query($dbhandle, $allFeedbackResponses);
if (!$result)
{
    printf("Error: %s\n", mysqli_error($dbhandle));
    exit();
}

//close the connection
mysqli_close($dbhandle);

$feedback = [];

//fetch tha data from the database 
while($row = mysqli_fetch_array($result))
{
    array_push($feedback,new Feedback($row{'text'},$row{'name'}));
}

$xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><interview/>');

foreach($feedback as $que)
{
      $que->appendXMLTo($xml);
}

Header('Content-type: text/xml; charset=utf-8');
print($xml->asXML());

?>
