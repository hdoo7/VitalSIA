/*
References:
https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-speech-synthesis?tabs=browserjs%2Cterminal&pivots=programming-language-javascript
*/

var GPTSuper = Class.create(AbstractModule,
    {
        initialize: function ($super, params) {
            var self = this

            $super(params)

            self.name = "GPTSuper"; 
            self.type = ModuleType.Processor;
            self.mandatory = false;

            self.resourceNames = {
                R_USERFACIALEXPRESSION: 0,
            };

            self.requiredResources[self.resourceNames.R_USERFACIALEXPRESSION] = new UserFacialExpression();
            self.optionalResources[self.resourceNames.R_USERFACIALEXPRESSION] = new UserFacialExpression(); // makes optional as not mandatory for STT + GPT + TTS cycle to function.

            // Note: R_MICSTATE does absolutely nothing to control mic status it is a simply a bookeeping bool. 
            // self.resourceNames = {
            //     R_MICSTATE: 0,
            // };
            // self.requiredResources[self.resourceNames.R_MICSTATE] = new MicrophoneState();
            // self.optionalResources[self.resourceNames.R_MICSTATE] = new MicrophoneState();

            // mic is hidden at the beginning
            self.micVisible = false;

            // Text Separation vars
            self.emph_sep = `=`.repeat(50).concat('\n')
            self.trans_sep = `-`.repeat(50).concat('\n')

            self.openAIConfiguration()
            self.azureConfiguration()

            // Speech Transaction vars
            self.conv_hist = ``
            self.started_conv = false
            self.first_start = true
            self.trans_num = 1

            // Viseme vars
            self.maxAudioOffset = 0
            self.audioStartDateTime = Date.now()
            self.audioEndDateTime = Date.now()
            self.audioStarted = false
            self.audioData = []
            self.visemeData = []

            self.current_index = 0

            //Anim vars
            self.lastElapsedIdleTime = 0
            self.inAnim = false
            self.animCycle = 0

            // Mic vars
            self.mic_button = document.getElementById("micButton");
            self.mic_slash = document.getElementById("micSlash");

            self.start_keywords = ['please start the conversation']
            self.term_keywords = ['please stop the conversation']

            // This is the preamble str used to establish gpt starting context.
            // self.preamble_str = `You are a friendly artificial agent named Eva.\n`
            self.agent_name = `Eva`
            self.agent_name_str = `Agent Name: ${self.agent_name}\n`

            self.agent_role = `Friendly artificial agent`
            self.agent_role_str = `Agent Role: ${self.agent_role}\n`

            self.restrict_start_str = `Avoid saying the following phrase(s) '${self.start_keywords.join('\', ')}' as it will self-initiate the conversation.\n`
            self.restrict_end_str = `Avoid saying the following phrase(s) '${self.term_keywords.join('\', ')}' as it will self-terminate the conversation.\n`

            self.preamble_block = ``
            self.preamble_block += self.emph_sep
            // self.preamble_block += self.preamble_str
            self.preamble_block += self.agent_name_str
            self.preamble_block += self.agent_role_str
            self.preamble_block += self.restrict_start_str
            self.preamble_block += self.restrict_end_str
            self.preamble_block += self.emph_sep

            self.conv_hist = self.conv_hist.concat(self.preamble_block)
            console.log('Initial Conversation History:\n' + self.conv_hist)

            self.audio_r_config = self.speechsdk.AudioConfig.fromDefaultMicrophoneInput()

            self.speechRecognizerInit()
            self.speechSynthesizerInit()
            
            // Start speech recognition async
            self.speech_recognizer.startContinuousRecognitionAsync()
        },
        run: function() {
            var self = this

            // console.log('Face Data:', self.requiredResources[self.resourceNames.R_USERFACIALEXPRESSION].container.data)
            self.emoDict = self.mapFaceToEmo(self.requiredResources[self.resourceNames.R_USERFACIALEXPRESSION].container.data)
            // console.log(self.emoDict)

            topEmoData = self.getTopEmo(self.emoDict)
            // console.log(`TopEmoData: ${topEmoData}`)

            self.topEmotion = topEmoData[0]
            self.topEmotionVal = topEmoData[1] 
            // console.log(`Top Emotion: ${self.topEmotion}`)
            // console.log(`Top Value: ${self.topEmotionVal}`)


            if (unityWebGLContentLoaded) //read from eva.unity.jade
            {
                // make elementPanel and mic visible once
                if (!self.micVisible)
                {
                    self.micVisible = true;

                    if(self.mic_button && self.mic_slash)
                    {
                        self.toggleMicUIOn()
                        self.mic_button.classList.toggle('fadeIn');
                        self.mic_slash.classList.toggle('fadeIn');
                    }                    
                }
            }    

            // console.log('self.audioStartDateTime:', self.audioStartDateTime)

            diffTime = (Date.now() - self.audioStartDateTime)

            if (self.audioStarted){
                // console.log('diffTime:', diffTime)
                // console.log('maxAudioOffset: ', self.maxAudioOffset)
                if(diffTime + 1 > self.maxAudioOffset){
                    // Reset vars and face for next dictation
                    self.audioStarted = false
                    self.maxAudioOffset = 0
                    self.audioData = []
                    self.visemeData = []
                    self.current_index = 0
                    self.audioEndDateTime = Date.now()

                    self.toggleMicUIOn()

                    facslib.setNeutralViseme(0.0)
                }
                else if (self.current_index < self.audioData.length){
                    // console.log('Audio Data:', self.audioData.toString())
                    // console.log('Viseme Data:', self.visemeData.toString())

                    if (self.current_index == 0) self.toggleMicUIOff()

                    //Get first element in audio data
                    current_offset = self.audioData[self.current_index]
                    current_viseme = self.visemeData[self.current_index]

                    // console.log('Current Offset:', current_offset)
                    // console.log('Current Viseme:', current_viseme)

                    if (diffTime >= current_offset){
                        // console.log('In Setting Visemes!')
                        if (current_viseme == 0){
                            facslib.setNeutral(1.0);
                            facslib.setNeutralViseme(0.0)
                        }
                        else{
                            current_viseme -= 1
                            facslib.setTargetViseme(current_viseme, 70, 0)
                        }
                        self.current_index += 1
                    }
                }
            }
            else{
                //If audio hasn't started and diffTime has surpassed triggerIdleTime, then start idle routine.
                elapsedIdleTime = (Date.now() - self.audioEndDateTime)
                elapsedIdleTimeSeconds = Math.round(elapsedIdleTime/1000)
                // This enables a per second count between of the elapsedIdleTime (otherwise run into repeated iterations due to repeated seconds).
                if ((elapsedIdleTimeSeconds - self.lastElapsedIdleTime) == 1){
                    // console.log(`Elapsed time since last audio end: ${elapsedIdleTimeSeconds}`)
                    facslib.setTargetAU("12", 25, "", 1);
                    if(elapsedIdleTimeSeconds % 3 == 0){
                        if (!self.inAnim){
                            // Face Animation selection here.

                            // Set max number of idle faces.
                            maxIdleFaces = 9

                            // Get random face out from max number of idle faces.
                            self.animCycle = Math.floor(Math.random() * maxIdleFaces)

                            // Upper-Right Gaze
                            if (self.animCycle == 0){
                                facslib.setTargetAU("12", 25, "", 1); //Lippuller-smile
                                facslib.setTargetAU("52", 15, "", 1.5); //Headturn-right
                                facslib.setTargetAU("62", 15, "", 1); //Eyesturn-right
                                facslib.setTargetAU("63", 15, "", 1); //Eyesturn-up
                                self.animCycle += 1
                            }
                            
                            // Casual look left-left
                            else if (self.animCycle == 1){
                                facslib.setTargetAU("61", 15, "", 1); //Eyesturn-left
                                self.animCycle += 1
                            }

                            // Casual look right-right
                            else if (self.animCycle == 2){
                                facslib.setTargetAU("62", 15, "", 1); //Eyesturn-right
                                self.animCycle += 1
                            }

                            // Casual look up-up
                            else if (self.animCycle == 3){
                                facslib.setTargetAU("63", 15, "", 1); //Eyesturn-up
                                self.animCycle += 1
                            }

                            // Casual look down-down
                            else if (self.animCycle == 4){
                                facslib.setTargetAU("64", 15, "", 1); //Eyesturn-down
                                self.animCycle += 1
                            }

                            // Casual look left-up
                            else if (self.animCycle == 4){
                                facslib.setTargetAU("61", 15, "", 1); //Eyesturn-left
                                facslib.setTargetAU("63", 15, "", 1); //Eyesturn-up
                                self.animCycle += 1
                            }

                            // Casual look right-up
                            else if (self.animCycle == 5){
                                facslib.setTargetAU("62", 15, "", 1); //Eyesturn-right
                                facslib.setTargetAU("63", 15, "", 1); //Eyesturn-up
                                self.animCycle += 1
                            }

                            // Casual look left-down
                            else if (self.animCycle == 6){
                                facslib.setTargetAU("61", 15, "", 1); //Eyesturn-left
                                facslib.setTargetAU("64", 15, "", 1); //Eyesturn-down
                                self.animCycle += 1
                            }

                            // Casual look right-down
                            else if (self.animCycle == 7){
                                facslib.setTargetAU("62", 15, "", 1); //Eyesturn-right
                                facslib.setTargetAU("64", 15, "", 1); //Eyesturn-down
                                self.animCycle += 1
                            }

                            else if(self.animCycle == 8){
                                facslib.setTargetAU("53", 25, "", 1); //Head-up
                                facslib.setTargetAU("51", 25, "", 1); //Headturn-left
                                facslib.setTargetAU("62", 25, "", 1); //Eyesturn-right
                                self.animCycle += 1
                            }

                            // Simply disable pseudo-random selection if you'd like to cycle through all faces. 
                            self.animCycle = self.animCycle % maxIdleFaces
                            self.inAnim = true
                        }
                        else{
                            facslib.setNeutral(1.5)
                            facslib.setTargetAU("12", 25, "", 1);
                            self.inAnim = false
                        }
                    }
                }
                self.lastElapsedIdleTime = elapsedIdleTimeSeconds
            }
            facslib.updateEngine()
            // console.log('Run audioStarted:', self.audioStarted)
        },
        mapFaceToEmo : function(receivedEmoDict) 
        {
            var self = this

            return {
                'Anger': receivedEmoDict[Emotion.Anger],
                'Neutral': receivedEmoDict[Emotion.Contempt],
                'Disgust': receivedEmoDict[Emotion.Disgust],
                'Surprise': receivedEmoDict[Emotion.Surprise],
                'Fear': receivedEmoDict[Emotion.Fear],
                'Happiness': receivedEmoDict[Emotion.Happiness],
                'Sadness': receivedEmoDict[Emotion.Sadness],
                'Pride': receivedEmoDict[Emotion.Pride],
                'Embarassment': receivedEmoDict[Emotion.Embarrassment],
            }
        },
        getTopEmo : function(emoDict){
            var self = this

            let [maxKey, maxValue] = Object.entries(emoDict).reduce((acc, [key, value]) => {
                if (value > acc[1]) {
                  return [key, value];
                } else {
                  return acc;
                }
              }, ['', -Infinity]);

            // console.log(maxKey)
            // console.log(maxValue)

            //Thresholding for emo classification.
            if (maxValue < 0.70){
                maxKey = null
                maxValue = null
            }

            return [maxKey, maxValue]
        },
        toggleMicUIOn : function()
        {
            var self = this;
            
            if(self.mic_button && self.mic_slash)
            {
                self.mic_button.style.visibility = "visible";
                self.mic_slash.style.visibility = "hidden";
            }
        },
        toggleMicUIOff : function()
        {
            var self = this;
            
            if(self.mic_button && self.mic_slash)
            {
                self.mic_button.style.visibility = "visible";
                self.mic_slash.style.visibility = "visible";
            }
        },
        checkOpenAIStatus: function(){
            var self = this;

            const openai_url = "https://api.openai.com/v1/completions"

            const headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + self.openai_key, 
            }

            const data = {
                "model": self.openai_model,
                "prompt": "If this request is successful, respond with 'Good'.\n\n",
                "max_tokens": 2,
                "temperature": 0
            }

            fetch(openai_url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) return response.json()
                else throw new Error('Request failed.')
            })
            .then(data => {
                gpt_response = data.choices[0].text.strip().toLowerCase()
                // console.log('GPT Response:', gpt_response)
                if (gpt_response.includes('good')) console.log('OpenAI API Status: %cGood', 'color: darkgreen')
                console.log(self.emph_sep)
            })
            .catch(error => {
                console.log('OpenAI API Status: %cBad', 'color: darkred')
                console.error('OpenAI API Error:', error)
                console.log(self.emph_sep)
            })
        },
        openAIConfiguration : function(){
            var self = this;

            self.openai_ref = window.openai
            // console.log('openai_ref:', self.openai_ref)

            // UM OpenAI Key
            self.openai_key = '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'
            // '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'

            self.openai_model = 'gpt-3.5-turbo-instruct'

            self.openai_config = new self.openai_ref.Configuration({
                apiKey: self.openai_key
            }) 
            // console.log('openai_config:', self.openai_config)

            self.openai = new self.openai_ref.OpenAIApi(self.openai_config)
            // console.log('openai:', self.openai);

            self.checkOpenAIStatus()

            return self.openai
        },
        checkAzureStatus: function() {
            var self = this;

            const headers = {
                'Ocp-Apim-Subscription-Key': self.speech_key
            }

            // Check Azure Cognitive Services STT + TTS Status
            const stt_url = 'https://' + self.service_region + '.cognitiveservices.azure.com/speechtotext/v3.1/healthstatus'
            const tts_url = 'https://' + self.service_region + '.tts.speech.microsoft.com/cognitiveservices/voices/list'

            fetch(stt_url, {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                console.log(self.emph_sep)
                if (response.ok) return
                throw new Error('Request failed.')
            })
            .then(data => {
                console.log('Azure STT Status: %cGood', 'color: darkgreen')
                fetch(tts_url, {
                    method: 'GET',
                    headers: headers
                })
                .then(response => {
                    if (response.ok) return
                    throw new Error('Request failed.')
                })
                .then(data => {
                    console.log('Azure TTS Status: %cGood', 'color: darkgreen')
                    // console.log(self.emph_sep)
                })
                .catch(error => {
                    console.log('Azure TTS Status: %cBad', 'color: darkred')
                    // console.log(self.emph_sep)
                })
            })
            .catch(error => {
                console.log('Azure STT Status: %cBad', 'color: darkred')
                fetch(tts_url, {
                    method: 'GET',
                    headers: headers
                })
                .then(response => {
                    console.log(self.trans_sep)
                    if (response.ok) return
                    throw new Error('Request failed.')
                })
                .then(data => {
                    console.log('Azure TTS Status: %cGood', 'color: darkgreen')
                    // console.log(self.emph_sep)
                })
                .catch(error => {
                    console.log('Azure TTS Status: %cBad', 'color: darkred')
                    // console.log(self.emph_sep)
                })
            })
        },
        azureConfiguration : function(){
            var self = this;
            self.speechsdk = window.azure_speech

            // self.speech_key = '8dc7cd9b34704c75a3ee3a29fa07b2fa' //Chris
            self.speech_key = '77326273c9e74b93a49efc8093c19282' //Ubbo
            self.service_region = 'eastus'

            self.speech_config = self.speechsdk.SpeechConfig.fromSubscription(self.speech_key, self.service_region)
            self.speech_config.speechSynthesisLanguage = "en-US"; 
            self.speech_config.speechSynthesisVoiceName = "en-US-JennyNeural";

            // console.log('azure speech_config:', self.speech_config)

            self.checkAzureStatus()

            return self.speech_config
        },
        speechRecognizerInit : function (){
            var self = this;

            self.speech_recognizer = new self.speechsdk.SpeechRecognizer(self.speech_config, self.audio_r_config)

            // Event-based functions for speech recognizer.
            self.speech_recognizer.recognizing = (s, e) => {
                // console.log(`audiostarted recognizing: ${self.audioStarted}`)
                if(!self.audioStarted){
                    result_text = e.result.text;
                    console.log(`RECOGNIZING: ${result_text}`);
                }
                else{
                    console.log('Ignoring Audio Input as EVA is speaking!')
                }
            };
            self.speech_recognizer.recognized = async(s, e) => {
                var self = this

                reason = e.result.reason
                result_text = ''
                speech_text = ''

                final_recog = false

                // console.log(`audiostarted recognized: ${self.audioStarted}`)

                if (reason == self.speechsdk.ResultReason.RecognizedSpeech && !self.audioStarted) {
                    result_text = e.result.text.toLowerCase();
                    if (result_text){
                        console.log(`FINAL RECOGNIZED: ${result_text}`);

                        self.start_keywords.forEach(phrase => {
                            if (result_text.includes(phrase)){
                                console.log('Reached starting sequence!')
                                self.started_conv = true
                                self.first_start = true
                            } 
                        })

                        self.term_keywords.forEach(phrase => {
                            if (result_text.includes(phrase)){
                                console.log('Reached terminating sequence!')
                                final_recog = true
                            } 
                        })

                        // Terminates conversation if keyphrase detected in the result_text after exit greeting.
                        
                        if (self.started_conv){
                            if (!final_recog && !self.first_start){
                                self.conv_hist += self.trans_sep
                                self.conv_hist += `Transaction Num: ${self.trans_num}\n`
                                if (self.topEmotion){
                                    self.conv_hist += `User Facial Emotion Label: ${self.topEmotion}\n`
                                }
                                self.conv_hist += `User: ${result_text}\n`
                                self.conv_hist += `Eva: `

                                // console.log(`Before conversation history:\n${self.conv_hist}`)

                                // Run gptRequest based on current conv_hist.
                                gpt_response_object = await self.openai.createCompletion(
                                {
                                    model: self.openai_model,
                                    prompt: self.conv_hist,
                                    temperature: 0.5,
                                    max_tokens: 100,
                                    top_p: 1,
                                    frequency_penalty: 0.0,
                                    presence_penalty: 0.0,
                                }) 
                        
                                // gpt_response_json_string = JSON.stringify(gpt_response_object)
                                // console.log('gpt_response JSON string:', gpt_response_json_string)

                                gpt_response_text = gpt_response_object.data.choices[0].text.strip()

                                // gpt_response_text = 'Hello World!'

                                // console.log('gpt_response_text:', gpt_response_text)

                                self.conv_hist += `${gpt_response_text}\n\n`

                                console.log(`Current conversation history:\n${self.conv_hist}`)

                                self.trans_num += 1

                                speech_text = gpt_response_text
                            }
                            else if (final_recog){
                                farewell_msg = 'Ending conversation. Goodbye!'
                                speech_text = farewell_msg
                            }
                            else if (self.first_start){
                                starting_msg = 'Starting conversation. You may speak now...'
                                speech_text = starting_msg
                                self.first_start = false
                            }

                            speech_synthesis_result = self.speech_synthesizer.speakTextAsync(speech_text,
                                result => {
                                    if(result){ 
                                        let source;

                                        console.log('Reached result speech synthesis!')

                                        audioData = result.audioData

                                        // console.log(`Audio data byte size: ${audioData.byteLength}.`)

                                        self.audioContext.decodeAudioData(audioData, (buffer) => {
                                            source = self.audioContext.createBufferSource();
                                            source.buffer = buffer;
                                            source.connect(self.audioContext.destination);
                                            // autoplay
                                            source.start(0);
                                            if (final_recog){
                                                // self.speech_recognizer.close()
                                                // self.speech_synthesizer.close()
                                                self.started_conv = false
                                                console.log('Terminating keyword detected, Recognition and Synthesis stopped.\n')
                                                console.log(`Final Conversation History:\n${self.conv_hist}`)
                                            }
                                        });

                                        if (!self.audioStarted){
                                            self.audioStartDateTime = Date.now()
                                            // console.log('Max audio offset:', self.maxAudioOffset)
                                            self.audioStarted = true
                                        }
                                        // return result.audioData
                                    }
                                })
                        }
                    }
                }
                // else if (reason == self.speechsdk.ResultReason.NoMatch) {
                //     console.log('NOMATCH: Speech could not be recognized. Skipping transaction...')
                // }
            };
        },
        speechSynthesizerInit : function (){
            var self = this;

            self.speech_synthesizer = new self.speechsdk.SpeechSynthesizer(self.speech_config, null)
            self.audioContext = new AudioContext();

            self.speech_synthesizer.synthesisCompleted = async(s, e) => {
                var self = this
                console.log('Synthesis Completed!')
            }

            self.speech_synthesizer.visemeReceived = (s, e) => {
                var self = this

                audioOffset = (e.audioOffset)/10000
                visemeId = e.visemeId
                // console.log("(Viseme), Audio offset: " + audioOffset + "ms. Viseme ID: " + visemeId);
                if (self.maxAudioOffset < audioOffset) self.maxAudioOffset = audioOffset
                self.audioData.push(audioOffset)
                self.visemeData.push(visemeId)
            }
        }
    }
)
