/*
** Test module
** Author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/


/*****************************************************************\
** Useful definitions
\*****************************************************************/

var Voice = Class.create
({
    initialize: function(id, name, gender, culture)
    {
        var self = this;
        
        self.id = id;
        self.name = name;
        self.gender = gender;
        self.culture = culture;
    }
});

/*****************************************************************\
** Win SAPI Speech Synthesis
\*****************************************************************/

var WinSAPISynth = Class.create(AbstractModule,
{
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "WinSAPISynth"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Processor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden
        
        self.resourceNames = {
            R_CHARTEXT: 0,
            R_CHARVOICE: 1,


            P_CHARSPEECH: 0
        };

        self.requiredResources[self.resourceNames.R_CHARTEXT] = new CharacterText("");
        console.log("chartext"+self.requiredResources[self.resourceNames.R_CHARTEXT]);

        
        self.requiredResources[self.resourceNames.R_CHARVOICE] = new CharacterVoice();
        self.optionalResources[self.resourceNames.R_CHARVOICE] = new CharacterVoice();

        self.providedResources[self.resourceNames.P_CHARSPEECH] = new CharacterAudioStream();


        
        //this.providedResources.push(new FacialExpression()); //dummy
        
        //Speech server params
        self.ttsUrl = /*location.protocol+*/'https://speech.virtualhealthcounseling.com/';
        self.serviceName = 'HapGLService.svc';
        
        //voice attributes
        self.voices = [];
        self.voicesLoaded = false;
        
        self.lastConvertedTextTimestamp = Date.now(); //keep track of which was the last modification in input
        
        //load voices
        jQuery(function($)
        {
            $.ajax({
                type: 'GET',
                url: self.ttsUrl + "/" + self.serviceName + "/getVoices"
            }).done(function(response) {
                var voices = JSON.parse(response).voices;
                $.each(voices, function(i, voice)
                {
                    self.voices.push(new Voice(voice.id, voice.name, voice.gender, voice.culture));
                    //console.log("voice ");
                    //console.log(self.voices[self.voices.length - 1]);
                });
                self.voicesLoaded = true;
            });
        });
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
    
    synthesize: function(text)
    {
        var self = this;


        if (self.voicesLoaded)
        {

            self.getAngularElement();
           /* console.log("******************voiceIndex***************************");
            console.log(self.angularScope);*/

           //Todo: Beginning - Remove following hack code
          /* //ejhenl001 added following hack to change emotion based on current element

            /!**************************************************
             * the following code is for the emotion test form
             **************************************************!/
            //element should be neutral ECDY6JYFnn
            //to go to neutral at the start of the Audit questionnaire(480OIkUfRe) and after the negative response (NTEyjG7JaV) - i.e. start of Q2 of Audit
            if(self.angularScope.elementData.id == "ECDY6JYFnn") {
                facslib.setNeutral(.25);
                facslib.updateEngine();
            }

            //element should be happiness 4k8kiFnBOe
            if(self.angularScope.elementData.id == "4k8kiFnBOe") {
                facslib.setTargetEmotion("Happiness", 80, 2);
                facslib.updateEngine();
            }
            //element should be sadness 2A6ebEzr2T
            if(self.angularScope.elementData.id == "2A6ebEzr2T") {
                facslib.setTargetEmotion("Sadness", 100, 2);
                facslib.updateEngine();
            }
            //element should be fear sTAD640MzD  setTargetEmotionString : function ( emotionString, intensity, smoothTime )
            /!*if(self.angularScope.elementData.id == "sTAD640MzD") {
                facslib.setTargetEmotion("Fear", 100, 2);
                facslib.updateEngine();
            }*!/
            if(self.angularScope.elementData.id == "sTAD640MzD") {
                facslib.setTargetEmotionString("1+2+4+5+7+20", 100, 2);
                facslib.updateEngine();
            }

            //element should be surprise yR1TsslGvT
            /!*if(self.angularScope.elementData.id == "yR1TsslGvT") {
                facslib.setTargetEmotion("Surprise", 100, 2);
                facslib.updateEngine();
            }*!/
            if(self.angularScope.elementData.id == "yR1TsslGvT") {
                facslib.setTargetEmotionString("1+2+5B", 100, 2);
                facslib.updateEngine();
            }
            //element should be anger KW9T2kKE3v
            if(self.angularScope.elementData.id == "KW9T2kKE3v") {
                facslib.setTargetEmotion("Anger", 100, 2);
                facslib.updateEngine();
            }
            //element should be disgust aNd0UZHAju
            if(self.angularScope.elementData.id == "aNd0UZHAju") {
                facslib.setTargetEmotion("Disgust", 100, 2);
                facslib.updateEngine();
            }
            //element should be contempt H1e5eJVxQS
            if(self.angularScope.elementData.id == "H1e5eJVxQS") {
                facslib.setTargetEmotion("Contempt", 100, 2);
                facslib.updateEngine();
            }
            /!**************************************************
             * the following code is for the emotion test for
             * the greeting - the first question of the audit
             **************************************************!/

            //to show concern after second question's bad/negative answer
           if(self.angularScope.elementData.id == "E6UjN8fAGu") {
               /!* facslib.setTargetAU("6", 70, "", 0.0001); //cheekRaiser
                facslib.setTargetAU("12", 70, "", 0.0001); //lipCornerPuller*!/
               facslib.setTargetAU("1", 70, "", 0.1);
               facslib.updateEngine();
               facslib.setTargetAU("4", 70, "", 0.1);
               facslib.updateEngine();
               facslib.setTargetAU("15", 25, "", 0.1);
               facslib.updateEngine();
               facslib.setTargetAU("54", 16, "", 3);
               facslib.updateEngine();
             /!*  facslib.setTargetAU("54", 0, "", .1);
               facslib.updateEngine();
               facslib.setTargetAU("54", 16, "", .1);
               facslib.updateEngine();
               facslib.setTargetAU("54", 0, "",.1);
               facslib.updateEngine();*!/
           }

           /!*
                *!/


            //to increase happiness to 50% in response to the first question
            if(self.angularScope.elementData.id == "xHBWFT9gU0") {
                facslib.setTargetAU("6", 50, "", 0.2); //cheekRaiser
                facslib.setTargetAU("12", 50, "", 0.2);
                facslib.updateEngine();
            }

            //to decrease happiness to 30% on start of the Audit
            if(self.angularScope.elementData.id == "480OIkUfRe") {
                facslib.setTargetAU("6", 30, "", 0.2); //cheekRaiser
                facslib.setTargetAU("12", 30, "", 0.2);
                facslib.updateEngine();
            }

           //to show Happiness during counselor's introduction
           if(self.angularScope.elementData.id == "GRUIsUejod"){
               facslib.setTargetAU("6", 70, "", 0.1); //cheekRaiser
               facslib.setTargetAU("12", 70, "", 0.1);
               facslib.updateEngine();
           }

           //to show Smile in response of declining the tour at the beginning
            if(self.angularScope.elementData.id == "rrdU1gJKHF"){
                facslib.setTargetAU("6", 70, "", 0.1); //cheekRaiser
                facslib.setTargetAU("12", 70, "", 0.1);
                facslib.updateEngine();
            }

            //to minimize Happiness (as transition from introduction to the rest of the greeting) and from concern to the last question
            if(self.angularScope.elementData.id == "Dau3sWlKLA" || self.angularScope.elementData.id == "3b8HApHIsW" || self.angularScope.elementData.id == "TRbkGxXZij"){
                facslib.setTargetAU("6", 30, "", 0.2); //cheekRaiser
                facslib.setTargetAU("12", 30, "", 0.2);
                facslib.updateEngine();
            }
            if(self.angularScope.elementData.id == "3b8HApHIsW"){
                facslib.setNeutral(2.5);
                facslib.setTargetAU("6", 30, "", 0.2); //cheekRaiser
                facslib.setTargetAU("12", 30, "", 0.2);
                facslib.updateEngine();
            }

            //to go to neutral at the start of the Audit questionnaire(480OIkUfRe) and after the negative response (NTEyjG7JaV) - i.e. start of Q2 of Audit
            if(self.angularScope.elementData.id == "NTEyjG7JaV") {
                /!* facslib.setTargetAU("6", 70, "", 0.0001); //cheekRaiser
                 facslib.setTargetAU("12", 70, "", 0.0001); //lipCornerPuller*!/
                facslib.setNeutral(.5);
                facslib.updateEngine();
            }

           //end of hack code added by ejhenl001*/
          //Todo: End

            jQuery(function($){
                $.ajax({
                    type: 'GET',
                    //url: self.ttsUrl + "/" + self.serviceName + "/speak?text=" + encodeURI(text) + "&voice=" + encodeURI(self.voices[self.requiredResources[self.resourceNames.R_CHARVOICE].container.voice].id)
                    //To switch to the default voice being used, revision from NeoSpeech slunn002 2017/04/20

                    /*A note on how voices are being accessed: the following line gets the appropriate counselor voice based on the user selected counselor.
                    * The voices are located in the db and use an index to indicate which voice is to be used.  This index is within the square brackets and is
                    * self.angularScope.selectedCounselorVoice.  We get the root scope, self.angularScope, via the function getAngularElement().  This function
                    * basically grabs the scope of an available html element in the current view(in this case its the selector with id = inputPanel) and then grabs the rootscope via the
                    * aforementioned scope.  The attribute selectedCounselorVoiceIndex is saved via the webgl controller in the init function after unity has loaded. */
                    url: self.ttsUrl + "/" + self.serviceName + "/speak?text=" + encodeURI(text) + "&voice=" + encodeURI(self.voices[self.angularScope.selectedCounselorVoiceIndex].id)
                }).done(function(response) {
                    var speechInfo = JSON.parse(response);

                    self.providedResources[self.resourceNames.P_CHARSPEECH].container.audioStream = (speechInfo.audioFormat + "," + speechInfo.audioStream);
                    self.providedResources[self.resourceNames.P_CHARSPEECH].container.visemes = speechInfo.visemes;
                   /* console.log("************SPEECH INFO**********************");
                    console.log(speechInfo);*/
                    self.providedResources[self.resourceNames.P_CHARSPEECH].container.bookmarks = speechInfo.bookmarks;
                    self.providedResources[self.resourceNames.P_CHARSPEECH].container.timestamp = Date.now();
                });
            });
        }
    },
    
    cleanup: function()
    {
        var self = this;
        
        self.providedResources[self.resourceNames.P_CHARSPEECH].container.audioStream = null;
        self.providedResources[self.resourceNames.P_CHARSPEECH].container.visemes = null;
        self.providedResources[self.resourceNames.P_CHARSPEECH].container.bookmarks = null;
        self.providedResources[self.resourceNames.P_CHARSPEECH].container.timestamp = 0;
    },
    
    run: function()
    {
        var self = this;

        if (!self.voicesLoaded)
        {
            console.log("[INFO][WinSAPISynth] Waiting for voices to load...");
            return;
        }

        //console.log(self.requiredResources[self.resourceNames.R_CHARTEXT].container.timestamp+" "+self.lastConvertedTextTimestamp);
        if (self.requiredResources[self.resourceNames.R_CHARTEXT].container.timestamp > self.lastConvertedTextTimestamp)
        {
            //do synthesis
            console.log(self.requiredResources[self.resourceNames.R_CHARTEXT].container.text);
            
            self.synthesize(self.requiredResources[self.resourceNames.R_CHARTEXT].container.text);
            self.lastConvertedTextTimestamp = self.requiredResources[self.resourceNames.R_CHARTEXT].container.timestamp;
        }
    }
});
