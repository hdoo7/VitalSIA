/*
** Test module
** Author: Mihai Polceanu, Daniel Rivero
** E-mail: mpolcean@cs.fiu.edu, drive076@fiu.edu
*/

var UserCommandInterpreter = Class.create(AbstractModule,
{
    initialize : function($super, params)
    {
        var self = this;
   
        $super(params);
        
        self.name = "UserCommandInterpreter";
        self.type = ModuleType.Processor;
        self.mandatory = false;
        
        self.divID = "question";
        
        self.resourceNames = {
            R_INTERIMUSERTEXT: 0,
            
            P_USERCOMMAND: 0
        };
        
        self.requiredResources[self.resourceNames.R_INTERIMUSERTEXT] = new InterimUserText();
        self.optionalResources[self.resourceNames.R_INTERIMUSERTEXT] = new InterimUserText();
        
        self.providedResources[self.resourceNames.P_USERCOMMAND] = new UserCommand();
        
        self.lastUserSpoke = 0;
        
        self.numMap = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
        self.replacements = {};
        self.replacements["sex"] = "six";
       
        self.commandList = [
            new VoiceCommandPattern(UserCommandID.GO_TO_PREVIOUS_QUESTION, [
                ["go","back"],
                ["previous","question"],
                ["go","previous"],
                ["back","question"],
                ["last","question"]
            ]),
            new VoiceCommandPattern(UserCommandID.YES, [
                ["yes"],
                ["yeah"],
                ["yep"],
                ["yup"]
            ]),
            new VoiceCommandPattern(UserCommandID.NO, [
                ["no"],
                ["neah"],
                ["nope"]
            ])
        ];
    },
    getAngularElement : function()
    {
        var self = this;

        var appElement = document.querySelector('[id=inputPanel]');//webgl-app]');
        var scope = angular.element(appElement).scope();

        if(scope === undefined)
        {
            setTimeout(function() {
                self.getAngularElement();
            }, 10);
            return;
        }

        self.controllerScope = scope;
        //console.log(scope);
        self.angularScope = scope.$root;
        //console.log(self.angularScope);
    },
    run : function()
    {
        var self = this;

        self.getAngularElement();

        // if (self.requiredResources[self.resourceNames.R_INTERIMUSERTEXT].container.timestamp > self.lastUserSpoke || self.angularScope.usrCmd.goBack)
        // {
        //     var userText = self.requiredResources[self.resourceNames.R_INTERIMUSERTEXT].container.text;
        //     var rightNow = Date.now();
        //     console.log("inUserCommandInterperter");

        //     if(self.angularScope.usrCmd.goBack){
        //         userText = "go back";
        //         self.angularScope.usrCmd.goBack = false;
        //     }

        //     for (var i=0; i<self.commandList.length; ++i)
        //     {
        //         if (self.commandList[i].match(userText))
        //         {
        //             //update resource
        //             self.providedResources[self.resourceNames.P_USERCOMMAND].container.cmd = self.commandList[i].cmd;
        //             self.providedResources[self.resourceNames.P_USERCOMMAND].container.timestamp = rightNow;
        //         }
        //     }

        //     self.lastUserSpoke = rightNow;
        // }
    }
});
