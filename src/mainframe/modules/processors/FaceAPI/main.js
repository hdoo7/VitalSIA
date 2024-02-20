/*
** Module containing face-api by Vincent Mühler - https://github.com/justadudewhohacks/face-api.js
** Author: Zishi Wu
** E-mail: zishi@cs.miami.edu
*/

/*****************************************************************\
 ** Face-api emotion recognition module
\*****************************************************************/

var FaceAPI_base = Class.create(AbstractModule,
    {
        /**
         * Initialize and implements html elements to support face recognition
         * @return {void}
         *
         * @memberof FaceAPI_base#
         */
        initialize: function($super, params)
        {
            var self = this;

            $super(params);

            self.name = "FaceAPI_base";
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
                            // console.log('VideoTrack:', self.videoTrack)
                            self.videoSettings = self.videoTrack.getSettings()
                            // console.log('VideoSettings:', self.videoSettings)
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
        
                                // draw the age and gender as a textbox into the canvas
                                // regionsToExtract.forEach(result => {
                                //     const { age, gender, genderProbability } = result;
                                //     new self.faceapi.draw.DrawTextField(
                                //         [
                                //             `${self.faceapi.round(age, 0)} years`,
                                //             `${gender} (${self.faceapi.round(genderProbability)})`
                                //         ],
                                //         result.detection.box.bottomRight
                                //     ).draw(canvas);
                                // });
        
                                return results;
                            }
        
                            /* Display detected face bounding boxes */
                            /* Display detected face bounding boxes and log assumed nose position */
                            async function detect(input) {
                                const results = await self.faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
                                    .withFaceExpressions()
                                    .withAgeAndGender();
                                if (results) {
                                    if (results[0]){
                                        // Calculate the middle of the face detection box
                                        const box = results[0].detection.box;
                                        const noseX = box.x + box.width / 2;
                                        const noseY = box.y + box.height / 2;
                                        console.log(`Assumed Nose Position - X: ${noseX.toFixed(2)}, Y: ${noseY.toFixed(2)}`);

                                        self.providedResources[self.resourceNames.P_USERFACEPOSITION].container.posX = noseX;
                                        self.providedResources[self.resourceNames.P_USERFACEPOSITION].container.posY = noseY;
                                    }
                                    return results;
                                }
                            }

        
                            // resize the detected boxes in case your displayed image has a different size than the original
                            async function resize(detections, displaySize) {
                                const results = await self.faceapi.resizeResults(detections, displaySize);
                                return results;
                                /*
                                if (!results.length) {
                                    return
                                }
                                console.log(results);
                                */
                            }

                            self.elapsedTimeFrames = (Date.now() - self.lastTimeFrames)
                            self.elapsedTimeFramesSeconds = Math.round(self.elapsedTimeFrames/1000)

                            // console.log('Elapsed Time Frames:', self.elapsedTimeFrames)

                            desiredProcessedFPS = 10 

                            if (self.elapsedTimeFramesSeconds >= ((1/(desiredProcessedFPS % (self.camFPS+1))))){
                                // console.log('Second Tick...')
                                const detections = detect(videoel)
                                    .then(function(detections){
                                        const resizedDetections = resize(detections, displaySize)
                                        .then(function(resizedDetections){
                                            const drawDetectionBox = draw(canvas, resizedDetections)
                                        })
                                    })
                                self.lastTimeFrames = Date.now()
                            }

                            // if (self.frameCounter % 10 == 0){
                            //     const detections = detect(videoel)
                            //         .then(function(detections){
                            //             const resizedDetections = resize(detections, displaySize)
                            //             .then(function(resizedDetections){
                            //                 const drawDetectionBox = draw(canvas, resizedDetections)
                            //             })
                            //         })
                            //     // console.log('Frame Processed!')
                            // }
                            // // console.log('Frame Counter:', self.frameCounter)
                            // self.frameCounter += 1
                        }
                    }
                    else
                    {
                        // self.ctrack.stop(); // TODO: change to face-api
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

            // console.log('In runEmoModel!')

            self.ssdMobileNet = self.faceapi.nets.ssdMobilenetv1
            // console.log('ssdMobileNet:', self.ssdMobilenetv1)
            self.ssdMobileNetParams = self.ssdMobileNet._params

            // Adapted from Original Code completely useless.
            // self.faceLandmarkNet = self.faceapi.nets.faceLandmark68Net
            // console.log('FaceLandmark Net:', self.faceLandmarkNet)
            // self.faceLandmarkNetParams = self.faceLandmarkNet._params

            self.tinyFaceDetector = self.faceapi.nets.tinyFaceDetector
            // console.log('tinyFaceDetector:', self.tinyFaceDetector)
            self.tinyFaceDetectorParams = self.tinyFaceDetector._params

            self.ageGenderNet = self.faceapi.nets.ageGenderNet
            // console.log('ageGenderNet:', self.ageGenderNet)
            self.ageGenderNetParams = self.ageGenderNet._params

            self.faceExpressionNet = self.faceapi.nets.faceExpressionNet
            // console.log('faceExpressionNet:', self.faceExpressionNet)
            self.faceExpressionNetParams = self.faceExpressionNet._params

            self.allModelsLoaded = (self.ssdMobileNetParams 
                && self.tinyFaceDetectorParams 
                && self.ageGenderNetParams
                && self.faceExpressionNetParams)

            if (self.allModelsLoaded){
                // if(self.ssdMobileNetParams) console.log('ssdMobileNetParams Loaded:', self.ssdMobileNetParams)
                // else console.log('ssdMobileNetParams Not Loaded:', self.ssdMobileNetParams)
                // if(self.tinyFaceDetectorParams) console.log('tinyFaceDetectorParams Loaded:', self.tinyFaceDetectorParams)
                // else console.log('tinyFaceDetectorParams Not Loaded:', self.tinyFaceDetectorParams)
                // if(self.ageGenderNetParams) console.log('ageGenderNetParams Loaded:', self.ageGenderNetParams)
                // else console.log('ageGenderNetParams Not Loaded:', self.ageGenderNetParams)
                // if(self.faceExpressionNetParams) console.log('faceExpressionNetParams Loaded:', self.faceExpressionNetParams)
                // else console.log('faceExpressionNetParams Not Loaded:', self.faceExpressionNetParams)
                console.log('Face Models Status: %cGood', 'color: darkgreen')
            }
            else{
                console.log('Face Models Status: %cBad', 'color: darkred')
            }
        }
    });