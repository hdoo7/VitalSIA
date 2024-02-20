/*
** ChromeSpeech
** Author: Mihai Polceanu, Daniel Rivero
** E-mail: mpolcean@cs.fiu.edu, drive076@fiu.edu
*/

/*****************************************************************\
** Module proof of concept
\*****************************************************************/

/**
 * Module that integrates Google speech api for voice recognition.
 * @class 
 * @augments AbstractModule
 */
var ChromeSpeech = Class.create(AbstractModule,
{
    /**
     * Initialize voice recognition
     * @return {void}
     *
     * @memberof ChromeSpeech# 
     */
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "ChromeSpeech"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Sensor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden
        
        self.resourceNames = {
            R_MICSTATE: 0,
            
            P_USERTEXT: 0,
            P_INTERIMUSERTEXT: 1,
            P_CHARLISTENING: 2
        };
        
        self.requiredResources[self.resourceNames.R_MICSTATE] = new MicrophoneState();
        self.optionalResources[self.resourceNames.R_MICSTATE] = new MicrophoneState();
        
        self.providedResources[self.resourceNames.P_USERTEXT] = new UserText();
        self.providedResources[self.resourceNames.P_INTERIMUSERTEXT] = new InterimUserText();
        
        self.lang = 'en-US';
        
        //detects if speech recognition is active or not
        self.recognizing = false;
        
        //container for returned string 
        self.final_transcript = " ";
        
        //Google speech API
        self.recognition = new webkitSpeechRecognition();
      
        //continuous print-stream
        //self.recognition.continuous = true;
        
        //display interimResults
        self.recognition.interimResults = true;
        
        //called when speech recognition starts
        self.recognition.onstart = self.onstart.bind(self);     
        
        //called when speech recognition finishes
        self.recognition.onend = self.onend.bind(self);
        
        //returns the results of speech recgonition
        self.recognition.onresult = self.onresult.bind(self);
        
        //for now only english
        self.recognition.lang = 'en-US';

        self.mic = document.getElementById("micButton");
        self.micslash = document.getElementById("micSlash");

    },
    
    /**
     * Toggles on the Mic gif indicating that the user is now ready to start speaking.
     * @return {void}
     *
     * @memberof ChromeSpeech# 
     */
    toggleMicOn : function()
    {
        var self = this;
        
        if( self.mic != null && self.micslash != null)
        {
            self.mic.style.visibility = "visible";
            self.micslash.style.visibility = "hidden";
        }
    },
    
    /**
     * Toggles off the Mic gif indicating that the character is not receieving microphone input data
     * @return {void}
     *
     * @memberof ChromeSpeech# 
     */
    toggleMicOff : function()
    {
        var self = this;   
        
        if( self.mic != null && self.micslash != null)
        {
            self.mic.style.visibility = "hidden";
            self.micslash.style.visibility = "visible";
        }
    },
    
    /**
     * Callback when speech recognition starts
     * @return {void}
     *
     * @memberof ChromeSpeech# 
     */
    onstart : function() {
        var self = this;
        
        self.recognizing = true;
        self.toggleMicOn();
        
        console.log("Speech Recognition: Started");
        
    },
    
    /**
     * Callback when speech recognition ends
     * @return {void}
     *
     * @memberof ChromeSpeech# 
     */
    onend : function() {
        
        var self = this;
       
        self.recognizing = false;
        self.toggleMicOff();
        
        console.log("Speech Recognition: Ended"); 
        
    },
    
    /**
     * Callback when speech recognition transcript becomes finalized.
     * @param  {ChromeSpeech} event     the object containing the transcript of speech recognition
     * @return {void}
     */
    onresult : function(event) {
        
        var self = this;
        var interim_transcript = " ";
        
        var rightNow = Date.now();
        
        //for every text returned from speech recognition
        for(var i = event.resultIndex; i < event.results.length; ++i)
        {
            //if there is no more text to be read
            if(event.results[i].isFinal)
            {
                //add it to final_transcript container
                self.final_transcript += " " + event.results[i][0].transcript;
                
                //testing for now
                self.providedResources[self.resourceNames.P_USERTEXT].container.text = event.results[i][0].transcript;
                self.providedResources[self.resourceNames.P_USERTEXT].container.timestamp = rightNow;
                
                console.log(event.results[i][0].transcript);
                console.log("User text: " + self.providedResources[self.resourceNames.P_USERTEXT].container.text);
            }
            else
            {
                //else add it to temporary container
                interim_transcript += event.results[i][0].transcript;
                self.providedResources[self.resourceNames.P_INTERIMUSERTEXT].container.text = event.results[i][0].transcript;
                self.providedResources[self.resourceNames.P_INTERIMUSERTEXT].container.timestamp = rightNow;
            }
        }
        
        //print results to console
        console.log("Interim Transcripts: " + interim_transcript);
        console.log("Final Transcripts: " + self.final_transcript);
    },
    
    /**
     * ChromeSpeech step function; toggles functionality of microphone depending on its state.
     * @return {void}
     */
    run: function()
    {
        var self = this;

        if(self.requiredResources[self.resourceNames.R_MICSTATE].container.state)
        {
            if (!self.recognizing)
            {
                try {
                    self.recognition.start();
                }
                catch(err) {
                    self.recognition.stop();
                }


            }
        }
        else
        {
            if (self.recognizing)
            {
                try {
                    self.recognition.stop();
                }
                catch(err) {
                    self.recognizing = false;
                }
            }
        }
    }
});
