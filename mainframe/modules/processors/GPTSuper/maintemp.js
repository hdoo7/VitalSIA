var GPT3Super = Class.create(AbstractModule,
    {
        initialize: function ($super, params) {
            var self = this

            $super(params)

            self.openai_ref = window.openai
            // console.log('openai_ref:', self.openai_ref)

            self.openai_key = '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'

            self.openai_config = new self.openai_ref.Configuration({
                apiKey: self.openai_key
            }) 
            // console.log('openai_config:', self.openai_config)

            self.openai = new self.openai_ref.OpenAIApi(self.openai_config)
            console.log('openai:', self.openai);
            
            self.speechsdk = window.azure_speech

            // Azure STT vars
            self.speech_key = 'ef45f3dd566a444da07317ececf2a792'
            self.service_region = 'eastus'

            // Speech Transaction vars
            self.conv_hist = ``
            self.trans_num = 1

            self.emph_sep = `=`.repeat(50).concat('\n')
            self.trans_sep = `-`.repeat(50).concat('\n')
            // console.log('emph_sep:', self.emph_sep)
            // console.log('trans_sep:', self.trans_sep)

            // This is the preamble str used to establish gpt3 starting context.
            self.preamble_str = `You are a friendly artificial agent named Eva.\n`

            self.preamble_block = ``
            self.preamble_block += self.emph_sep
            self.preamble_block += self.preamble_str
            self.preamble_block += self.emph_sep

            self.conv_hist = self.conv_hist.concat(self.preamble_block)
            console.log('Starting conv hist:\n', self.conv_hist)

            // Azure STT + TTS Configs
            self.speech_config = self.speechsdk.SpeechConfig.fromSubscription(self.speech_key, self.service_region)
            // console.log('Speech Config:', self.speech_config)

            self.audio_config = self.speechsdk.AudioConfig.fromDefaultMicrophoneInput()
            // console.log('Audio Config:', self.audio_config)

            self.speech_recognizer = new self.speechsdk.SpeechRecognizer(self.speech_config, self.audio_config)
            // console.log('Speech Recognizer:', self.speech_recognizer)

            self.speech_synthesizer = new self.speechsdk.SpeechSynthesizer(self.speech_config)
            console.log('Speech Synthesizer:', self.speech_synthesizer)

            // Event-based functions for speech recognizer.
            self.speech_recognizer.recognizing = (s, e) => {
                result_text = e.result.text;
                console.log(`RECOGNIZING: ${result_text}`);
            };
            
            self.speech_recognizer.recognized = async(s, e) => {
                var self = this

                reason = e.result.reason
                result_text = ''
                if (reason == self.speechsdk.ResultReason.RecognizedSpeech) {
                    result_text = e.result.text.toLowerCase();
                    if (result_text){
                        console.log(`FINAL RECOGNIZED: ${result_text}`);

                        self.conv_hist += self.trans_sep
                        self.conv_hist += `Transaction Num: ${self.trans_num}\n`
                        self.conv_hist += `User: ${result_text}\n`
                        self.conv_hist += `Eva: `

                        // console.log(`Before conversation history:\n${self.conv_hist}`)

                        // Run gpt3Request based on current conv_hist.
                        gpt3_response_object = await self.openai.createCompletion(
                        {
                            model: 'text-davinci-003',
                            prompt: self.conv_hist,
                            temperature: 0.5,
                            max_tokens: 100,
                            top_p: 1,
                            frequency_penalty: 0.0,
                            presence_penalty: 0.0,
                        }) 
                
                        // gpt3_response_json_string = JSON.stringify(gpt3_response_object)
                        // console.log('gpt3_response JSON string:', gpt3_response_json_string)

                        gpt3_response_text = gpt3_response_object.data.choices[0].text.strip()
                        console.log('gpt3_response_text:', gpt3_response_text)

                        self.conv_hist += `${gpt3_response_text}\n\n`

                        console.log(`Current conversation history:\n${self.conv_hist}`)

                        self.trans_num += 1

                        speech_synthesis_result = self.speech_synthesizer.speakTextAsync(gpt3_response_text)
                    }
                }
                else if (reason == self.speechsdk.ResultReason.NoMatch) {
                    console.log('NOMATCH: Speech could not be recognized. Skipping transaction...')
                }
            };
            
            // Start speech recognition
            self.speech_recognizer.startContinuousRecognitionAsync()
        },
        // gpt3Request: async function () {
        //     var self = this

        //     console.log('In gpt3Request function!')


        //     // response = self.openai.Completion.create(
        //     //     model = 'text-davinci-003',
        //     //     prompt = self.conv_hist,
        //     //     temperature = 0.5,
        //     //     max_tokens = 100,
        //     //     top_p = 1,
        //     //     frequency_penalty = 0.0,
        //     //     presence_penalty = 0.0,
        //     // )

        //     response = await self.openai.createCompletion('text-davinci-003',
        //     {
        //         prompt: self.conv_hist,
        //         temperature: 0.5,
        //         max_tokens: 100,
        //         top_p: 1,
        //         frequency_penalty: 0.0,
        //         presence_penalty: 0.0,
        //     })

        //     console.log('response:', response)

        //     return response.choices[0].text.strip()
        // }

        run: function() {}

    }
)