/*
** Module containing face-api by Vincent Mühler - https://github.com/justadudewhohacks/face-api.js
** Author: Zishi Wu
** E-mail: zishi@cs.miami.edu
*/

/*****************************************************************\
 ** Face-api emotion recognition module
\*****************************************************************/

 var LongLiveJonathanTheJust = Class.create(AbstractModule,
    {
        /**
         * Initialize and implements html elements to support face recognition
         * @return {void}
         *
         * @memberof LongLiveJonathanTheJust#
         */
        initialize: function($super, params)
        {
            var self = this;
            console.log('LONG LIVE JONATHAN THE JUST!');
            $super(params);

            self.name = "LongLiveJonathanTheJust";
            self.type = ModuleType.Processor;
            self.mandatory = false;

            self.resourceNames = {
                R_VIDEOSTREAM: 0,
                P_USERFACIALEXPRESSION: 0,
                P_CHARGAZE: 1,
                P_USERFACEPOSITION: 2
            };

            self.requiredResources[self.resourceNames.R_VIDEOSTREAM] = new VideoStream();

            self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION] = new UserFacialExpression();
            self.providedResources[self.resourceNames.P_CHARGAZE] = new CharacterEyeGaze();
            self.providedResources[self.resourceNames.P_USERFACEPOSITION] = new UserFacePosition();
            
            //---------//
            self.width = 300;
            self.height = 250;

            self.vid = document.createElement('video');
            var attWidth = document.createAttribute("width");
            attWidth.value = ""+self.width;
            self.vid.setAttributeNode(attWidth);
            var attWidth = document.createAttribute("height");
            attWidth.value = ""+self.height;
            self.vid.setAttributeNode(attWidth);

            self.faceapi = faceapi
            self.firstRun = true
            self.modelCheck = true

            self.frameCounter = 0
            self.lastTimeFrames = Date.now()
        },

        /**
         * FaceAPI_base step function called by the mainframe; process data for face recognition
         * @return {void}
         *
         * @memberof FaceAPI_base#
         */
        run: function()
        {
            var self = this;
            if (self.firstRun) {
                self.loadEmoModels()
                self.firstRunEndTime = Date.now()
                self.firstRun = false
            }
            else{
                elapsedTime = (Date.now() - self.firstRunEndTime)
                elapsedTimeSeconds = Math.round(elapsedTime/1000)
                if (elapsedTimeSeconds > 1){
                    if (self.modelCheck){
                        self.checkEmoModels()
                        self.modelCheck = false
                    }

                    const useTinyModel = true;
                    const canvas = document.getElementById('videoel-overlay');
                    const context = canvas.getContext("2d");
                    const displaySize = { width: videoel.width, height: videoel.height };
                    self.faceapi.matchDimensions(videoel, displaySize);

                    if (self.active){
                        if ((self.vid.paused || self.vid.srcObject === undefined || self.vid.srcObject === null) && self.requiredResources[self.resourceNames.R_VIDEOSTREAM].container.videoStream != null)
                        {
                            self.vid.srcObject = self.requiredResources[self.resourceNames.R_VIDEOSTREAM].container.videoStream;

                            self.videoTrack = self.vid.srcObject.getVideoTracks()[0]
                            self.videoSettings = self.videoTrack.getSettings()
                            self.camFPS = self.videoSettings.frameRate
                            console.log('Camera FPS:', self.camFPS)

                            // start video
                            self.vid.play();
                        }
                        else {
                            // draw detections into the canvas
                            async function draw(input, regionsToExtract) {
                                context.clearRect(0, 0 ,300, 250);
                                const results = await self.faceapi.draw.drawDetections(input, regionsToExtract);
                                const minProbability = 0.75;
        
                                // draw the emotional expression into the canvas
                                self.faceapi.draw.drawFaceExpressions(input, regionsToExtract, minProbability);
        
                                return results;
                            }
        
                            /* Display detected face bounding boxes and log nose position */
                            async function detect(input) {
                                const results = await self.faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
                                if (results) {
                                    if (results[0]){
                                        const noseTip = results[0].landmarks.getPositions()[30]; // Index for nose tip
                                        console.log(`Nose Position - X: ${noseTip.x.toFixed(2)}, Y: ${noseTip.y.toFixed(2)}`);
                                        
                                        self.providedResources[self.resourceNames.P_USERFACEPOSITION].container.posX = noseTip.x;
                                        self.providedResources[self.resourceNames.P_USERFACEPOSITION].container.posY = noseTip.y;
                                    }
                                    return results;
                                }
                            }
        
                            // resize the detected boxes in case your displayed image has a different size than the original
                            async function resize(detections, displaySize) {
                                const results = await self.faceapi.resizeResults(detections, displaySize);
                                return results;
                            }

                            self.elapsedTimeFrames = (Date.now() - self.lastTimeFrames)
                            self.elapsedTimeFramesSeconds = Math.round(self.elapsedTimeFrames/1000)

                            desiredProcessedFPS = 10 

                            if (self.elapsedTimeFramesSeconds >= ((1/(desiredProcessedFPS % (self.camFPS+1))))){
                                const detections = detect(videoel)
                                    .then(function(detections){
                                        const resizedDetections = resize(detections, displaySize)
                                        .then(function(resizedDetections){
                                            const drawDetectionBox = draw(canvas, resizedDetections)
                                        })
                                    })
                                self.lastTimeFrames = Date.now()
                            }
                        }
                    }
                    else
                    {
                        self.vid.pause();
                    }       
                }
            }
        },
        loadEmoModels : async function(){
            var self = this

            await self.faceapi.nets.tinyFaceDetector.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            await self.faceapi.nets.ssdMobilenetv1.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            await self.faceapi.nets.ageGenderNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            await self.faceapi.nets.faceExpressionNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');

        },
        checkEmoModels : function(){
            var self = this;

            self.ssdMobileNet = self.faceapi.nets.ssdMobilenetv1
            self.ssdMobileNetParams = self.ssdMobileNet._params

            self.tinyFaceDetector = self.faceapi.nets.tinyFaceDetector
            self.tinyFaceDetectorParams = self.tinyFaceDetector._params

            self.ageGenderNet = self.faceapi.nets.ageGenderNet
            self.ageGenderNetParams = self.ageGenderNet._params

            self.faceExpressionNet = self.faceapi.nets.faceExpressionNet
            self.faceExpressionNetParams = self.faceExpressionNet._params

            self.allModelsLoaded = (self.ssdMobileNetParams 
                && self.tinyFaceDetectorParams 
                && self.ageGenderNetParams
                && self.faceExpressionNetParams)

            if (self.allModelsLoaded){
                console.log('Face Models Status: %cGood', 'color: darkgreen')
            }
            else{
                console.log('Face Models Status: %cBad', 'color: darkred')
            }
        }
    });
