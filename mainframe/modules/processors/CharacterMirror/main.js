/*
** Module mirroring behavior
** Author: Ubbo Visser
** E-mail: visser@cs.miami.edu
*/


var CharacterMirror = Class.create(AbstractModule,
{
    initialize: function($super, params)
    {
        var self = this;

        $super(params);

        self.name = "CharacterMirror";
        self.type = ModuleType.Processor;
        self.mandatory = false;
        
        self.resourceNames = {
                R_USERFACEPOSITION: 0,
                R_USERFACIALEXPRESSION: 1,
                R_CHARFACIALEXPRESSION: 2
            };

        self.requiredResources[self.resourceNames.R_USERFACEPOSITION] = new UserFacePosition();
        self.requiredResources[self.resourceNames.R_USERFACIALEXPRESSION] = new UserFacialExpression();
        self.requiredResources[self.resourceNames.R_CHARFACIALEXPRESSION] = new CharacterFacialExpression();
        self.optionalResources[self.resourceNames.R_CHARFACIALEXPRESSION] = new CharacterFacialExpression(); //make optional\

        self.camSizeWidth = 640;
        self.camSizeHeight = 480;

        self.deltaX = 0;
        self.deltaY = 0;

        self.positionHasChangedX = 0;
        self.positionHasChangedY = 0;
        
        self.lastX = 0;
        self.lastY = 0;

        self.timeLast = Date.now();
        self.hasStarted = false;

        self.flip = 0;
        self.smooth = 1.5;
        self.smoothTimeEmotion = 0.2;

        self.moveLeftRightIntensity = 40;
        self.moveUpDownIntensity = 5;
        self.moveEyesIntensity = 10;

        self.centerHeadPositionX = engine.centerHeadPosition[0];
        self.centerHeadPositionY = engine.centerHeadPosition[1];
        self.centerHeadPositionZ = engine.centerHeadPosition[2];
        self.centerHeadPositionUpdated = false;
    },

    timeHasPassed: function( secs )
    {   
        var self = this;

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
    
    followFace: function()
    {
        var self = this;
        //51  : "headTurnLeft"            //Head Movement Codes
        //52  : "headTurnRight"
        //54  : "headTurnDown"
        //53  : "headTurnUp"
        //61  : "eyesTurnLeft"
        //62  : "eyesTurnRight"

        //console.log("in followFace function")
        if ( self.positionHasChangedX && self.deltaX <=0 ) {
            // turn right
            facslib.setTargetAU("52", Math.abs(Math.round(self.deltaX/self.moveLeftRightIntensity)), "", self.smooth);
            facslib.setTargetAU("62", Math.abs(Math.round(self.deltaY/self.moveEyesIntensity)), "", self.smooth);
            if (self.positionHasChangedY && self.deltaY <=0 ){
                // look down
                facslib.setTargetAU("54", Math.abs(Math.round(self.deltaY/self.moveUpDownIntensity)), "", self.smooth);
            }
            else if (self.positionHasChangedY && self.deltaY > 0 ){
                // look up
                facslib.setTargetAU("53", Math.abs(Math.round(self.deltaY/self.moveUpDownIntensity)), "", self.smooth);                   
            }
        }
        else if (self.positionHasChangedX && self.deltaX > 0 ){
            // turn left
            facslib.setTargetAU("51", Math.abs(Math.round(self.deltaX/self.moveLeftRightIntensity)), "", self.smooth);
            facslib.setTargetAU("61", Math.abs(Math.round(self.deltaY/self.moveEyesIntensity)), "", self.smooth);
            if (self.positionHasChangedY && self.deltaY <=0 ){
                // look down
                facslib.setTargetAU("54", Math.abs(Math.round(self.deltaY/self.moveUpDownIntensity)), "", self.smooth);
            }
            else if (self.positionHasChangedY && self.deltaY > 0 ){
                // look up
                facslib.setTargetAU("53", Math.abs(Math.round(self.deltaY/self.moveUpDownIntensity)), "", self.smooth);                   
            }            
        }

    },


    mirrorEmotions: function()
    {
        var self = this;
        var iMax = 0;
        var x = 0;
        var i = 0;
        var arr = [0,0,0,0,0,0,0,0,0]; // 9 elements from mainframe for 7 FaceAPI expressions

        //console.log("in mirrorEmotions function")
        // turn container into array
        // todo: smooth out values, moving average
        for (i = 0; i < arr.length; i++) {
            arr[i] = self.requiredResources[self.resourceNames.R_USERFACIALEXPRESSION].container.data[i];
        }

        // find largest value for all Emotions in array
        var indexOfMaxValue = arr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        
        // set Target Emotion on character        
        switch(indexOfMaxValue) {
            case 0:
                // code block Anger
                //facslib.setTargetEmotion("Anger", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Anger", 0.8, self.smoothTimeEmotion);
                //console.log("Anger");
                break;
            case 1:
                // code block Contempt
                //facslib.setTargetEmotion("Contempt", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Contempt", 0.8, self.smoothTimeEmotion);              
                //console.log("Contempt");
            break;
            case 2:
                // code block Disgust
                //facslib.setTargetEmotion("Disgust", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Disgust", 0.8, self.smoothTimeEmotion);
                //console.log("Disgust");
            break;
            case 3:
                // code block Embarrassment
                //facslib.setTargetEmotion("Embarrassment", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Embarrassment", 0.8, self.smoothTimeEmotion);
                //console.log("Embarrassment");
            break;
            case 4:
                // code block Fear
                //facslib.setTargetEmotion("Fear", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Fear", 0.8, self.smoothTimeEmotion);
                //console.log("Fear");
            break;
            case 5:
                // code block Happiness
                facslib.setTargetEmotion("Happiness", arr[indexOfMaxValue], self.smoothTimeEmotion);
                // facslib.setTargetAU("6", 70, "", 0.0001); //cheekRaiser
                // facslib.setTargetAU("12", 70, "", 0.0001); //lipCornerPuller
                // //facslib.setTargetEmotion("Happiness", 0.8, self.smoothTimeEmotion);
                //console.log("Happiness");
            break;
            case 6:
                // code block Pride
                //facslib.setTargetEmotion("Pride", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Pride", 0.8, self.smoothTimeEmotion);
                //console.log("Pride");
            break;
            case 7:
                // code block Sadness
                // facslib.setTargetEmotion("Sadness", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Sadness", 0.8, self.smoothTimeEmotion);
                //console.log("Sadness");
            break;
            case 8:
                // code block Surprise
                //facslib.setTargetEmotion("Surprise", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Surprise", 0.8, self.smoothTimeEmotion);
                //console.log("Surprise");
            break;
            default:
                // code block
                //facslib.setTargetEmotion("Contempt", arr[indexOfMaxValue], self.smoothTimeEmotion);
                facslib.setTargetEmotion("Contempt", 0.8, self.smoothTimeEmotion);
                //console.log("Default contempt");

        }
    },

    run: function()
    {
        var self = this;
        //console.log("Run CharacterMirror");


        // only run this if we have a face position from FaceAPI
        if (self.requiredResources[self.resourceNames.R_USERFACEPOSITION].container.posX && self.requiredResources[self.resourceNames.R_USERFACEPOSITION].container.posY) {
            
            // delta between center position of user face and width of video size
            // if negative then turn left and turn down
            self.deltaX = self.camSizeWidth/2 - self.requiredResources[self.resourceNames.R_USERFACEPOSITION].container.posX;
            self.deltaY = self.camSizeHeight/2 - self.requiredResources[self.resourceNames.R_USERFACEPOSITION].container.posY;

            //console.log(self.deltaX, self.deltaY);
            //console.log(Math.abs(Math.round(self.deltaX/10)),Math.abs(Math.round(self.deltaY/20)));
            // round and abs to feasible number for headMoves, book-keep last value for change test
            
            //
            // determine change in x,y position, then feed this into targetAUs
            //   
            if (self.lastX == Math.abs(Math.round(self.deltaX/10)))
                self.positionHasChangedX = 0;
            else    
                self.positionHasChangedX = 1;
            
            if (self.lastY == Math.abs(Math.round(self.deltaY/20)))
                self.positionHasChangedY = 0;
            else    
                self.positionHasChangedY = 1;
            
            // keep lastX and lastY for the next frame
            self.lastX = Math.abs(Math.round(self.deltaX/10));
            self.lastY = Math.abs(Math.round(self.deltaY/20));
            
            //console.log(self.positionHasChangedX,self.positionHasChangedY);


            // This function handles the headTurns depending on the most dominant face
            self.followFace();

            // This is for expressions
            self.mirrorEmotions();
            
 
        }

        facslib.updateEngine();
    }
});