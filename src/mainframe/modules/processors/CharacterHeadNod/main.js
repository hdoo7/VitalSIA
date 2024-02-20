 /*
** Module containing clmtrackr by Audun Mathias Øygard - https://github.com/auduno/clmtrackr
** Module author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

/*****************************************************************\
 ** Character Gaze module
 \*****************************************************************/

/**
 * Module that allows for the character's gaze to follow the user on the screen
 * @class
 * @augments AbstractModule
 */
var CharacterHeadNod = Class.create(AbstractModule,
    {

        initialize: function($super, params)
        {
            var self = this;

            $super(params);

            self.name = "CharacterHeadNod";
            self.type = ModuleType.Processor;
            self.mandatory = false;
            self.prevElement = null;
            self.foundNewElement = false;
            self.userResponded = false;
            self.initiateHeadnod = false;
            self.headnodType = -1;

            self.angularScope = null;
            self.controllerScope = null;

            self.resourceNames = {
                R_ELEMENTJSON: 0,
                R_USERTEXT: 1,
                R_USERCHOICE: 2,

                P_CHARISNODDING: 0
            };

            self.needingHeadNod={
                onlyHappy: [
                    "pleBxUHgyt",
                    "YHmKYTz5Y5",
                    "lfaPYb8211",
                    "VOKthC7rpT",
                    "Ud8heugqCQ",
                    "bnFLF4y7Lz",
                    "XTxMZ7TJ4h",
                    "e1yYpKX6jG"
                ],
                fiveAnswerChoices: [
                    "480OIkUfRe",
                    "NTEyjG7JaV",
                    "9PV3mDHsYj",
                    "7hrQrRkroo",
                    "fcrMyhewqP",
                    "XnBeaqJpLP"
                ],
                fourAnswerChoices: [
                    "is6vw6wRnG",
                    "tBryo4ALxF",
                    "dSQV6eGkSu",
                    "PzQplrhIWi",
                    "CSKw4wbij4",
                    "AJycKpEegc",
                    "1wjSdhf2eM",
                    "9WHQFfzF4J",
                    "Rf7rQvJfOt",
                    "udBLvwkRax",
                    "KQlF0k42wm",
                    "8Qz0T7pwMZ",
                    "83FfJ9Zq3M",
                    "oMop003d7A",
                    "YHvVH5MqP1",
                    "jUnJEgy9dm",
                    "igQMYRzHJa",
                    "XD5NKWQKhc",
                    "OmbUxx1Jha",
                    "Et0gmveEIz",
                    "rqnLEOB52H",
                    "2oKhO7mWbO",
                    "v9frAvBSJq",
                    "bGlMCixyKA",
                    "wMWqoTE1gA",
                    "k2ip8q0K2L",
                    "Wv4wzrJp0T",
                    "WPjoWWTdGW",
                    "7uAQj46Kc9",
                    "ySxADohMIJ",
                    "gCf1E8xcBt",
                    "6HjTndVKpf",
                    "Gzv94vSMlK",
                    "WDYFKBp4Ra",
                    "o0gfHVKiZo",
                    "tPbHqZDc4F",
                    "xX6fmHzV8a",
                    "wEl6CRXHap",
                    "7C7lYsNVrG",
                    "yQhfDjY1Hv",
                    "ESzTFSxNqP",
                    "skEnfaheGA",
                    "u0M8THtHeu",
                    "3z52fzxiYn",
                    "ZEBeQFKqD6",
                    "HsJFBrsREs",
                    "AvCFAxuxUF",
                    "bYjn7kpxgy",
                    "NB7AzeSBRH",
                    "cKiSS5MKkf",
                    "Muxcv4Ua10",
                    "tWHgD3sg4A",
                    "JrWYjpNoTq",
                    "entTOZcC7x",
                    "jSbe0y9yo8",
                    "brRbraVeTe",
                    "pKnT4rw0q0",
                    "f5poCM6Gwq",
                    "WfgNctUyc9",
                    "VtxPtGv9Vv",
                    "RnNNlOBTQd",
                    "ZBV1DmYjhP",
                    "DRMwnfMBq2",
                    "Z6SYhFUMv7",
                    "10oWTuZIat",
                    "APluU5Dc6l",
                    "wNj7vCeMXz"
                ],
                threeAnswerChoices: [
                    "EoNDjbREoC"
                ],
                twoChoice_No_ShowConcern: [
                    "P8ZORJCP2t",
                    "anKnOz2zw9",
                    "da57qkCJJx",
                    "lTBnnPVswQ",
                    "FSxb56512e"
                ],
                twoChoices_Yes_ShowConcern: [
                    "NebDyUe5qg",
                    "wnj3m1I4fr",
                    "XPNbG5yWKK",
                    "G4RdTw8AlV",
                    "lkq0iDzd7Z",
                    "wsCQRHjYkg",
                    "3GuR72PJfe",
                    "P3h1vN21qh",
                    "2M78gEZsmt",
                    "DffMpv7KJi",
                    "GivFm6vAUY"
                ]
            };



            self.requiredResources[self.resourceNames.R_ELEMENTJSON] = new MongoElementJSON();
            self.requiredResources[self.resourceNames.R_ELEMENTJSON] = new MongoElementJSON();
            
            self.providedResources[self.resourceNames.P_CHARISNODDING] = new IsNodding();

            self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding = false;//boolean to let us know that the counselor is currently completing a head nod sequence


            //following variables are for getting the counselor to head nod
            self.headnodState = 0;//to determine state of the head nod
            self.headnodStateDelay = 350; // delay between each state
            self.lastNodStateChange = Date.now();//to track last state change
            self.headNodElapsedTime = 1000;
            self.timeLastHeadNodEnd = Date.now();

            self.getAngularElement();

        },
        //happy expression
        headnod1: function()
        {
            var self = this;

            if(self.initiateHeadnod){
                if((Date.now()-self.timeLastHeadNodEnd) >=  self.headNodElapsedTime) {
                    self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding = true;
                }

                self.headNodStateElapsedTime = Date.now() - self.lastNodStateChange;
                //console.log("delay: " + self.headNodElapsedTime);
                if(self.headnodState > 6){
                    self.headnodState = 1;
                }
                if(self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding && (self.headNodStateElapsedTime >= self.headnodStateDelay)){

                    self.lastNodStateChange = Date.now();
                    self.inHeadNodSequence = true;

                    if(self.headnodState == 1){
                        facslib.setTargetAU("6", 70, "", 1); //cheekRaiser
                        facslib.setTargetAU("12", 70, "", 1); //lipCornerPuller
                        //console.log("headnod on fleek!!!!!!!STATE--1--!!!!!!!!!!!!!!!");
                        facslib.setTargetAU("64", 5, "", 3.9);
                        facslib.setTargetAU("54", 5, "", 4);
                    }
                    else if(self.headnodState == 2){
                        //console.log("headnod on fleek!!!!!!!STATE--2--!!!!!!!!!!!!!!!");
                        facslib.setTargetAU("64", 0, "", 3.9);
                        facslib.setTargetAU("54", 0, "", 4);
                    }
                    else if(self.headnodState == 3){
                        //console.log("headnod on fleek!!!!!!!STATE--3--!!!!!!!!!!!!!!!");
                        facslib.setTargetAU("64", 8, "", 3.9);
                        facslib.setTargetAU("54", 8, "", 4);
                    }
                    else if(self.headnodState == 4){
                        //console.log("headnod on fleek!!!!!!!STATE--4--!!!!!!!!!!!!!!!");
                        facslib.setTargetAU("64", 0, "", 3.9);
                        facslib.setTargetAU("54", 0, "", 4);
                    }
                    else if(self.headnodState == 5){
                        //console.log("headnod on fleek!!!!!!!STATE--5--!!!!!!!!!!!!!!!");
                        facslib.setTargetAU("64", 10, "", 3.9);
                        facslib.setTargetAU("54", 10, "", 4);
                    }
                    else if(self.headnodState == 6){
                        //console.log("headnod on fleek!!!!!!!STATE--6--!!!!!!!!!!!!!!!");
                        facslib.setTargetAU("64", 0, "", 3.9);
                        facslib.setTargetAU("54", 0, "", 4);
                        facslib.setTargetAU("6", 30, "", 1); //cheekRaiser
                        facslib.setTargetAU("12", 30, "", 1); //lipCornerPuller
                        self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding = false;
                        self.initiateHeadnod = false;
                        self.headnodType = -1;
                        self.timeLastHeadNodEnd = Date.now();
                    }


                    facslib.updateEngine();
                    self.headnodState++;
                }
            }//if not already started a head nod, begin head nod




        },
        //concerned expression head nod
        headnod2: function()
        {

            //if not already started a head nod, begin head nod
            var self = this;


            if((Date.now()-self.timeLastHeadNodEnd) >=  self.headNodElapsedTime) {
                self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding = true;
            }

            self.headNodStateElapsedTime = Date.now() - self.lastNodStateChange;
            //console.log("delay: " + self.headNodElapsedTime);
            if(self.headnodState > 6){
                self.headnodState = 1;
            }
            if(self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding && (self.headNodStateElapsedTime >= self.headnodStateDelay)){

                self.lastNodStateChange = Date.now();
                self.inHeadNodSequence = true;

                if(self.headnodState == 1){
                    facslib.setTargetAU("6", 0, "", 1); //cheekRaiser
                    facslib.setTargetAU("12", 0, "", 1); //lipCornerPuller*!/
                    facslib.setTargetAU("1", 50, "", 1);
                    facslib.setTargetAU("2", 50, "", 1);
                    facslib.setTargetAU("4", 50, "", 1);
                    facslib.setTargetAU("5", 50, "", 1);
                    facslib.setTargetAU("7", 50, "", 1);

                    //console.log("headnod on fleek!!!!!!!STATE--1--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 5, "", 3.9);
                    facslib.setTargetAU("54", 5, "", 4);
                }
                else if(self.headnodState == 2){
                    //console.log("headnod on fleek!!!!!!!STATE--2--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 0, "", 3.9);
                    facslib.setTargetAU("54", 0, "", 4);
                }
                else if(self.headnodState == 3){
                    //console.log("headnod on fleek!!!!!!!STATE--3--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 8, "", 3.9);
                    facslib.setTargetAU("54", 8, "", 4);
                }
                else if(self.headnodState == 4){
                    //console.log("headnod on fleek!!!!!!!STATE--4--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 0, "", 3.9);
                    facslib.setTargetAU("54", 0, "", 4);
                }
                else if(self.headnodState == 5){
                    //console.log("headnod on fleek!!!!!!!STATE--5--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 10, "", 3.9);
                    facslib.setTargetAU("54", 10, "", 4);
                }
                else if(self.headnodState == 6){
                    //console.log("headnod on fleek!!!!!!!STATE--6--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 0, "", 3.9);
                    facslib.setTargetAU("54", 0, "", 4);
                    facslib.setTargetAU("6", 20, "", 1); //cheekRaiser
                    facslib.setTargetAU("12", 20, "", 1); //lipCornerPuller*!/
                    facslib.setTargetAU("1", 0, "", 1);
                    facslib.setTargetAU("2", 0, "", 1);
                    facslib.setTargetAU("4", 0, "", 1);
                    facslib.setTargetAU("5", 0, "", 1);
                    facslib.setTargetAU("7", 0, "", 1);

                    self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding = false;
                    self.initiateHeadnod = false;
                    self.headnodType = -1;
                    self.timeLastHeadNodEnd = Date.now();
                }


                facslib.updateEngine();
                self.headnodState++;
            }
        },
        //neutral expression head nod
        headnod3: function()
        {

            //if not already started a head nod, begin head nod
            var self = this;


            if((Date.now()-self.timeLastHeadNodEnd) >=  self.headNodElapsedTime) {
                self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding = true;
            }

            self.headNodStateElapsedTime = Date.now() - self.lastNodStateChange;
            //console.log("delay: " + self.headNodElapsedTime);
            //console.log("self.headnodState: "+ self.headnodState);
            if(self.headnodState > 6){
                self.headnodState = 1;
            }
            if(self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding && (self.headNodStateElapsedTime >= self.headnodStateDelay)){

                self.lastNodStateChange = Date.now();
                self.inHeadNodSequence = true;

                if(self.headnodState == 1){
                    facslib.setTargetAU("6", 0, "", 1); //cheekRaiser
                    facslib.setTargetAU("12", 0, "", 1); //lipCornerPuller*!/
                    facslib.setTargetAU("1", 0, "", 1);
                    facslib.setTargetAU("2", 0, "", 1);
                    facslib.setTargetAU("4", 0, "", 1);
                    facslib.setTargetAU("5", 0, "", 1);
                    facslib.setTargetAU("7", 0, "", 1);

                    //console.log("headnod on fleek!!!!!!!STATE--1--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 50, "", 3.9);
                    facslib.setTargetAU("54", 50, "", 4);
                }
                else if(self.headnodState == 2){
                    //console.log("headnod on fleek!!!!!!!STATE--2--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 0, "", 3.9);
                    facslib.setTargetAU("54", 0, "", 4);
                }
                else if(self.headnodState == 3){
                    //console.log("headnod on fleek!!!!!!!STATE--3--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 8, "", 3.9);
                    facslib.setTargetAU("54", 8, "", 4);
                }
                else if(self.headnodState == 4){
                    //console.log("headnod on fleek!!!!!!!STATE--4--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 0, "", 3.9);
                    facslib.setTargetAU("54", 0, "", 4);
                }
                else if(self.headnodState == 5){
                    //console.log("headnod on fleek!!!!!!!STATE--5--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 10, "", 3.9);
                    facslib.setTargetAU("54", 10, "", 4);
                }
                else if(self.headnodState == 6){
                    //console.log("headnod on fleek!!!!!!!STATE--6--!!!!!!!!!!!!!!!");
                    facslib.setTargetAU("64", 0, "", 3.9);
                    facslib.setTargetAU("54", 0, "", 4);
                    facslib.setTargetAU("6", 30, "", 1); //cheekRaiser
                    facslib.setTargetAU("12", 30, "", 1); //lipCornerPuller*!/
                    facslib.setTargetAU("1", 0, "", 1);
                    facslib.setTargetAU("2", 0, "", 1);
                    facslib.setTargetAU("4", 0, "", 1);
                    facslib.setTargetAU("5", 0, "", 1);
                    facslib.setTargetAU("7", 0, "", 1);

                    self.providedResources[self.resourceNames.P_CHARISNODDING].container.isNodding = false;
                    self.initiateHeadnod = false;
                    self.headnodType = -1;
                    self.timeLastHeadNodEnd = Date.now();
                }


                facslib.updateEngine();
                self.headnodState++;
            }
        },

        getAngularElement : function()
        {
            var self = this;

            var appElement = document.querySelector('[id=inputPanel]');//webgl-app]');
            var scope = angular.element(appElement).scope();

            if(scope === undefined)
            {
                setTimeout(function() {
                    self.getAngularElement();
                }, 10);
                return;
            }

            self.controllerScope = scope;
            self.angularScope = scope.$root;
        },

        setHeadnodType: function (element){

            var self = this;

            var usrRes = self.angularScope.userResponse;

            self.initiateHeadnod = true;

            if(self.needingHeadNod.fourAnswerChoices.includes(element)){
                if(usrRes != null){
                    if(usrRes == 0){
                        self.headnodType = 1;
                    }else if(usrRes == 3){
                        self.headnodType = 2;
                    }else{
                        self.headnodType = 3;
                    }
                }

            }else if(self.needingHeadNod.twoChoices_Yes_ShowConcern.includes(element)){
                if(usrRes != null){
                    if(usrRes==1){
                        self.headnodType = 1;
                    }else if(usrRes == 0){
                        self.headnodType = 2;
                    }else{
                        self.headnodType = 3;
                    }
                }

            }else if(self.needingHeadNod.onlyHappy.includes(element)){
                if(usrRes != null){
                    self.headnodType = 1;
                }

            }else if(self.needingHeadNod.fiveAnswerChoices.includes(element)){
                if(usrRes != null){
                    if(usrRes==0||usrRes == 1){
                        self.headnodType = 1;
                    }else if(usrRes == 4){
                        self.headnodType = 2;
                    }else{
                        self.headnodType = 3;
                    }
                }

            }else if(self.needingHeadNod.twoChoice_No_ShowConcern.includes(element)){
                if(usrRes != null){
                    if(usrRes==0){
                        self.headnodType = 2;
                    }else if(usrRes == 1){
                        self.headnodType = 1;
                    }else{
                        self.headnodType = 3;
                    }
                }

            }else if(self.needingHeadNod.threeAnswerChoices.includes(element)){
                if(usrRes != null){
                    if(usrRes==0){
                        self.headnodType = 1;
                    }else if(usrRes == 2){
                        self.headnodType = 2;
                    }else{
                        self.headnodType = 3;
                    }
                }

            }else{
                self.headnodType = -1;
            }

        },

        run: function()
        {
            var self = this;

            //console.log("Nodding now.");
            // facslib.setTargetAU("64", 50, "", 4);
            // facslib.setTargetAU("54", 50, "", 4);
            
            
            // if (self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json != null){

            //     try {
            //         var currElement = self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json.id;
            //         //check if there is a previous element, if not set it to the current element
            //         if(self.prevElement == null){
            //             self.prevElement = self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json.id;
            //         }
            //         //if the prev element is not the same as current element and we haven't found the new element, elements has changed
            //         //and we need to set flag that element was found to true and the flag that indicates the user has responded to false
            //         else if(self.prevElement != currElement && !self.foundNewElement){
            //             //elements have changed
            //             self.foundNewElement = true;
            //             self.userResponded = false;

            //             //console.log("We have a new element!" + typeof currElement);
            //         }
            //         //we need to see if previous element is not the same as current element and if have already found the new current element
            //         //we need to set the previous element to the current element and reset the flag indicating we have found the new element
            //         else if(self.prevElement != currElement && self.foundNewElement){
            //             self.foundNewElement = false;
            //             self.prevElement = currElement;
            //             self.prevElement = currElement;
            //             console.log("resetting current element");
            //         }else if(!self.userResponded && self.angularScope.userResponse != null ){
            //             //user has responded need to head nod now
            //             self.userResponded = true;
            //             self.setHeadnodType(currElement);
            //         }
            //     }catch (err){
            //         console.log("Headnod Module - main.js: " + err);
            //     }
            // }

            // switch (self.headnodType){
            //     case 1://happy
            //         self.headnod1();
            //         break;
            //     case 2://concerned
            //         self.headnod2();
            //         break;
            //     case 3://neutral
            //         self.headnod3();
            //         break;
            //     default:
            //         break;
            // }




        }

    });
