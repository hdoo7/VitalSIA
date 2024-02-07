/*
** ReflectiveListening module
** Author: Christopher Duarte
** E-mail: 
*/

/*****************************************************************\
** ReflectiveListening module
\*****************************************************************/

var ReflectiveListening = Class.create(AbstractModule,
{
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "ReflectiveListening"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Processor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden
        
        self.resourceNames = {
            R_USERTEXT: 0,
            
            P_CHARTEXT: 0
        };
        
        self.requiredResources[self.resourceNames.R_USERTEXT] = new UserText(); 
        self.optionalResources[self.resourceNames.R_USERTEXT] = new UserText(); 

        self.providedResources[self.resourceNames.P_CHARTEXT] = new CharacterText();

        self.configuration = new document.gpt3Configuration({
            apiKey: "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"
        });

        self.openaiapi = new document.gpt3OpenAIApi(self.configuration);

        self.gpt3Result = " "

        self.trigger = true;
        self.lastSpoke = Date.now()
        self.overallNumCalls = 0;
    },
    
    run: function()
    {
        var self = this;
        
        // self.providedResources[self.resourceNames.P_CHARTEXT].container.text = self.requiredResources[self.resourceNames.R_USERTEXT].container.text;
        // self.providedResources[self.resourceNames.P_CHARTEXT].container.timestamp = self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp;

        if (self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp > self.lastSpoke)
        {
            let inputText = self.requiredResources[self.resourceNames.R_USERTEXT].container.text;
            // let inputText = "hello how are you?"

            console.log("InputText: " + inputText)

            console.log("Starting gpt3Result: " + self.gpt3Result)

            try {
                if (self.trigger) {
                    self.trigger = false;

                    console.log("gpt3 START!");
                    let completion = await self.openaiapi.createCompletion(
                        "text-davinci-002",
                        {
                            prompt: inputText,
                            temperature: 0,
                            max_tokens: 25,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                        }
                    );

                    self.gpt3Result = completion.data.choices[0].text

                    // console.log("Completion Word Count: " + self.gpt3Result.split("\\s+").length)

                    self.gpt3Result = self.gpt3Result.trim().replaceAll('\n', '').replaceAll(/[^a-zA-Z0-9' ]/g, '').trim().toLowerCase()

                    console.log("gpt3 Result:" + self.gpt3Result);
                }

            } catch (error) {
                console.log("Something went wrong when generating gpt3 completion! Error: " + error);
            }

            self.providedResources[self.resourceNames.P_CHARTEXT].container.text = self.gpt3Result
            // self.providedResources[self.resourceNames.P_CHARTEXT].container.text = inputText
            self.providedResources[self.resourceNames.P_CHARTEXT].container.timestamp = self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp;
            self.lastSpoke = self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp

            self.gpt3Result = " "
            self.trigger = true;

            self.overallNumCalls++
            console.log("Reflective Listening numCalls: " + self.overallNumCalls)

        }
    }
});
