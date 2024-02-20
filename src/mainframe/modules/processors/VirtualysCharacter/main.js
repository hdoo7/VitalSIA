/*
** Module containing a Virtualys character
** Module author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

/*****************************************************************\
** VirtualysCharacter module
\*****************************************************************/

/**
 * Module for Virtualys character in scene
 * @class
 * @augments AbstractModule
 */
var VirtualysCharacter = Class.create(AbstractModule,
{
    /**
     * Initialize webgl character
     * @return {void}
     * 
     * @memberof VirtualysCharacter#
     */
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);

        console.log("params from vcmain.js"+params);

        self.name = "VirtualysCharacter";
        self.type = ModuleType.Processor;
        self.mandatory = false;

        var friendlyName = "Amy";
        var voiceID = 5;

        self.resourceNames = {
            R_CHARFACIALEXPRESSION: 0,
            R_CHARSPEECH: 1,
            R_CHARACTIONS: 2,
            R_CHARGAZE: 3,
            R_USERSETTINGS: 4,
            R_CHARAUS: 5,
            R_USERCHOICE: 6,

            P_CHARMESH: 0,
            P_CHARSPEAKING: 1,
            P_CHARVOICE: 2,
            P_CHARLOADED: 3,
            P_CHARUSERFRIENDLYNAME: 4
        };

        self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION] = new CharacterFacialExpression();
        self.optionalResources[self.resourceNames.R_CHARFACIALEXPRESSION] = new CharacterFacialExpression(); //make optional\
        self.requiredResources[self.resourceNames.R_CHARSPEECH] = new CharacterAudioStream();
        self.optionalResources[self.resourceNames.R_CHARSPEECH] = new CharacterAudioStream(); //make optional

        self.requiredResources[self.resourceNames.R_USERCHOICE] = new UserInterviewChoice();
        self.optionalResources[self.resourceNames.R_USERCHOICE] = new UserInterviewChoice();



        self.requiredResources[self.resourceNames.R_CHARACTIONS] = new CharacterActions();
        self.optionalResources[self.resourceNames.R_CHARACTIONS] = new CharacterActions(); //make optional
        self.requiredResources[self.resourceNames.R_CHARGAZE] = new CharacterEyeGaze();
        self.optionalResources[self.resourceNames.R_CHARGAZE] = new CharacterEyeGaze(); //make optional
        self.requiredResources[self.resourceNames.R_USERSETTINGS] = new UserSettings();
        self.optionalResources[self.resourceNames.R_USERSETTINGS] = new UserSettings(); //make optional
        self.requiredResources[self.resourceNames.R_CHARAUS] = new CharacterAUValues();
        self.optionalResources[self.resourceNames.R_CHARAUS] = new CharacterAUValues(); //make optional
        self.providedResources[self.resourceNames.P_CHARMESH] = new Mesh3D();
        self.providedResources[self.resourceNames.P_CHARSPEAKING] = new CharacterIsSpeaking();
        self.providedResources[self.resourceNames.P_CHARVOICE] = new CharacterVoice(); //default -- to be updated by subclasses
        self.providedResources[self.resourceNames.P_CHARLOADED] = new CharacterLoaded();
        self.providedResources[self.resourceNames.P_CHARUSERFRIENDLYNAME] = new CharacterUserFriendlyName();
        self.providedResources[self.resourceNames.P_CHARUSERFRIENDLYNAME].container.name = friendlyName; //from subclasses

        self.voiceID = voiceID;
        //console.log(self.voiceID);
        self.providedResources[self.resourceNames.P_CHARVOICE].container.voice = self.voiceID;

        self.animationMixer = null;
        self.animations = [];

        self.actionToAnimationMap = [];
        self.lastActiveAnimations = [];
        //set all to null for now
        for (var i=0; i<CounselorAction.length; ++i)
        {
            self.actionToAnimationMap[i] = null;
            self.lastActiveAnimations[i] = false;
        }

        //speech
        self.visemeIndex = -1;
        self.isSpeaking = false;
        self.lastSpoke = 0;
        self.talkInitTime = null;

        //Android Chrome audio workaround
        self.soundObject = new Audio();
        var df = document.createDocumentFragment();
        df.appendChild(self.soundObject);

        if (self.mediaPlaybackRequiresUserGesture())
        {
            console.log('Android Chrome workaround: wait for input event');
            window.addEventListener('keydown', self.removeBehaviorsRestrictions.bind(self));
            window.addEventListener('mousedown', self.removeBehaviorsRestrictions.bind(self));
            window.addEventListener('touchstart', self.removeBehaviorsRestrictions.bind(self));
        }
        else
        {
            console.log('Android Chrome workaround: no user gesture required');
            self.setSource();
        }

        //breathing
        self.breatheIntensity = 0.0;
        self.breatheUp = true;

        //AU rendering
        self._AUstate = [];
        self._EmState = [];
        self.indexToAU = {
            0: "AU1", 1: "AU2", 2: "AU4", 3: "AU5", 4: "AU6", 5: "AU7", 6: "AU8", 7: "AU9", 8: "AU10", 9: "AU11",
            10: "AU12", 11: "AU13", 12: "AU14", 13: "AU15", 14: "AU16", 15: "AU17", 16: "AU18", 17: "AU20", 18: "AU22", 19: "AU23",
            20: "AU24", 21: "AU25", 22: "AU26", 23: "AU27", 24: "AU28", 25: "AU38", 26: "AU39", 27: "AU41", 28: "AU42", 29: "AU43",
            30: "AU44", 31: "AU45", 32: "AU46", 33: "AU51", 34: "AU52"
        };




        //lipsync/bookmarks
        self.talkElapsed = 0;
        self.bookmarkIndex = -1;
        self.bookStart = true;
        self.prevBookmark = null;
        self.lastBookmark = -1;
        self.bookDur = 0.25;
        self.sample = null;
        self.visemeMorphMapping = {
            '0': { name: 'neutral' },
            '1': { name: 'aa' },
            '2': { name: 'aa' },
            '3': { name: 'aa' },
            '4': { name: 'ey' },
            '5': { name: 'er' },
            '6': { name: 'ih' },
            '7': { name: 'uw' },
            '8': { name: 'ow' },
            '9': { name: 'aa' },
            '10': { name: 'ow' },
            '11': { name: 'aa' },
            '12': { name: 'ih' },
            '13': { name: 'n' },
            '14': { name: 'n' },
            '15': { name: 's' },
            '16': { name: 'ch' },
            '17': { name: 'th' },
            '18': { name: 'f' },
            '19': { name: 'd' },
            '20': { name: 'g' },
            '21': { name: 'm' }
        };

        self.timeLast = Date.now();
        self.hasStarted = false;

       /* //following variables are for getting the counselor to head nod
        self.headnodState = 0;//to determine state of the head nod
        self.headnodStateDelay = 350; // delay between each state
        self.lastNodStateChange = Date.now();//to track last state change
        self.inHeadNodSequence = true;//boolean to let us know that the counselor is currently completing a head nod sequence
        self.headNodElapsedTime = 10000;
        self.timeLastHeadNodEnd = Date.now();*/


        // self.engine = new EngineWebGL_u3d();
        // self.facslib =  new  FacsLib(self.engine);
    },

    // TODO: This is a hack. Create a module for this

    //Android Chrome audio workaround
    setSource: function()
    {
        var self = this;

        console.log('Android Chrome workaround: set source. In fact, it works without setting the src, so will probably remove this later.');
        //self.soundObject.src = '../../../app/audio/1sec.mp3';
    },

    //Android Chrome audio workaround
    mediaPlaybackRequiresUserGesture: function()
    {
        var self = this;

        // test if play() is ignored when not called from an input event handler
        self.soundObject.play();
        return self.soundObject.paused;
    },

    //Android Chrome audio workaround
    removeBehaviorsRestrictions: function()
    {
        var self = this;

        console.log('Android Chrome workaround: call load()');
        self.soundObject.load();
        window.removeEventListener('keydown', self.removeBehaviorsRestrictions.bind(self));
        window.removeEventListener('mousedown', self.removeBehaviorsRestrictions.bind(self));
        window.removeEventListener('touchstart', self.removeBehaviorsRestrictions.bind(self));
        console.log('Android Chrome workaround: wait 1 second');
        setTimeout(self.setSource, 1000);
    },

    renderVisemeGuido: function () {
        var self = this;

        if (self.visemeIndex >= 0) { // then is speaking
            var now = Date.now();
            self.talkElapsed = now - self.talkInitTime;

            var viseme = self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes[self.visemeIndex];
            var nextViseme = self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes[self.visemeIndex + 1];
            var visemeElapsed = self.talkElapsed - viseme.audioPosition;

            //if (self.talkElapsed < viseme.audioPosition) return;

            if (visemeElapsed < viseme.duration) {  // still in current viseme
                var increment = (visemeElapsed / viseme.duration) * 100;
                console.log(increment);

                if (!nextViseme || (viseme.number != nextViseme.number)) { // then need to transition visemes
                    if (self.visemeIndex > 0) { // fade out current viseme
                        facslib.setTargetViseme(viseme.number, 1 - increment, 0);
                    }

                    if (nextViseme) { // fade in next viseme
                        facslib.setTargetViseme(nextViseme.number, increment, 0);
                    }
                }
            }
            else { // it's time to render next viseme
                facslib.setTargetViseme(viseme.number, 0, 0);

                if (nextViseme) {
                    facslib.setTargetViseme(nextViseme.number, 1, 0);

                    self.visemeIndex++;
                }
                else { // stop talking
                    self.isSpeaking = false;
                    self.providedResources[self.resourceNames.P_CHARSPEAKING].container.speaking = false;
                    self.visemeIndex = -1;
                    self.talkInitTime = null;
                }
            }
        }
    },

    renderVisemeUnknown: function()
    {
        // var self = this;
        //
        // if (self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes == null) return;
        //
        // if (self.visemeIndex >= 0 && self.visemeIndex < self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes.length) {
        //     // then is speaking
        //     var now = Date.now();
        //     self.talkElapsed = now - self.talkInitTime;
        //
        //     var viseme = self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes[self.visemeIndex];
        //     var visemeElapsed = self.talkElapsed - viseme.audioPosition;
        //     var morphInfluenceIndex = self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.morphTargetDictionary[self.visemeMorphMapping[viseme.number + ''].name];
        //
        //     //fade past visemes
        //     var doneFadingOut = true;
        //     for (var i = 0; i <= self.visemeIndex; ++i) {
        //         var oldViseme = self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes[i];
        //         if ((oldViseme.number != viseme.number) || (visemeElapsed >= viseme.duration)) {
        //             var oldMorphInfluenceIndex = self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.morphTargetDictionary[self.visemeMorphMapping[oldViseme.number + ''].name];
        //             if (oldMorphInfluenceIndex != morphInfluenceIndex) {
        //                 self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.morphTargetInfluences[oldMorphInfluenceIndex] += self.pushValueTo(self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.morphTargetInfluences[oldMorphInfluenceIndex], 0.0, 0.08); //small fade out rate
        //             }
        //         }
        //         if (self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.morphTargetInfluences[oldMorphInfluenceIndex] > 0.0) doneFadingOut = false;
        //     }
        //
        //     //render current viseme
        //     if (visemeElapsed < viseme.duration) {
        //         self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.morphTargetInfluences[morphInfluenceIndex] += self.pushValueTo(self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.morphTargetInfluences[morphInfluenceIndex], 0.9, 0.3); //higher fade in rate
        //     }
        //     else {
        //         //console.log(self.visemeIndex+"/"+self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes.length);
        //         if (self.visemeIndex < self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes.length - 1) {
        //             self.visemeIndex++;
        //         }
        //         else {
        //             if (doneFadingOut)w //if finished fading out
        //             {
        //                 //console.log("stopped talking");
        //                 // stop talking
        //                 if (self.requiredResources[self.resourceNames.R_CHARSPEECH].container.bookmarks.length > 0) {
        //                     self.setEmotion(self.requiredResources[self.resourceNames.R_CHARSPEECH].container.bookmarks[self.requiredResources[self.resourceNames.R_CHARSPEECH].container.bookmarks.length - 1].name, 0);
        //                 }
        //
        //                 self.isSpeaking = false;
        //                 self.providedResources[self.resourceNames.P_CHARSPEAKING].container.speaking = false;
        //                 self.visemeIndex = -1;
        //                 self.talkInitTime = null;
        //             }
        //         }
        //     }
        // }
    },

    renderVisemeMihai: function ()
    {
        var self = this;

        if (self.visemeIndex >= 0 && self.visemeIndex < self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes.length)
        {
            // then is speaking
            var now = Date.now();
            self.talkElapsed = now - self.talkInitTime;

            var viseme = self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes[self.visemeIndex];
            var visemeElapsed = self.talkElapsed - viseme.audioPosition;

            if (visemeElapsed < viseme.duration)
            {
                if (viseme.number == 0)
                {
                    facslib.setTargetViseme(viseme.number, 0, 0);
                    facslib.setTargetAU("21", 0, "", 0.2); //larynx
                }
                else
                {
                    facslib.setTargetViseme(viseme.number-1, 70, 0);
                    facslib.setTargetAU("21", Math.random()*50, "", 0.5); //larynx
                }
            }
            else
            {
                //console.log(self.visemeIndex+"/"+self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes.length);
                if (self.visemeIndex < self.requiredResources[self.resourceNames.R_CHARSPEECH].container.visemes.length-1)
                {
                    self.visemeIndex++;
                }
                else
                {
                    if (viseme.number == 0)
                    {
                        facslib.setTargetViseme(viseme.number, 0, 0.01);
                        facslib.setTargetAU("21", 0, "", 0.2); //larynx
                    }
                    else
                    {
                        facslib.setTargetViseme(viseme.number-1, 70, 0.01);
                        facslib.setTargetAU("21", Math.random()*50, "", 0.5); //larynx
                    }

                    self.isSpeaking = false;
                    self.providedResources[self.resourceNames.P_CHARSPEAKING].container.speaking = false;
                    self.visemeIndex = -1;
                    self.talkInitTime = null;
                }
            }
        }
    },

    speak: function(src)
    {
        var self = this;
        //line 394
        var playPromise;

        //var df = document.createDocumentFragment();
        var audioStarted;

        //line 400-410 exception 404
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Automatic playback started!
                // We can now safely pause video...
                self.soundObject.pause();
            })
                .catch(error => {
                    // Auto-play was prevented
                    // Show paused UI.
                });
        }



        //var snd = new Audio(src);
        self.soundObject.src = src;
        //df.appendChild(snd); // keep in fragment until finished playing

        self.talkInitTime = Date.now();
        self.visemeIndex = 0;
        self.bookmarkIndex = 0;
        self.lastBookmark = self.requiredResources[self.resourceNames.R_CHARSPEECH].container.bookmarks.length;
        self.isSpeaking = true;
        self.providedResources[self.resourceNames.P_CHARSPEAKING].container.speaking = true;

        playPromise = self.soundObject.play();

        //return snd;

    },

    pauseAudio: function()
    {
        var self = this;
        self.isSpeaking =false;
        console.log("Audio is paused!");
    },

    /*headnod: function()
    {

        //if not already started a head nod, begin head nod
        var self = this;


        if((Date.now()-self.timeLastHeadNodEnd) >=  self.headNodElapsedTime) self.inHeadNodSequence = true;



            self.headNodStateElapsedTime = Date.now() - self.lastNodStateChange;
        //console.log("delay: " + self.headNodElapsedTime);
        if(self.headnodState > 6){
            self.headnodState = 1;
        }

        if(self.inHeadNodSequence && (self.headNodStateElapsedTime >= self.headnodStateDelay)){

            self.lastNodStateChange = Date.now();
            self.inHeadNodSequence = true;

          if(self.headnodState == 1){
                console.log("headnod on fleek!!!!!!!STATE--1--!!!!!!!!!!!!!!!");
                facslib.setTargetAU("64", 5, "", 3.9);
                facslib.setTargetAU("54", 5, "", 4);
            }
            else if(self.headnodState == 2){
                console.log("headnod on fleek!!!!!!!STATE--2--!!!!!!!!!!!!!!!");
                facslib.setTargetAU("64", 0, "", 3.9);
                facslib.setTargetAU("54", 0, "", 4);
            }
            else if(self.headnodState == 3){
                console.log("headnod on fleek!!!!!!!STATE--3--!!!!!!!!!!!!!!!");
                facslib.setTargetAU("64", 8, "", 3.9);
                facslib.setTargetAU("54", 8, "", 4);
            }
            else if(self.headnodState == 4){
                console.log("headnod on fleek!!!!!!!STATE--4--!!!!!!!!!!!!!!!");
                facslib.setTargetAU("64", 0, "", 3.9);
                facslib.setTargetAU("54", 0, "", 4);
            }
            else if(self.headnodState == 5){
                console.log("headnod on fleek!!!!!!!STATE--5--!!!!!!!!!!!!!!!");
                facslib.setTargetAU("64", 10, "", 3.9);
                facslib.setTargetAU("54", 10, "", 4);
            }
            else if(self.headnodState == 6){
                console.log("headnod on fleek!!!!!!!STATE--6--!!!!!!!!!!!!!!!");
                facslib.setTargetAU("64", 0, "", 3.9);
                facslib.setTargetAU("54", 0, "", 4);
                self.inHeadNodSequence = false;
                self.timeLastHeadNodEnd = Date.now();
            }


            facslib.updateEngine();
            self.headnodState++;
        }
    },*/
    
    timeHasPassed: function( secs )
    {   var self = this;

        if (!self.hasStarted) {
            self.startTime = Date.now();
            self.hasStarted = true;
        }
        if (Date.now()-self.startTime > secs*1000) {
            self.hasStarted = false;
            return true;
        } else
            return false;
    },
    
    /**
     * VirtualysCharacter step function called by the mainframe; process data for face recognition
     * @return {void}
     *
     * @memberof VirtualysCharacter#
     */
    run: function()
    {
        var self = this;

        if (unityWebGLContentLoaded) //read from eva.unity.jade
        {

            if (self.requiredResources[self.resourceNames.R_CHARSPEECH].container.timestamp > self.lastSpoke)
            {
                self.speak(self.requiredResources[self.resourceNames.R_CHARSPEECH].container.audioStream);

                self.lastSpoke = self.requiredResources[self.resourceNames.R_CHARSPEECH].container.timestamp;
            }



            // if( self.animationMixer )
            // {
            //     self.animationMixer.update( delta );
            //     self.providedResources[self.resourceNames.P_CHARMESH].container.mesh.updateMatrixWorld(true);
            //
            //     //helper.update();
            // }



            //self.renderVisemeGuido()
            self.renderVisemeMihai();
           /* self.blink();*/



           //self.headnod();

        
            //self.renderBookmark();
            //slunn002 forced head and eye gaze adjustment
            //To force counselor to appear happy, activated individual AU, however minimzed lipCornerPuller to prevent joker grin
            /*facslib.setTargetAU("6", 70, "", 0.0001); //cheekRaiser
            facslib.setTargetAU("12", 70, "", 0.0001); //lipCornerPuller*/
            //console.log(self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Happiness]);
            //facslib.setTargetAU("52", 10, "", 0.0001); //head turn right
            //facslib.setTargetAU("62", 12, "", 0.0001); //eyes turn right
            //facslib.setTargetAU("64", 20, "", 0.0001); //eyes turn down
            //facslib.setTargetAU("54", 10, "", 0.0001); //head turn down
            //the below settings are for counselors with date 08_23_2017
            /*
             facslib.setTargetAU("6", 70, "", 0.0001); //cheekRaiser
             facslib.setTargetAU("12", 70, "", 0.0001); //lipCornerPuller
             //facslib.setTargetAU("52", 10, "", 0.0001); //head turn right
             facslib.setTargetAU("62", 12, "", 0.0001); //eyes turn right
             facslib.setTargetAU("64", 20, "", 0.0001); //eyes turn down
             facslib.setTargetAU("54", 10, "", 0.0001); //head turn down
             */
            //facslib.setTargetEmotion("Anger", self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION].container.data[Emotion.Anger], 0.05);
            //facslib.setTargetEmotion("Happiness", self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION].container.data[Emotion.Happiness], 0.05);
            //facslib.setTargetEmotion("Sadness", self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION].container.data[Emotion.Sadness], 0.05);
            //facslib.setTargetEmotion("Surprise", self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION].container.data[Emotion.Surprise], 0.05);

           /* console.log("Char emotion*********************************************");
            try {
                if(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Happiness]){
                    console.log("Happiness:::::::::::::::::::::::::::::::::::::::::::::::::::::::");
                    console.log(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Happiness]);
                }
            } catch (error){
                console.log("Happiness is undefined");
            }

            try {
                if(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Sadness]){
                    console.log("Sadness:::::::::::::::::::::::::::::::::::::::::::::::::::::::");
                    console.log(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Sadness]);
                }
            } catch(error) {
                console.log("Sadness is undefined");
            }

            try {
                if(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Anger]){
                    console.log("Anger:::::::::::::::::::::::::::::::::::::::::::::::::::::::");
                    console.log(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Anger]);
                }
            } catch (error) {
                console.log("Anger is undefined");
            }

            try {
                if(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Surprise]){
                    console.log("Surprise:::::::::::::::::::::::::::::::::::::::::::::::::::::::");
                    console.log(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Surprise]);
                }
            } catch (error) {
                console.log("Surprise is undefined");
            }
*/
            //console.log(self.providedResources[self.resourceNames.P_CHARFACIALEXPRESSION].container.data[Emotion.Happiness]);

            // self.emHappiness(self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION].container.data[Emotion.Happiness]);
            // self.emSadness(self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION].container.data[Emotion.Sadness]);
            // self.emSurprise(self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION].container.data[Emotion.Surprise]);
            //
            // for (var i=0; i<AUNames.TOTAL-4; ++i)
            // {
            //     self.setAUByIndex(i, self.requiredResources[self.resourceNames.R_CHARAUS].container.data[i]);
            // }

            //self.setAUByIndex(i, self.requiredResources[self.resourceNames.R_CHARAUS].container.data[29]);

            facslib.updateEngine();

        }
    }
});
