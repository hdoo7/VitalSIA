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

            self.firstRun = true

            // initialize face-api
            // self.faceapi = faceapi;

            // const loadModel = async function loadModel() {
            //     await self.faceapi.nets.ssdMobilenetv1.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            //     await self.faceapi.nets.faceLandmark68Net.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            //     await self.faceapi.nets.tinyFaceDetector.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            //     await self.faceapi.nets.ageGenderNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            //     await self.faceapi.nets.faceExpressionNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            //     // await self.faceapi.nets.faceLandmark68TinyNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            //     // await self.faceapi.nets.faceRecognitionNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            //     // await self.faceapi.nets.mtcnn.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
            // }

            // const model = loadModel();

            // Get canvas input for overlay
            //const input = document.getElementById("videoel-overlay");
            //const displaySize = { width: 300, height: 250 };

            // resize the overlay canvas to the input dimensions
            //const canvas = document.getElementById("overlay");
            //self.faceapi.matchDimensions(canvas, displaySize);

            //console.log(canvas)

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

            if(self.firstRun){
                self.faceapi = faceapi
                
                // console.log('First Run FaceAPI:',self.faceapi)
                // console.log('First Run FaceAPI Net:', self.faceapi.nets)

                const loadModel = async function loadModel() {
                    self.ssdMobileNet = await self.faceapi.nets.ssdMobilenetv1.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                    self.faceLandmarkNet = await self.faceapi.nets.faceLandmark68Net.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                    self.tinyFaceDetector = await self.faceapi.nets.tinyFaceDetector.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                    self.ageGenderNet = await self.faceapi.nets.ageGenderNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                    self.faceExpressionNet = await self.faceapi.nets.faceExpressionNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                    // await self.faceapi.nets.faceLandmark68TinyNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                    // await self.faceapi.nets.faceRecognitionNet.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                    // await self.faceapi.nets.mtcnn.loadFromUri('/mainframe/modules/processors/FaceAPI/models');
                }

                loadModel();
                self.firstRun = false;
            }

            const useTinyModel = true;
            const canvas = document.getElementById('videoel-overlay');
            const context = canvas.getContext("2d");
            const displaySize = { width: videoel.width, height: videoel.height };
            self.faceapi.matchDimensions(videoel, displaySize);

            if (self.active)
            {
                if ((self.vid.paused || self.vid.srcObject === undefined || self.vid.srcObject === null) && self.requiredResources[self.resourceNames.R_VIDEOSTREAM].container.videoStream != null)
                {
                    self.vid.srcObject = self.requiredResources[self.resourceNames.R_VIDEOSTREAM].container.videoStream;

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
                        regionsToExtract.forEach(result => {
                            const { age, gender, genderProbability } = result;
                            new self.faceapi.draw.DrawTextField(
                                [
                                    `${self.faceapi.round(age, 0)} years`,
                                    `${gender} (${self.faceapi.round(genderProbability)})`
                                ],
                                result.detection.box.bottomRight
                            ).draw(canvas);
                        });

                        return results;
                    }

                    /* Display detected face bounding boxes */
                    async function detect(input) {
                        const results = await self.faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions().withAgeAndGender();
                        if (results) {
                            // console.log('Results 0:', results[0])
                            if (results[0]){
                                self.providedResources[self.resourceNames.P_USERFACEPOSITION].container.posX = results[0].detection._box._x + results[0].detection._box._width/2;
                                self.providedResources[self.resourceNames.P_USERFACEPOSITION].container.posY = results[0].detection._box._y + results[0].detection._box._height/2;
                                
                                // Get expression values
                                //console.log(results[0].expressions.angry);
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Anger] = results[0].expressions.angry;
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Contempt] = results[0].expressions.neutral;
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Disgust] = results[0].expressions.disgusted;
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Surprise] = results[0].expressions.surprised;
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Fear] = results[0].expressions.fearful;
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Happiness] = results[0].expressions.happy;
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Sadness] = results[0].expressions.sad;
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Pride] = 0.0; // does not exist in FaceAPI
                                self.providedResources[self.resourceNames.P_USERFACIALEXPRESSION].container.data[Emotion.Embarrassment] = 0.0; //does not exist in FaceAPI
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

                
                    // Zishi: need to clean up these nested asynchronous calls
                    const detections = detect(videoel)
                        .then(function(detections) {
                            const resizedDetections = resize(detections, displaySize)
                                .then(function(resizedDetections) {
                                    const drawDetectionBox = draw(canvas, resizedDetections);
                                        //.then(function(drawdetectionBox) {
                                        //     console.log(drawdetectionBox);
                                        // })
                                    // console.log("Before Resize");
                                    // console.log(resizedDetections[0]._box);
                                    // console.log("After Resize");
                                });
                            // console.log(detections[0]._box);
                        });
                   
                }
            }
            else
            {
                // self.ctrack.stop(); // TODO: change to face-api
                self.vid.pause();
            }
        }

    });
//
// /**
// * Module for face recognition
// * @class
// * @augments FaceAPI_base
// */
// var FaceAPI = Class.create(FaceAPI_base,
// {
//     /**
//      * Initialize face recognition without an overlay
//      * @return {void}
//      *
//      * @memberof FaceAPI#
//      */
//     initialize: function($super)
//     {
//         var self = this;
//
//         $super();
//
//         self.name = "FaceAPI";
//     }
// });
//
// /**
//  * Module for face recognition
//  * @class
//  * @augments FaceAPI_base
//  */
// var FaceAPIWithOverlay = Class.create(FaceAPI_base,
// {
//     /**
//      * Initialize face recognition with overlay
//      * @return {void}
//      *
//      * @memberof FaceAPIWithOverlay#
//      */
//     initialize: function($super)
//     {
//         var self = this;
//
//         $super();
//
//         self.name = "FaceAPIWithOverlay";
//
//         self.overlay = document.getElementById('videoel-overlay');
//         self.overlayCC = self.overlay.getContext('2d');
//     },
//
//     /**
//      * FaceAPIWithOverlay step function called by the mainframe; handles overlay features
//      * @return {void}
//      *
//      * @memberof FaceAPIWithOverlay#
//      */
//     run: function($super)
//     {
//         var self = this;
//
//         $super();
//
//         self.overlayCC.clearRect(0, 0, 300, 250);
//         //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
//         /*
//         if (self.ctrack.getCurrentPosition())
//         {
//             self.ctrack.draw(self.overlay);
//         }
//         */
//     }
// });