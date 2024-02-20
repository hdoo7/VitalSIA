/*
** SpeechMirroringBehavior module
** Author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

/*****************************************************************\
** SpeechMirroringBehavior module
\*****************************************************************/

var SpeechMirroringBehavior = Class.create(AbstractModule,
{
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "SpeechMirroringBehavior"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Processor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden
        
        self.resourceNames = {
            R_USERTEXT: 0,
            
            P_CHARTEXT: 0
        };
        
        self.requiredResources[self.resourceNames.R_USERTEXT] = new UserText(); //dummy
        
        self.providedResources[self.resourceNames.P_CHARTEXT] = new CharacterText();

        self.configuration = new document.gpt3Configuration({
            apiKey: "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"
        });

        self.openaiapi = new document.gpt3OpenAIApi(self.configuration);

        console.log(self.openaiapi);

        
            
    },

    sendRequest: async function(userRequest){

        var self = this;

        try{
            // console.log("openaiapi: " + self.openaiapi);
            const completion = await self.openaiapi.createCompletion(
                "text-davinci-002",
                {
                    prompt: userRequest,
                    temperature: 0.6,
                }
            );

            var result = completion.data.choices[0].text.trim()

            console.log("Completion: " + result);
            return result;
        }
        catch(error){
            console.log("Something went wrong when generating gpt3 completion! Error: " + error);
        }
        // if(error.response){
        //     console.log("Something went wrong when generating completion!");
        //     if (error.response){
        //         console.log(error.response.status);
        //         console.log(error.response.data);
    },
    
    run: function()
    {
        var self = this;

        if (unityWebGLContentLoaded)
        {
            if (self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp > self.lastSpoke)
            {
                
                // self.sendRequest(self.requiredResources[self.resourceNames.R_USERTEXT].container.text).then(data => {
                //     console.log("Data: " + data);
                //     self.providedResources[self.resourceNames.P_CHARTEXT].container.text = " ";
                //     self.providedResources[self.resourceNames.P_CHARTEXT].container.text = data;
                //     self.providedResources[self.resourceNames.P_CHARTEXT].container.timestamp = Date.now();
                //     console.log("Result: " + self.providedResources[self.resourceNames.P_CHARTEXT].container.text);
                // });
                
                self.providedResources[self.resourceNames.P_CHARTEXT].container.text = self.requiredResources[self.resourceNames.R_USERTEXT].container.text;
                self.providedResources[self.resourceNames.P_CHARTEXT].container.timestamp = self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp;
                
                // set timer to last timer, flush text
                self.lastSpoke = self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp;
                self.providedResources[self.resourceNames.P_CHARTEXT].container.text = " ";
            }
        }
    }

});
