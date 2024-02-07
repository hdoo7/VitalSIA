/*
** Mainframe, Modules and Resources
** Author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

"use strict";

/*****************************************************************\
** Enumerations
** Thou shalt use these throughout the application.
\*****************************************************************/

/*
** Emotion enumeration
*/
var Emotion = {
    Anger: 0,
    Contempt: 1,
    Disgust: 2,
    Embarrassment: 3,
    Fear: 4,
    Happiness: 5,
    Pride: 6,
    Sadness: 7,
    Surprise: 8
};

var AUNames = {
     AU1:  0,  AU2:  1,  AU4:  2,  AU5:  3,  AU6:  4,  AU7:  5,  AU8:  6,  AU9:  7, AU10:  8, AU11:  9,
    AU12: 10, AU13: 11, AU14: 12, AU15: 13, AU16: 14, AU17: 15, AU18: 16, AU20: 17, AU22: 18, AU23: 19,
    AU24: 20, AU25: 21, AU26: 22, AU27: 23, AU28: 24, AU38: 25, AU39: 26, AU41: 27, AU42: 28, AU43: 29,
    AU44: 30, AU45: 31, AU46: 32, AU51: 33, AU52: 34,
    TOTAL:35
};

var ModuleType = {
    Sensor: 0,
    Processor: 1,
    Effector: 2,
    Dummy: 3,
    Unknown: -1
};

var CounselorAction = {
    /* Idle animations */
    Sit: 0,
    
    /* Left Hand gestures */
    L_HandRest: 1,
    L_FormlessFlick: 2,
    L_FingerTap: 3,
    L_Point: 4,
    L_Wave: 5,
    
    /* Right Hand gestures */
    R_HandRest: 6,
    R_FormlessFlick: 7,
    R_FingerTap: 8,
    R_Point: 9,
    R_Wave: 10,
    
    /* Both Hands gestures */
    Contrast: 11,
    OpenHands: 12,
    
    /* Idle body motion */
    Idle_CollarHead: 13,

    /* Head animations */
    Head_Nod: 14,
    
    /* total */
    length: 15
};

var UserCommandID = {
    GO_TO_PREVIOUS_QUESTION: 0,
    RESET_ANSWER: 1,
    YES: 2,
    NO: 3
};

/*
var Error = {
    REQUIRED_RESOURCE_NOT_PROVIDED: 0,
    
};
*/

/*****************************************************************\
** Useful definitions
\*****************************************************************/

jQuery(function($) // using jQuery's $
{
    jQuery.cachedScript = function( url, options )
    {
        // Allow user to set any option except for dataType, cache, and url
        options = $.extend( options || {}, {
            dataType: "script",
            //cache: true,
            cache: false, //debug
            url: url
        });

        // Use $.ajax() since it is more flexible than $.getScript
        // Return the jqXHR object so we can chain callbacks
        return jQuery.ajax( options );
    };
});

function loadScript(url, callback)
{
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.body.appendChild(script);
}

var ModuleDependency = Class.create
({
    initialize: function(scriptDir, scriptName, clientModule)
    {
        var self = this;
        
        self.dir = scriptDir;
        self.name = scriptName;
        self.module = clientModule;
        self.pending = false;
    },
    
    equals: function(dep)
    {
        var self = this;
        
        return (self.name==dep.name);
    }
});

/*****************************************************************\
** Mainframe
\*****************************************************************/

/**
 * Configures and manages module creation and use
 * @class
 */
var Mainframe = Class.create
({
    /**
     * Initialize THREE.js load manager and module storage variables
     * @param  {String} configURL file containing the modules to be loaded by the mainframe
     * @return {void}
     * 
     * @memberof Mainframe#
     */
    initialize: function(configURL)
    {
        var self = this; //cute trick to call prototype method from jquery block, because "this" is overridden
        
        // /* @member {THREE.LoadingManager} */
        // self.manager = new THREE.LoadingManager();
        // /* @member {callback} */
        // self.manager.onProgress = self.managerOnProgress.bind(this);
        // self.manager.onLoad = self.managerOnLoad.bind(this);
        // self.manager.onError = self.managerOnError.bind(this);
        // self.manager.onStart = self.managerOnStart.bind(this);
        
        // self.finishedLoading = false;
        // self.hasSomethingToLoad = false;
        
        self.config = configURL;
        
        self.configurationCompatible = false; //this is used to allow the mainframe to run, it is updated when adding/removing modules
        
        self.registeredModules = []; //all loaded modules
        self.registeredResources = [];
        self.requiredResources = [];
        
        self.moduleExecutionOrder = []; //this is a temporary sorted list of registered modules, used to run everything in a compatible way
        
        //javascript files cannot be unloaded from memory
        //so we might as well keep them loaded but disabled
        self.loadedModules = [];
        
        //module dependency management
        self.loadedModuleDependencies = [];
        
        //load main configuration
        jQuery(function($) // using jQuery's $
        {
            jQuery.get(configURL, function(d)
            {
                jQuery(d).find('module').each(function()
                {
                    var module = jQuery(this); //"this" is not the "self" ! it's scenarios like this that make using the self variable useful
                    var name = module.attr("name");
                    var uri = module.attr("uri");

                    var params = {};
                    jQuery(module).find('param').each(function()
                    {
                        var param = jQuery(this);
                        params[param.attr("name")] = param.attr("value");
                    });

                    self.registerModule(name, uri, params);
                });
            });
        });
    },
    
    /**
     * Callback for each item loaded by the THREE.js load manager
     * @param  {String} item   URL of loaded item
     * @param  {int}    loaded Number of items loaded
     * @param  {int}    total  Total number of items
     * @return {void}
     *
     * @memberof Mainframe#
     */
    // managerOnProgress: function (item, loaded, total)
    // {
    //     var self = this;
        
    //     console.log(item, loaded, total);
    // },
    
    /**
     * Called when the THREE.js load manager finishes loading all items
     * @return {void}
     *
     * @memberof Mainframe#
     */
    // managerOnLoad: function ()
    // {
    //     var self = this;
        
    //     console.log('/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ all items loaded /-/-/-/-/-/-/-/-/-/-/-/-/-/-/');
        
    //     self.finishedLoading = true;
        
    //     jQuery(function($) {
    //         $('.onepix-imgloader').fadeOut();
    //         $('.loading-container > *:not(.onepix-imgloader)').fadeTo(8000, 100);
    //     });
    // },
    
    /**
     * Called when the THREE.js load manager encounters an error while loading an item
     * @return {void}
     *
     * @memberof Mainframe#
     */
    // managerOnError: function ()
    // {
    //     var self = this;
        
    //     console.log('there has been an error');
        
    //     if (self.manager.scope != undefined)
    //     {
    //         self.manager.scope.isLoading = false; //hack
    //     }
        
    // },
    
    /**
     * Called when the THREE.js load manager starts up
     * @return {void}
     *
     * @memberof Mainframe#
     */
    // managerOnStart: function()
    // {
    //     var self = this;
        
    //     self.hasSomethingToLoad = true;
    // },
    
    /**
     * Attempts to register a module. If dependencies are not yet loaded, it schedules a lazy registration
     * @param  {String} moduleName Name of module to be registered
     * @param  {String} uri        URL to the file where the module is implemented
     * @param  {Dict}   params     Dictionary of parameters: name-value pairs
     * @return {void}
     *
     * @memberof Mainframe#
     */
    registerModule: function(moduleName, uri, params)
    {
        var self = this; //cute trick to call prototype method from jquery block, because "this" is overridden
        
        //fast check, we'll need to check again later though, due to asynchronous module loading
        if (self.moduleRegistered(moduleName) > -1)
        {
            console.log( "Module "+moduleName+" already registered !" );
            return;
        }
        
        var index = self.moduleLoaded(moduleName);
        if (index == -1)
        {
            jQuery(function($){
                $.cachedScript( config.moduleDirectory + uri+"/dependencies.js" ).done(function( script, textStatus )
                {
                    self.registerModule_lazy.delay(0.1, self, moduleName, uri, params); //delayed module registration, in order to load dependencies first
                });
            });
        }
        else
        {
            var duplicateResource = self.verifyDuplicateResourceInModuleRegistration(this.loadedModules[index]);

            if (duplicateResource == null)
            {
                //register module
                self.registeredModules.push(self.loadedModules[index]);

                //register provided resources
                for (var i=0; i<newModule.providedResources.length; ++i)
                {
                    self.registeredResources.push(newModule.providedResources[i]);
                }
                
                console.log( "Load module "+moduleName+": registered from memory (previously loaded)" );
                
                //validate system
                self.verifyModuleCompatibility();
                
                newModule.setActive(true);
            }
            else
            {
                console.log("Module "+moduleName+" provides at least one duplicate resource: "+duplicateResource);
            }
        }
    },
    
    /**
     * Registers a module that had dependencies which were not previously loaded
     * @param  {MainFrame} self       Reference to mainframe object
     * @param  {String}    moduleName Name of the module to be registered
     * @param  {String}    uri        URL to the javascript file where the module is implemented
     * @param  {Dict}      params     Dictionary of parameters: name-value pairs
     * @return {void}
     *
     * @memberof Mainframe#
     */
    registerModule_lazy: function(self, moduleName, uri, params) //called by registerModule -- DO NOT CALL DIRECTLY !
    {
        //fast check, we'll need to check again later though, due to asynchronous module loading
        if (self.moduleRegistered(moduleName) > -1)
        {
            console.log( "Module "+moduleName+" already registered !" );
            return;
        }
        
        //check if all dependencies have been loaded (ideally we would check only for dependencies of this particular module, but it's not that big of a difference)
        var dependenciesLoaded = true;
        for (var i=0; i<self.loadedModuleDependencies.length; ++i)
        {
            if (self.loadedModuleDependencies[i].pending)
            {
                dependenciesLoaded = false;
            }
        }
        
        if (!dependenciesLoaded)
        {
            console.log("waiting for dependencies...");
            self.registerModule_lazy.delay(0.1, self, moduleName, uri, params); //delayed module registration, in order to load dependencies first
        }
        else
        {
            jQuery(function($){
                $.cachedScript( config.moduleDirectory + uri + "/main.js" ).done(function( script, textStatus )
                {
                    //check again, due to asynchronous module loading
                    if (self.moduleRegistered(moduleName) > -1)
                    {
                        console.log( "Module "+moduleName+" already registered !" );
                        return;
                    }
                    
                    var newModule = new window[moduleName](params); //Note: if the application crashes here, it means that the module it tried to load does not exist. check the list of modules it's trying to load

                    var duplicateResource = self.verifyDuplicateResourceInModuleRegistration(newModule);

                    if (duplicateResource == null)
                    {
                        //register module
                        self.registeredModules.push(newModule);

                        //register provided resources
                        for (var i=0; i<newModule.providedResources.length; ++i)
                        {
                            self.registeredResources.push(newModule.providedResources[i]);
                        }

                        //validate system
                        self.verifyModuleCompatibility();
                        
                        newModule.setActive(true);
                        
                        console.log( "Load module "+moduleName+": "+textStatus );
                    }
                    else
                    {
                        console.log("Module "+moduleName+" provides at least one duplicate resource: "+duplicateResource);
                    }
                });
            });
        }
    },
    
    /**
     * Removes a module from the application
     * @param  {String} moduleName Name of the module to be removed
     * @return {void}
     *
     * @memberof Mainframe#
     */
    unregisterModule: function(moduleName)
    {
        var self = this;
        
        var index = self.moduleRegistered(moduleName);
        if (index == -1) return;
        
        self.registeredModules[index].setActive(false);

        self.registeredModules[index].cleanup();
        
        for (var i=0; i<self.registeredModules[index].providedResources.length; ++i)
        {
            var res = self.providedResourceRegistered(self.registeredModules[index].providedResources[i]);
            self.registeredResources.splice(res, 1); //remove resource provided by this module
        }
        self.registeredModules.splice(index, 1); //remove element
    },
    
    /**
     * Verifies whether this module provides a resource that has already been provided (Invalid configuration)
     * @param  {String} newModule Name of module to be tested for duplicate provided resources
     * @return {bool}             Returns true if duplicate detected, false otherwise
     *
     * @memberof Mainframe#
     */
    verifyDuplicateResourceInModuleRegistration: function(newModule)
    {
        var self = this;
        
        //verify if this module provides resources already provided by another module
        var duplicateResource = null;
        for (var i=0; i<newModule.providedResources.length; ++i)
        {
            for (var j=0; j<self.registeredResources.length; ++j)
            {
                if (newModule.providedResources[i].name == self.registeredResources[j].name)
                {
                    //duplicate detected
                    duplicateResource = newModule.providedResources[i].name;
                }
            }
            if (duplicateResource != null) break;
        }
        
        return duplicateResource;
    },
    
    /**
     * Performs global module configuration check
     * @return {void}
     *
     * @memberof Mainframe#
     */
    verifyModuleCompatibility: function()
    {
        var self = this;
        
        self.configurationCompatible = false; //stop mainframe run activity while checking compatibility
        
        var compatible = true;
        
        for (var i=0; i<self.registeredModules.length; ++i)
        {
            for (var j=0; j<self.registeredModules[i].requiredResources.length; ++j)
            {
                var found = false;
                for (var k=0; k<self.registeredResources.length; ++k)
                {
                    if (self.registeredModules[i].requiredResources[j].name == this.registeredResources[k].name)
                    {
                        //found required resource, let's link it
                        self.registeredModules[i].requiredResources[j].container = this.registeredResources[k].container; //use direct reference in containers (actual resources remain different)
                        found = true;
                    }
                }
                if (!found)
                {
                    if (self.registeredModules[i].isResourceOptional(self.registeredModules[i].requiredResources[j]))
                    {
                        console.log("Resource "+self.registeredModules[i].requiredResources[j].name+" not found, but is optional for module "+self.registeredModules[i].name+".");
                    }
                    else
                    {
                        compatible = false; //at least one resource could not be accounted for, therefore the configuration is not compatible
                        console.log("Could not find resource "+self.registeredModules[i].requiredResources[j].name+" required by module "+self.registeredModules[i].name+".");
                        break; //stop looking
                    }
                }
            }
            
            if (!compatible) break; //stop looking
        }
        
        if (compatible)
        {
            console.log("Module configuration OK !");
            console.log("Performing cleanup...");
            for (var i=0; i<self.registeredModules.length; ++i)
            {
                self.registeredModules[i].cleanup();
            }
            
            self.updateModuleExecutionOrder();
        }
        else
        {
            console.log("Incompatible module configuration !");
        }
        self.configurationCompatible = compatible;
    },
    
    /**
     * Infer and set execution order of modules, based on resources that are provided and required. Do not call directly.
     * @return {void}
     *
     * @memberof Mainframe#
     */
    updateModuleExecutionOrder: function() //called by verifyModuleCompatibility, if everything is ok - DO NOT CALL DIRECTLY !
    {
        var self = this;
        
        //create sorted list of registered modules, based on compatible execution order (regarding resources provided/required)
        //WARNING ! this algorithm ASSUMES that the configuration is compatible !! do not call directly
        
        //we sweep in a Dijkstra-ish fashion, so that each module has all the necessary resources computed before it runs, and create a sorted list
        //the idea is to start from modules that don't need any resources, execute them, then run those which can be executed using the available resources, and so on...
        
        var remainingModules = self.registeredModules.slice(); //make a copy of entire list, to then keep track of which modules we haven't yet taken into account
        var availableResources = []; //keep track of which resources are provided so far
        
        self.moduleExecutionOrder = []; //clear old execution order
        
        var moduleInserted = true; //initial entry
        while (moduleInserted)
        {
            moduleInserted = false; //assume negative
            
            //sweep through unvisited modules to see if they fit in the configuration (all resources are provided for them)
            for (var i=0; i<remainingModules.length; ++i)
            {
                var gotAllRequiredResources = true; //starting with positive assumption, until found a missing resource (AND)
                for (var j=0; j<remainingModules[i].requiredResources.length; ++j)
                {
                    var gotRequiredResource = false; // starting with negative assumption, but change to true if found match (OR)
                    if (remainingModules[i].isResourceOptional(remainingModules[i].requiredResources[j]))
                    {
                        gotRequiredResource = true;
                    }
                    else
                    {
                        for (var k=0; k<availableResources.length; ++k)
                        {
                            if (remainingModules[i].requiredResources[j].name == availableResources[k].name)
                            {
                                gotRequiredResource = true;
                                break;
                            }
                        }
                    }
                    if (!gotRequiredResource)
                    {
                        gotAllRequiredResources = false;
                        break;
                    }
                }
                if (gotAllRequiredResources)
                {
                    //this module can be added to the configuration,
                    self.moduleExecutionOrder.push(remainingModules[i]);
                    
                    //add its provided resources to the list,
                    for (var j=0; j<remainingModules[i].providedResources.length; ++j)
                    {
                        availableResources.push(remainingModules[i].providedResources[j]);
                    }
                    
                    //and remove the module from the remaining list
                    remainingModules.splice(i,1);
                    i--; //go back one index, due to the removal
                    
                    moduleInserted = true; //flag change
                }
            }
        }
        
        //sanity check
        if (remainingModules.length > 0)
        {
            console.log("Terrible error in updateModuleExecutionOrder() - modules still remaining after sweep !");
            for (var i=0; i<remainingModules.length; ++i)
            {
                console.log("> "+remainingModules[i].name);
            }
        }
        else
        {
            console.log("Computed new module execution order !");
            for (var i=0; i<self.moduleExecutionOrder.length; ++i)
            {
                console.log(i+": "+self.moduleExecutionOrder[i].name);
            }
        }
    },
    
    /**
     * Check whether this module has been loaded
     * @param  {String} moduleName Name of module to be checked
     * @return {int}               Returns the index if the module was loaded, -1 otherwise
     *
     * @memberof Mainframe#
     */
    moduleLoaded: function(moduleName)
    {
        var self = this;
        
        for (var i=0; i<self.loadedModules.length; ++i)
        {
            if (self.loadedModules[i].name == moduleName) return i;
        }
        return -1;
    },

    /**
     * Check whether this module has been registered
     * @param  {String} moduleName Name of the module to be checked
     * @return {int}               Returns the index if the module was registered, -1 otherwise
     *
     * @memberof Mainframe#
     */
    moduleRegistered: function(moduleName)
    {
        var self = this;
        
        for (var i=0; i<self.registeredModules.length; ++i)
        {
            if (self.registeredModules[i].name == moduleName) return i;
        }
        return -1;
    },
    
    /**
     * Check whether this resource has been registered
     * @param  {Resource} resource Reference to resource object to be checked
     * @return {int}               Returns the index if the resource was registered, -1 otherwise
     *
     * @memberof Mainframe#
     */
    providedResourceRegistered: function(resource)
    {
        var self = this;
        
        for (var i=0; i<self.registeredResources.length; ++i)
        {
            if (self.registeredResources[i] == resource) return i;
        }
        
        return -1;
    },
    
    /**
     * Schedule a file dependency for loading, if not already loaded
     * @param {String} dep URL of the file dependency
     *
     * @memberof Mainframe#
     */
    addModuleDependency: function(dep)
    {
        var self = this;
        
        var alreadyLoaded = false;
        for (var i=0; i<self.loadedModuleDependencies.length; ++i)
        {
            if (self.loadedModuleDependencies[i].equals(dep))
            {
                alreadyLoaded = true;
                console.log("Dependency already loaded");
                break;
            }
        }
        
        if (alreadyLoaded)
        {
            console.log("Dependency "+dep.scriptName+" of "+dep.clientModule+" module already loaded ! If this is a name coincidence, please rename your dependency.");
            return;
        }
        
        dep.pending = true;
        self.loadedModuleDependencies.push(dep);
        
        loadScript(dep.dir+"/"+dep.name, function(){dep.pending = false;console.log("Dependency loaded by "+dep.module+" module: "+dep.name);});
    },
    
    /**
     * Mainframe step function; executes the run method of each registered module
     * @return {void}
     *
     * @memberof Mainframe#
     */
    run: function()
    {
        var self = this;
        
        requestAnimationFrame(self.run.bind(this));

        if (!unityWebGLContentLoaded)
        {
            console.log("Waiting for Unity to load...");
            return;
        }
        
        //if (!self.finishedLoading && self.hasSomethingToLoad) return;
        
        if (self.configurationCompatible)
        {
            //console.log("Mainframe running...");
            
            //run all modules
            //as an optimization, this order has been precomputed and the 
            //modules are already sorted in a compatible configuration

            for (var i=0; i<self.moduleExecutionOrder.length; ++i)
            {


                // console.log(self.moduleExecutionOrder[i]);


                // console.log("!!!!!!!!!!!!!!" + self.moduleExecutionOrder[i].name);

                self.moduleExecutionOrder[i].run();
            }
        }
    }
});

/*****************************************************************\
** Modules
\*****************************************************************/

/**
 * All modules inherit from this (treated as abstract class)
 * @class
 */
var AbstractModule = Class.create
({
    /**
     * AbstractModule class constructor
     * @params {Dict}  Parameters for this module
     * @return {void}
     *
     * @memberof AbstractModule#
     */
    initialize: function(params)
    {
        var self = this;
        
        self.name = "unknown"; //unknown name, to be overridden by subclasses
        self.type = ModuleType.Unknown; //unknown type, to be overridden
        self.mandatory = false; //is this module mandatory ? to be overridden
        self.active = false;

        self.parameters = params;
        
        self.requiredResources = []; //to be filled by subclasses
        self.providedResources = []; //to be filled by subclasses
        
        self.optionalResources = []; //nice to have, but not necessary
    },
    
    /**
     * Usually called by the mainframe after registration to activate the module
     * @param {bool} active Activation state
     *
     * @memberof AbstractModule#
     */
    setActive: function(active)
    {
        var self = this;
        
        self.active = true;
    },
    
    /**
     * Check if this resource is flagged as optional in its module (need not be provided)
     * @param  {Resource}  resource Reference to resource object
     * @return {Boolean}            Returns true if this resource is optional, false otherwise
     *
     * @memberof AbstractModule#
     */
    isResourceOptional: function(resource)
    {
        var self = this;
        for (var i=0; i<self.optionalResources.length; ++i)
        {
            if ((self.optionalResources[i] != undefined) && (resource.name == self.optionalResources[i].name)) return true;
        }
        return false;
    },
    
    /**
     * Called by mainframe when a new configuration is validated; can be used to clean internal module data
     * @return {void}
     *
     * @memberof AbstractModule#
     */
    cleanup: function()
    {
        //do module-specific cleanup (in subclasses)
    },
    
    /**
     * Module step function; called by the mainframe
     * @return {void}
     *
     * @memberof AbstractModule#
     */
    run: function()
    {
        //to be overridden by subclasses
        console.log("WARNING: Default run method used !");
    }
});

/*****************************************************************\
** Resources
\*****************************************************************/

/**
 * All resources inherit from this (treated as abstract class)
 * @class
 */
var Resource = Class.create
({
    /**
     * Resource constructor
     * @return {void}
     *
     * @memberof Resource
     */
    initialize: function()
    {
        var self = this;
        
        self.name = "unknown"; //unknown name for resource, to be overridden by subclasses
        self.container = {}; //all data goes in here
    }
});

/**
 * Implements a resource containing a facial expression
 * @class
 * @augments Resource
 */
var FacialExpression = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "FacialExpression";
        self.container.data = {};
        self.container.data[Emotion.Anger] = 0.0;
        self.container.data[Emotion.Contempt] = 0.0;
        self.container.data[Emotion.Disgust] = 0.0;
        self.container.data[Emotion.Embarrassment] = 0.0;
        self.container.data[Emotion.Fear] = 0.0;
        self.container.data[Emotion.Happiness] = 0.0;
        self.container.data[Emotion.Pride] = 0.0;
        self.container.data[Emotion.Sadness] = 0.0;
        self.container.data[Emotion.Surprise] = 0.0;
    }
});

/**
 * Implements a resource containing a facial position of the user in front of the camera
 * @class
 * @augments Resource
 */
var UserFacePosition = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "UserFacePosition";
        self.container.posX = 0.0;
        self.container.posY = 0.0;

        self.camSizeWidth = 640;
        self.camSizeHeight = 480;

        self.deltaX = 0;
        self.deltaY = 0;

        self.positionHasChangedX = 0;
        self.positionHasChangedY = 0;

        self.lastX = 0;
        self.lastY = 0;

        self.timeLast = Date.now();
        self.hasStarted = false;
    }

});

/**
 * Implements a resource containing the facial expression of the User
 * @class
 * @augments FacialExpression
 */
var UserFacialExpression = Class.create(FacialExpression,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "UserFacialExpression";
    }
});

/**
 * Implements a resource containing the facial expression of the Character
 * @class
 * @augments FacialExpression
 */
var CharacterFacialExpression = Class.create(FacialExpression,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterFacialExpression";
    }
});

/**
 * Implements a resource containing a string
 * @class
 * @augments Resource
 */
var Text = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "Text";
        self.container.text = "";
        self.container.timestamp = 0;
    }
});

/**
 * Implements a resource containing the final speech recognition transcript of the User
 * @class
 * @augments Text
 */
var UserText = Class.create(Text,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "UserText";
    }
});

/**
 * Implements a resource to indicate is the counselor is currently nodding in response to user
 * @class
 * @augments Text
 */
var IsNodding = Class.create(Resource,
    {
        initialize: function($super)
        {
            var self = this;

            $super();

            self.name = "IsNodding";
            self.container.isNodding = false;
        }
    });

/**
 * Implements a resource containing the interim speech recognition transcript of the User
 * @class
 * @augments Text
 */
var InterimUserText = Class.create(Text,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "InterimUserText";
    }
});

var MongoElementJSON = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        $super();

        self.name = "MongoElementJSON";

        self.container.json = null;
        self.container.timestamp = null;
    }
});

var MongoElementIteration = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        $super();

        self.name = "MongoElementIteration";

        self.container.iter = 0;
    }
});

/**
 * Implements a resource containing a text annotated with Parts Of Speech
 * @class
 * @augments Resource
 */
var PosText = Class.create(Resource,
{
    initialize: function($super)
    {
        var self =this;
        $super();
        
        self.name ="PosText";
        
        self.container.text = [];
        self.container.pos = [];
        
    }
});

/**
 * Implements a resource containing the result of text sentiment analysis
 * @class
 * @augments Resource
 */
var SentimentText = Class.create(Resource,
{
    initialize: function($super)
    {
        var self =this;
        $super();
        
        self.name ="Sentiment";
        
        self.container.sentiment = [];
        
    }
});

/**
 * Implements a resource containing a string representing what the Character must say
 * @class
 * @augments Resource
 */
var CharacterText = Class.create(Text,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterText";
    }
});

/**
 * Implements a resource containing a WebRTC video stream from the User's camera
 * @class
 * @augments Resource
 */
var VideoStream = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "VideoStream";
        self.container.videoStream = null;
    }
});

/**
 * Implements a resource containing a THREE.js mesh object
 * @class
 * @augments Resource
 */
var Mesh3D = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "Mesh3D";
        self.container.mesh = null;
        self.container.pending = true; //Tagged as pending if the mesh hasn't been loaded yet, becomes false as soon as it is loaded
        self.container.visible = false;
        self.container.timestamp = 0; //Whether the mesh has changed somehow...
        
        self.container.animations = [];
        self.container.mixer = null;
    }
});

/**
 * Implements a resource containing a WebRTC audio stream
 * @class
 * @augments Resource
 */
var CharacterAudioStream = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterAudioStream";
        self.container.audioStream = null;
        self.container.visemes = null;
        self.container.bookmarks = null;
        self.container.timestamp = 0;
    }
});

/**
 * Implements a resource containing a question and set of answers that are plotted in the application
 * @class
 * @augments Resource
 */
var InterviewQA = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "InterviewQA";         
        
        self.container.questionId = 0;
        
        self.container.question = '';
        self.container.answers = []; //indices are db ids and content is text
    }
});

/**
 * Implements a resource containing the user's choice based on clicking an answer
 * @class
 * @augments Resource
 */
var UserInterviewChoice = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "UserInterviewChoice";
        
        self.container.choice = -1;
        self.container.isHint = false;
        self.container.isVolume = false;
        self.container.understood = false;
        self.container.timestamp = 0;
    }
});

/**
 * Implements a resource containing a flag representing whether the character is currently speaking
 * @class
 * @augments Resource
 */
var CharacterIsSpeaking = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterIsSpeaking";
        
        self.container.speaking = false;
    }
});

/**
 * Implements a resource containing a flag to keep track whether the character is ready to receive microphone input data
 * @class
 * @augments Resource
 */
var CharacterIsListening = Class.create(Resource, 
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterIsListening";
        
        self.container.listening = false;
    }
});

/**
 * Resource that keeps track of every Valence for the Decision Tree each valence is tracked per question.
 * @class
 * @augments Resource
 */
var TreeValence = Class.create(Resource,
{
    initialize : function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "TreeValence";
      
        /*
        self.container.questionValence = ["","","","","","","","","",""];
        self.container.answerValence = ["","","","","","","","","",""];
        self.container.scoreValence = ["","","","","","","","","",""];
        */
        self.container.questionValence = "";
        self.container.answerValence = "";
        self.container.scoreValence = "";
        
        self.container.lastTime = 0;
        self.container.currentTime = 0;
    }
});

/**
 * Resource that contains the current behavior of the character, based on the Decision Tree
 * @class
 * @augments Resource
 */
var DecisionTree = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
    
        $super();
    
        self.name = "DecisionTree";
    
        self.container.behavior = [];
    }
});

/**
 * Resource that contains the current interview cumulative risk score
 * @class
 * @augments Resource
 */
var InterviewRiskScore = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "InterviewRiskScore";
        
        self.container.riskScore = 0;
    }
});

/*
** Resource to specify which actions should be played by the character
*/

/**
 * Helper class for CharacterActions resource
 * @class
 * @memberof CharacterActions
 */
var CharacterAction = Class.create //helper class for CharacterActions resource
({
    initialize: function()
    {
        self.active = false;
        self.timeScale = 1.0;
    }
});

/**
 * Resource that contains the current actions performed by the character
 * @class
 * @augments Resource
 */
var CharacterActions = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterActions";
        
        self.container.actions = [];
        
        for (var i=0; i<CounselorAction.length; ++i) //assuming "length" exists and is correctly set in the enum
        {
            self.container.actions.push(new CharacterAction());
        }
    }
});

/**
 * Resource that contains the current eye gaze direction of the character
 * @class
 * @augments Resource
 */
var CharacterEyeGaze = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "ChracterEyeGaze";
        
        self.container.vdir = 0; //vertical
        self.container.hdir = 0; //horizontal
        self.container.normalX = 0; //horizontal - ehenl001@fiu.edu for eye gaze 2017
        self.container.normalY = 0; //vertical - ehenl001@fiu.edu for eye gaze 2017
    },
    
    getMorphTargetValues: function()
    {
        var self = this;
        
        var lookUpValue = 0;
        var lookDownValue = 0;
        var lookLeftValue = 0;
        var lookRightValue = 0;
        
        if (self.container.vdir >= 0) lookUpValue = self.container.vdir;
        else lookDownValue = -self.container.vdir;
        
        if (self.container.hdir >= 0) lookLeftValue = self.container.hdir;
        else lookRightValue = -self.container.hdir;
        
        return [lookUpValue, lookDownValue, lookLeftValue, lookRightValue];
    }
});

/**
 * Resource that contains the id of the character's voice
 * @class
 * @augments Resource
 */
var CharacterVoice = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterVoice";
        
        self.container.voice = 0;
    }
});

/**
 * Resource that contains the current character info
 * @class
 * @augments Resource
 */
var SelectedCharacterInfo = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "SelectedCharacterInfo";
        self.container.modName = "";
        self.container.uri = "";
        self.container.friendlyName = "";
        self.container.friendlyDescription = "";
        self.container.timestamp = 0;
    }
});

/**
 * Resource that contains the ready state of the character
 * @class
 * @augments Resource
 */
var CharacterLoaded = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterLoaded";
        self.container.ready = false;
        self.container.timestamp = 0;
    }
});

/**
 * Resource that contains a reference to the global load manager
 * @class
 * @augments Resource
 */
var LoadManagerReference = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "LoadManagerReference";
        self.container.mgr = null;
    }
});

/**
 * Resource that controls the microphone on/off state
 * @class
 * @augments Resource
 */
var MicrophoneState = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "MicrophoneState";
        self.container.state = true; //on by default
    }
});

/**
 * Resource that contains a user command
 * @class
 * @augments Resource
 */
var UserCommand = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;

        $super();

        self.name = "UserCommand";
        self.container.cmd = null;
        self.container.timestamp = 0;
    }
});

/**
 * Resource that controls the visibility of the referral source panel
 * @class
 * @augments Resource
 */
var ReferralSourceUIStatus = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;

        $super();

        self.name = "ReferralSourceStatus";
        self.container.visible = false;
        self.container.timestamp = 0;
    }
});

/**
 * Resource that contains the id of the current question
 * @class
 * @augments Resource
 */
var CurrentQuestionInfo = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;

        $super();

        self.name = "CurrentQuestionID";
        self.container.id = -1;
        self.container.nrOfAnswers = -1;
        //self.container.valence = 0; //not used
        self.container.timestamp = 0;
    }
});

/**
 * Resource that contains the id of the current answer
 * @class
 * @augments Resource
 */
var CurrentAnswerInfo = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;

        $super();

        self.name = "CurrentAnswerID";
        self.container.id = -1;
        self.container.riskScore = 0;
        self.container.timestamp = 0;
    }
});

/**
 * Resource that contains a friendly name for the current character
 * @class
 * @augments Resource
 */
var CharacterUserFriendlyName = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;

        $super();

        self.name = "CharacterUserFriendlyName";
        self.container.name = "";
    }
});

/**
 * Resource that contains a list of user preferences
 * @class
 * @augments Resource
 */
var UserSettings = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;

        $super();

        self.name = "UserSettings";

        self.container.useCharacterEyelashes = true; //default
    }
});

/**
 * Resource that contains a list of Action Unit values
 * @class
 * @augments Resource
 */
var AUValues = Class.create(Resource,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "AUValues";
        self.container.data = {};
        for (var i=0; i<AUNames.TOTAL; ++i)
        {
            self.container.data[i] = 0.0;
        }
    }
});

/**
 * Resource that contains a list of Action Unit values for the Character to express
 * @class
 * @augments AUValues
 */
var CharacterAUValues = Class.create(AUValues,
{
    initialize: function($super)
    {
        var self = this;
        
        $super();
        
        self.name = "CharacterAUValues";
    }
});