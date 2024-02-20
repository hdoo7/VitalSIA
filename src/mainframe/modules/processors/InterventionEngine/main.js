/*
** Test module
** Author: Mihai Polceanu, Daniel Rivero
** E-mail: mpolcean@cs.fiu.edu, drive076@fiu.edu
*/

/*****************************************************************\
** Intervention Engine
\*****************************************************************/

var Intervention_DCU_base = Class.create(AbstractModule,
{
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "Intervention_DCU_base";
        self.type = ModuleType.Processor;
        self.mandatory = false; //is this model mandatory ? to be overriden
        
        //will add later when I figure out what resource we're using
        self.resourceNames = {
            R_USERCHOICE: 0,
            R_CHARSPEAKING: 1,
            R_CHARLISTENING: 2,
            R_CHARSPEECH: 3,
            R_INTERIMUSERTEXT: 4,
            R_USERCOMMAND: 5,
            R_CHARUSERFRIENDLYNAME: 6,
            
            P_QA: 0,
            P_CHARTEXT: 1,
            P_RISKSCORE: 2,
            P_MICSTATE: 3,
            P_REFERRALSTATUS: 4,
            P_CRTQUESTIONINFO: 5,
            P_CRTANSWERINFO: 6,
            P_ELEMENTJSON: 7,
            P_ELEMENTITERATION: 8 //for multi-phrases
        };
        
        self.requiredResources[self.resourceNames.R_USERCHOICE] = new UserInterviewChoice();
        self.optionalResources[self.resourceNames.R_USERCHOICE] = new UserInterviewChoice(); //make optional
        self.requiredResources[self.resourceNames.R_CHARSPEAKING] = new CharacterIsSpeaking();
        self.optionalResources[self.resourceNames.R_CHARSPEAKING] = new CharacterIsSpeaking(); //make optional
        self.requiredResources[self.resourceNames.R_CHARLISTENING] = new CharacterIsListening();
        self.optionalResources[self.resourceNames.R_CHARLISTENING] = new CharacterIsListening(); //make optional
        self.requiredResources[self.resourceNames.R_CHARSPEECH] = new CharacterAudioStream();
        self.optionalResources[self.resourceNames.R_CHARSPEECH] = new CharacterAudioStream(); //make optional
        self.requiredResources[self.resourceNames.R_INTERIMUSERTEXT] = new InterimUserText();
        self.optionalResources[self.resourceNames.R_INTERIMUSERTEXT] = new InterimUserText(); //make optional
        self.requiredResources[self.resourceNames.R_USERCOMMAND] = new UserCommand();
        self.optionalResources[self.resourceNames.R_USERCOMMAND] = new UserCommand(); //make optional
        self.requiredResources[self.resourceNames.R_CHARUSERFRIENDLYNAME] = new CharacterUserFriendlyName();
        
        self.providedResources[self.resourceNames.P_QA] = new InterviewQA();
        self.providedResources[self.resourceNames.P_CHARTEXT] = new CharacterText();
        self.providedResources[self.resourceNames.P_RISKSCORE] = new InterviewRiskScore();
        self.providedResources[self.resourceNames.P_MICSTATE] = new MicrophoneState();
        self.providedResources[self.resourceNames.P_REFERRALSTATUS] = new ReferralSourceUIStatus();
        self.providedResources[self.resourceNames.P_CRTQUESTIONINFO] = new CurrentQuestionInfo();
        self.providedResources[self.resourceNames.P_CRTANSWERINFO] = new CurrentAnswerInfo();
        self.providedResources[self.resourceNames.P_ELEMENTJSON] = new MongoElementJSON();
        self.providedResources[self.resourceNames.P_ELEMENTITERATION] = new MongoElementIteration();
        
        self.nickname = ""; //TODO: should be moved to a separate UserInfo module, along with other info
        
        self.feedbackArray = [];
        self.feedbackMap = {};
        // self.getFeedback(self.feedbackLink); //deprecated
        // self.feedbackLoaded = false;

        self.lastCommandTime = 0;
        
        self.intervention = null;
        self.initializeIntervention();
    },
    
    initializeIntervention: function()
    {
        var self = this;

        // console.log("InterventionEngine initializeIntervention()")
        
        // if (!self.feedbackLoaded) return;

        var resourceBox = new ResourceBox(self.requiredResources, self.providedResources, self.resourceNames, self.feedbackMap);

        //dynamically loads whatever class was passed as parameter in the app config xml
        if (typeof window[self.parameters["interventionClass"]] !== "function"){
            console.log("[ERROR] Could not find state machine for given xml configuration.");
        } else {
            self.intervention = new window[self.parameters["interventionClass"]]({}, [], resourceBox);
        }
    },
    
    // getFeedback : function(feedbackURL)
    // {
    //     var self = this;
        
    //     self.feedbackMap["Misunderstanding"] = new Placeholder();
    //     self.feedbackMap["MisunderstandingWithHints"] = new Placeholder();
    //     self.feedbackMap["ResetAnswerChoice"] = new Placeholder();
    //     self.feedbackMap["GreetUser"] = [];
    //     self.feedbackMap["LowRangeFeedback"] = [];
    //     self.feedbackMap["MediumRangeFeedback"] = [];
    //     self.feedbackMap["HighRangeFeedback"] = [];
        
    //     jQuery(function($)
    //     {
    //         jQuery.get(feedbackURL, function(d)
    //         {
    //             jQuery(d).find('Misunderstanding').each(function()
    //             {
    //                 var feedback = jQuery(this);
                    
    //                 console.log(feedback.attr("text").toString());
    //                 self.feedbackMap["Misunderstanding"].addValues(feedback.attr("text").toString());
    //             });
                
    //             jQuery(d).find('MisunderstandingWithHints').each(function()
    //             {
    //                 var feedback = jQuery(this);
                    
    //                 self.feedbackMap["MisunderstandingWithHints"].addValues(feedback.attr("text").toString());
    //             });

    //             //====================================================//
    //             //TODO: put this in the DB
    //             self.feedbackMap["ResetAnswerChoice"].addValues("Oh, sorry, say again");

    //             self.feedbackMap["GreetUser"].push(new Placeholder("Hello, I'm [NAME], a virtual health assistant.".replace("[NAME]", self.requiredResources[self.resourceNames.R_CHARUSERFRIENDLYNAME].container.name)));
    //             self.feedbackMap["GreetUser"].push(new Placeholder("I am an expert in motivational interviewing,"));
    //             self.feedbackMap["GreetUser"].push(new Placeholder("in which I assess people's lifestyle and provide them with feedback about it,"));
    //             self.feedbackMap["GreetUser"].push(new Placeholder("and collaborate with them to make plans to change."));
    //             self.feedbackMap["GreetUser"].push(new Placeholder("I still don't have all my intelligence integrated yet,"));
    //             self.feedbackMap["GreetUser"].push(new Placeholder("but people say I'm able to help them!"));

    //             self.feedbackMap["LowRangeFeedback"].push(new Placeholder("Thank you for providing this information."));
    //             self.feedbackMap["LowRangeFeedback"].push(new Placeholder("Let me summarize our conversation and your responses."));
    //             self.feedbackMap["LowRangeFeedback"].push(new Placeholder("Your score is in low range."));
    //             self.feedbackMap["LowRangeFeedback"].push(new Placeholder("It is unlikely that you have a problem with alcohol, if you have been completely honest and that your answers represent your normal consumption behavior."));
    //             self.feedbackMap["LowRangeFeedback"].push(new Placeholder("It was my pleasure talking to you."));
    //             self.feedbackMap["LowRangeFeedback"].push(new Placeholder("Stay healthy."));
                
    //             self.feedbackMap["MediumRangeFeedback"].push(new Placeholder("Thank you for providing this information."));
    //             self.feedbackMap["MediumRangeFeedback"].push(new Placeholder("Let me summarize our conversation and your responses."));
    //             self.feedbackMap["MediumRangeFeedback"].push(new Placeholder("Your score is in medium range."));
    //             self.feedbackMap["MediumRangeFeedback"].push(new Placeholder("This suggests that your drinking may be hazardous or harmful."));
    //             self.feedbackMap["MediumRangeFeedback"].push(new Placeholder("People with scores in this range may already have experienced some difficulties as a result of their drinking."));
    //             self.feedbackMap["MediumRangeFeedback"].push(new Placeholder("If you choose to, you can find out more and find some support at the following substance use referral sources."));
    //             self.feedbackMap["MediumRangeFeedback"].push(new Placeholder("It was my pleasure talking to you. Stay healthy."));
                
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("Thank you for providing this information."));
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("Let me summarize our conversation and your responses."));
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("Your score is in the high range."));
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("People who score in this range are already experiencing some negative consequences from their drinking."));
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("We recommend to people in this range that they consider changing their drinking."));
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("If you choose to, you can find out more and find some support at the following substance use referral sources."));
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("It was my pleasure to talk to you."));
    //             self.feedbackMap["HighRangeFeedback"].push(new Placeholder("Stay healthy."));
    //             //====================================================//
                
    //             self.feedbackLoaded = true;
    //             self.initializeIntervention();
    //         });
    //     });
    // },
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
    
    run: function()
    {
        var self = this;

        self.getAngularElement();

        if (self.intervention === null) return;

        /*console.log("InterventionEngine run()");*/
        
        if (self.requiredResources[self.resourceNames.R_USERCOMMAND].container.timestamp > self.lastCommandTime)
        {
            if (self.requiredResources[self.resourceNames.R_USERCOMMAND].container.cmd === UserCommandID.GO_TO_PREVIOUS_QUESTION)
            {
                self.intervention.sendEvent("goToPreviousQuestion");
                console.log("Sent event: goToPreviousQuestion");
            }
            if (self.requiredResources[self.resourceNames.R_USERCOMMAND].container.cmd === UserCommandID.YES)
            {
                self.intervention.sendEvent("goBackOneQuestionConfirmed");
                console.log("Sent event: goBackOneQuestionConfirmed");
            }
            if (self.requiredResources[self.resourceNames.R_USERCOMMAND].container.cmd === UserCommandID.NO)
            {
                self.intervention.sendEvent("goBackOneQuestionCanceled");
                console.log("Sent event: goBackOneQuestionCanceled");
            }
            

            self.lastCommandTime = self.requiredResources[self.resourceNames.R_USERCOMMAND].container.timestamp;
        }

        self.intervention.execute();
    }
});

var Intervention_DCU = Class.create(Intervention_DCU_base,
{
    initialize: function($super, params)
    {
        var self = this;
        
        // self.feedbackLink = config.baseDirectory+"/mainframe/utils/feedback.xml"; //deprecated
        
        $super(params);
        
        self.name = "Intervention_DCU"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Processor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden   
    }
});

var Intervention_DCU_legacy = Class.create(Intervention_DCU_base,
{
    initialize: function($super, params)
    {
        var self = this;
        
        self.QAlink = config.utilsDirectory + "/utils_getInterviewQAs_legacy.php";
        // self.feedbackLink = config.utilsDirectory + "/getFeedback.php";
        
        $super(params);
        
        self.name = "Intervention_DCU_legacy"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Processor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden   
    }
});