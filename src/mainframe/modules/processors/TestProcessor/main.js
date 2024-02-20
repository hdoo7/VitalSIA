
/**
* @class TestProcessor
* nheriting from AbstractModule class
* @method initialize
* @param {String} foo Argument 1
* @param {Object} config A config object
* @param {String} config.name The name on the config object
* @param {Function} config.callback A callback function on the config object
* @param {Boolean} [extra=false] Do extra, optional work
* @return {Boolean} Returns true on success
*/

/**
* @file TestProcessor
* @author: Mihai Polceanu
* E-mail: mpolcean@cs.fiu.edu
*/


var TestProcessor = Class.create(AbstractModule,
{
    // @method initialize
    // this called once
    initialize: function($super, params)
    {
        var self = this;
        self.eyesOpen = 1;
        
        $super(params);
        
        self.name = "TestProcessor";
        self.type = ModuleType.Processor;
        self.mandatory = false; 
        
        //console.log("From initialize: ");
        //console.log(self.eyesOpen);
    },
    
    // @method run
    // this called once per frame
    run: function()
    {   var self = this;
  

        //do nothing
        //console.log("Local time: "+new Date().toLocaleTimeString()); //Assignment 1
        
        if ( self.eyesOpen )
        {
            // close them
            //console.log("Closing eyes now");
            facslib.setTargetAU("45", 100, "", 0.0001);
            self.eyesOpen = 0;
            //console.log(self.eyesOpen);
        }
        if ( self.timeHasPassed(5) )
        {
            // close them
            //console.log("Closing eyes now");
            facslib.setTargetAU("45", 100, "", 0.0001);
            self.eyesOpen = 0;
            //console.log(self.eyesOpen);
        } else {
            
        }
        // Assignment 2

        
    }
});