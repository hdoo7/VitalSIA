    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "jSbe0y9yo8",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "UwhNedrfDF",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "brRbraVeTe",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "tpEo1xFKXk",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "pKnT4rw0q0",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "f5poCM6Gwq",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "WfgNctUyc9",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "uLqHs3Cdon",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "VtxPtGv9Vv",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "RnNNlOBTQd",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "ZBV1DmYjhP",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "EvAGJWHkWQ",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "DRMwnfMBq2",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Z6SYhFUMv7",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "10oWTuZIat",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "APluU5Dc6l",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "IISlXLUAzC",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "wNj7vCeMXz",
    "survey": "dependence",
    "isFirst": false,
    "isLast": true
}];
var TOTAL_NUM_QUESTIONS = {
    audit: 10,
    GTNSGT: 2,
    howMuchHowOften: 0,
    familyHistory: 10,
    myDrinking: 3,
    otherDrugs: 3,
    ARP: 50,
    depression: 20,
    MAST: 24,
    dependence: 21
};
var NEW_USER_PROGRESS = {
    user: {},
    GTNSGT: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    audit: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    howMuchHowOften: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    familyHistory: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    myDrinking: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    otherDrugs: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    ARP: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    depression: [{
        "formId": "",
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    MAST: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    dependence: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }],
    likeDontLike: [{
        "timestamp": "",
        "responsesPtr": [],
        "percentageComplete": "0",
        "currentElement": ""
    }]
};
var LIKE_DONT_LIKE = [{
    "id": "jRiKWdVuIw",
    "survey": "GTNSGT",
    "isFirst": true,
    "isLast": false
}, {
    "id": "OXRtsBdAK3",
    "survey": "GTNSGT",
    "isFirst": false,
    "isLast": true
}];
var MENU_ELEMENTS = ["4lHNsBzB0x", "RLJpGOTkue"];
var MENU_ELEMENTS_CHECK = ["aO6qCMcRvH", "BxbtJXn8f6"];

var ABBREV_ELEMENT_OBJECTS = {
    audit: AUDIT,
    GTNSGT: LIKE_DONT_LIKE,
    howMuchHowOften: HOWMUCHHOWOFTEN,
    familyHistory: FAMILYHISTORY,
    myDrinking: MYDRINKING,
    otherDrugs: OTHERDRUGS,
    ARP: A_R_P,
    depression: DEPRESSION,
    MAST: MAST,
    dependence: DEPENDENCE
};

angular.module('app').controller('webglController', webglController);

webglController.$inject = ['$scope', '$window', '$state', '$rootScope', '$timeout', '$http', '$ocLazyLoad', '$uibModal', 'AuthService', 'widgetService', 'characterService', 'localStorageService', 'ProgressService', 'UserService'];

function webglController($scope, $window, $state, $rootScope, $timeout, $http, $ocLazyLoad, $uibModal, AuthService, widgetService, characterService, localStorageService, ProgressService, UserService) {
    $scope.progressSrv = ProgressService;
    $scope.usrSrvc = UserService;
    $scope.currentElement_abbreviated = {};
    $scope.widget = widgetService;
    $scope.currentUser = Parse.User.current();
    $scope.isLoggedIn = AuthService.isLoggedIn;
    $scope.showLogin = false;
    $scope.tmpRes = [];
    $scope.auditIds = ["480OIkUfRe", "NTEyjG7JaV", "3b8HApHIsW", "9PV3mDHsYj", "o3Vvd9PuV4", "7hrQrRkroo", "fcrMyhewqP", "XnBeaqJpLP", "EoNDjbREoC", "TRbkGxXZij"];
    $scope.lastElementInFormIds = [{
        "name": "audit",
        "elementID": "TRbkGxXZij"
    }, {
        "name": "GTNSGT",
        "elementID": "UY59yLDhwG"
    }, {
        "name": "howMuchHowOften",
        "elementID": "XTxMZ7TJ4h"
    }, {
        "name": "ARP",
        "elementID": "xX6fmHzV8a"
    }, {
        "name": "depression",
        "elementID": "tWHgD3sg4A"
    }, {
        "name": "MAST",
        "elementID": "e1yYpKX6jG"
    }, {
        "name": "dependence",
        "elementID": "wNj7vCeMXz"
    }];
    $scope.$root.usrCmd = {
        "goBack": false
    };
    $scope.newUserProgress = NEW_USER_PROGRESS;
    $scope.currentUserProgress = {};
    $scope.currentQuestionNumber = 0;
    $scope.currentPercentComplete = 0;
    $scope.mode = {
        "loggingIn": false,
        "register": false,
        "loggingOut": false,
        "isLoggedIn": false,
        "forgotPW": false,
        // "forgotUN": false,
        "loginActivated": false,
        "optionsActivated": false,
        "updatePW": false,
        "isTempUser": false
    };
    $scope.tempUser = {};
    $scope.tempUserProgress = {};
    $scope.rangeLabel = 'Not Ready';
    $scope.readinessLabels = ["I have no interest at all in changing my drinking and I'm not interested in considering any changes in the " + "future even if my situation changes", "I'm not interested in changing my drinking right now but am willing to consider experimenting with different " + "patterns in the future.", "I'm considering how I might want to change my drinking.", "I'm consdiering cutting back on my drinking or not drinking at all."];
    $scope.credentials = {
        firstname: "",
        //lastname: "",
        username: "",
        password: "",
        email: "",
        education: "",
        gender: "",
        dateOfBirth: "",
        age: "",
        weight: "",
        height: {
            total: 0,
            feet: "",
            inches: ""
        },
        ethnicity: "",
        race: [],
        maritalstatus: "",
        confirmpassword: "",
        confirmemail: "",
        fp_email: "",
        fp_DOB: ""
    };

    //following handles the Success and Error messages
    $scope.Success = function (message) {
        $scope.alert = {
            alertClass: "alert-success",
            alertType: "Success!",
            alertText: message
        };
    };
    $scope.Error = function (message) {
        $scope.alert = {
            alertClass: "alert-danger",
            alertType: "Error!",
            alertText: message
        };
    };
    var forcePreviousQuestion = true;
    var Response = Parse.Object.extend('Response');
    var Element = Parse.Object.extend('Element');
    var User = Parse.Object.extend('User');

    function loadUnity(char) {
        character = char;
        return $ocLazyLoad.load({
            serie: true,
            files: [
            // load initial setup
            'unity/facs/engine3d.js', 'unity/facs/facslib.js', 'unity/facs/engineWebGL_u3d.js', char.path + 'UnityLoader.js', 'unity/UnitySettings.js']
        });
    }

    $scope.unityLoaded = function () {
        $ocLazyLoad.load({
            serie: true,
            files: ['/mainframe/js/common/three.min.js', '/mainframe/js/common/prototype.js', '/mainframe/js/mainframe.settings.js', '/mainframe/js/mainframe.classes.js']
        }).then(function () {
            mainframe = new Mainframe($state.current.data.mainframeConfig); // initialize mainframe
            mainframe.run(); // starts Mihai's mainframe
        });
    };

    //function used to determine if the QA should be treated as a Menu
    $scope.isMenu = function (elemID) {
        //console.log("in is menu function with for element: " + elemID);
        if (MENU_ELEMENTS.includes(elemID)) {
            //console.log("isMenu returning true");
            return true;
        } else {
            //console.log("isMenu returning false");
            return false;
        }
    };
    $scope.isMenuCheck = function (elemID) {
        //console.log("in is menu function with for element: " + elemID);
        if (MENU_ELEMENTS_CHECK.includes(elemID)) {
            //console.log("isMenuCheck returning true");
            return true;
        } else {
            //console.log("isMenuCheck returning false");
            return false;
        }
    };
    $scope.isQA = function (elemID, type) {
        //console.log("in is menu function with for element: " + elemID);
        if (!MENU_ELEMENTS_CHECK.includes(elemID) && !MENU_ELEMENTS.includes(elemID) && type == "QuestionAnswer") {
            //console.log("isQA returning true");
            return true;
        } else {
            //console.log("isQA returning false");
            return false;
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // init function. called when the counseling controller is loaded
    // -----------------------------------------------------------------------------------------------------------------
    var init = function init() {

        $scope.currentUser = AuthService.currentUser();
        $scope.currentQuestionNumber = 0;

        $scope.widget.fetchAll(); // now we can load all injects
        loadUnity($state.current.data.character || characterService.getUsersCounselor());
        $scope.$root.selectedCounselorVoiceIndex = characterService.getUsersCounselor().voiceIndex;
        $scope.$root.selectedCounselor = characterService.getUsersCounselor();

        if ($scope.currentUser) {
            $scope.userGivenName = $scope.currentUser.object.attributes.firstName;
            $scope.mode.isTempUser = $scope.currentUser.object.attributes.tempUser;
            /*console.log("temp user");
             console.log($scope.currentUser);*/
            getUserProgress($scope.currentUser.object, false, false);
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    //  delegates clicking on an HTML inject to it's particular function
    // -----------------------------------------------------------------------------------------------------------------

    $scope.htmlClick = function (html) {
        html.click();
    };

    // -----------------------------------------------------------------------------------------------------------------
    //  Determines ng-class of div wrapping counseling view for sliding menu. andy
    // -----------------------------------------------------------------------------------------------------------------
    $scope.checked = false;
    $scope.isMenuOpen = true;

    $scope.myCounselor = function () {
        $scope.checked = !$scope.checked;
        if ($scope.isMenuOpen) {
            dynamic();
            $scope.isMenuOpen = false;
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // handles the modification of the progress bar in the view (for the audio progress)
    // -----------------------------------------------------------------------------------------------------------------

    //For the progress circle.
    //Everytime a new questionnaire is loaded, change current Questionnaire value
    $scope.progressValue = 0;
    $scope.currentQuestionnaire = "Audit";

    $scope.auditAnswer = -1;
    $scope.myProgress = function () {
        var progress = $scope.widget.myProgress;
        var userProgress = {};
        var indicies = [];

        var index = 0;
        progress.hidden = !progress.hidden;

        if (!progress.hidden) {
            //if current UserProgress is not null use it for percentages, else use newUserProgress to fill progress object
            /* console.log($scope.currentUserProgress.attributes);*/

            if ($scope.currentUserProgress == null) {
                // console.log("**************newUserProgress************");
                // console.log( $scope.currentUserProgress);
                userProgress = $scope.newUserProgress;
            } else {
                // console.log("**********currentUserProgress*********");
                userProgress = $scope.currentUserProgress.attributes;
            }

            //get index of each of last complete survey
            indicies.push(userProgress.audit.length - 1);
            indicies.push(userProgress.howMuchHowOften.length - 1);
            indicies.push(userProgress.GTNSGT.length - 1);
            indicies.push(userProgress.ARP.length - 1);
            indicies.push(userProgress.depression.length - 1);
            indicies.push(userProgress.MAST.length - 1);
            indicies.push(userProgress.dependence.length - 1);

            index = Math.min.apply(Math, indicies);
            /*console.log("min length is: " + index);
            console.log(indicies);*/

            if (index > 0) {
                index -= 1;
            }

            $scope.progressBarValue = [{
                "progressBar": userProgress.audit[index].percentageComplete + "%",
                "questionnaire": "Audit"
            }, {
                "progressBar": userProgress.howMuchHowOften[index].percentageComplete + "%",
                "questionnaire": "How Much and How Often"
            }, {
                "progressBar": userProgress.GTNSGT[index].percentageComplete + "%",
                "questionnaire": "The Good Things and Not So Good Things"
            }, {
                "progressBar": userProgress.ARP[index].percentageComplete + "%",
                "questionnaire": "Alcohol Related Problems"
            }, {
                "progressBar": userProgress.depression[index].percentageComplete + "%",
                "questionnaire": "Depression Survey"
            }, {
                "progressBar": userProgress.MAST[index].percentageComplete + "%",
                "questionnaire": "MAST"
            }, {
                "progressBar": userProgress.dependence[index].percentageComplete + "%",
                "questionnaire": "Dependence"
            }];
        }

        /* if (progress.hidden == false) {
         console.log("For AuditScore : ");
         console.log("Questions: " + 10);
         console.log("Answered: " + $scope.auditAnswer);
           if ($scope.auditAnswer >= 0) {
         auditProgress = ($scope.auditAnswer / 10) * 100;
         auditProgress = auditProgress + "%";
         $scope.progressBarValue[0].progressBar = auditProgress;
           }
           $http.get('/api/dcu/getDrincScore/577fd4747337e7856c9afe65')
         .then(
         function (res) {
         console.log("For DrincScore : ");
         console.log(res.numOfQuestions);
         console.log(res.answered);
         drincProgress = (res.answered / res.numOfQuestions) * 100;
         drincProgress = drincProgress + "%";
         $scope.progressBarValue[2].progressBar = drincProgress;
         console.log(drincProgress);
         return res;
         },
         function (err) {
         return err;
         }
         );
           $http.get('/api/dcu/getSADQScore/577feebd7337e7856c9afead/577fef827337e7856c9afeb3/577ff1aa7337e7856c9afec4')
         .then(
         function (res) {
         console.log("For SADQScore : ");
         console.log(res.numOfQuestions);
         console.log(res.answered);
         SADQCProgress = (res.answered / res.numOfQuestions) * 100;
         SADQCProgress = SADQCProgress + "%";
         $scope.progressBarValue[3].progressBar = SADQCProgress;
         console.log(SADQCProgress);
         return res;
         },
         function (err) {
         return err;
         }
         );
           $http.get('/api/dcu/getSOCRATESScore/577ff2227337e7856c9afec9')
         .then(
         function (res) {
         console.log("For Socrates : ");
         console.log(res.numOfQuestions);
         console.log(res.answered);
         socratesProgress = (res.answered / res.numOfQuestions) * 100;
           if (socratesProgress != "0") socratesProgress = parseInt(socratesProgress) + "%";
         else socratesProgress = socratesProgress + "%";
           $scope.progressBarValue[4].progressBar = socratesProgress;
         console.log(socratesProgress);
         return res;
         },
         function (err) {
         return err;
         }
         );
         }*/
    };

    $scope.fullscreen = true;
    // changes eEva to minimized or maximized depending on the bool provided
    $scope.toggleFullscreen = function (bool) {
        $scope.fullscreen = bool;
        $scope.widget['virtualys'].classes['ue-full'] = bool;
        $scope.widget['virtualys'].classes['ue-half'] = !bool;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // used by the mainframe to know when the user has clicked on an answer
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$root.directInputTimestamp = 0;

    $scope.next = function () {
        $scope.$root.directInputTimestamp = Date.now();

        var nod = Math.floor(Math.random() * (3 - 1)) + 1;
        //console.log(nod);

        switch (nod) {
            case 1:
                //SendMessage('FACcontroler', 'SetAnimation', 'nod1');

                break;
            case 2:
                //SendMessage('FACcontroler', 'SetAnimation', 'nod2');

                break;
            case 3:
                //SendMessage('FACcontroler', 'SetAnimation', 'nod3');

                break;
        }
    };

    $scope.goBackButton = function () {
        $scope.$root.usrCmd.goBack = true;
        $scope.$root.userResponse = -99;
        $scope.next();
    };

    //helper function for getting the abbreviated element object. This is not the same object as in the newSurvey controller,
    //this object only contains the element id (string), the name of the survey in which in belongs (string), and lastly a (bool)
    //to indicate if that element is the last element of the survey
    function getAbbrevElementObj(elemId) {
        //console.log(elemId);

        //check if element belongs to audit ABBREV_ELEMENT_OBJECTS.audit
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.audit.length; i++) {
            //console.log("audit " + i);
            if (elemId == ABBREV_ELEMENT_OBJECTS.audit[i].id) {
                return ABBREV_ELEMENT_OBJECTS.audit[i];
            }
        }

        //check if element belongs to GTNSGT
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.GTNSGT.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.GTNSGT[i].id) {
                //console.log("gtnsgt " + i);
                return ABBREV_ELEMENT_OBJECTS.GTNSGT[i];
            }
        }

        /*//check if element belongs to howMuchHowOften
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.howMuchHowOften.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.howMuchHowOften[i].id) {
                console.log("howMuchHowOften " + i);
                return ABBREV_ELEMENT_OBJECTS.howMuchHowOften[i];
            }
        }*/

        //check if element belongs to familyHistory
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.familyHistory.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.familyHistory[i].id) {
                //console.log("familyHistory " + i);
                return ABBREV_ELEMENT_OBJECTS.familyHistory[i];
            }
        }

        //check if element belongs to myDrinking
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.myDrinking.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.myDrinking[i].id) {
                //console.log("myDrinking " + i);
                return ABBREV_ELEMENT_OBJECTS.myDrinking[i];
            }
        }

        //check if element belongs to otherDrugs
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.otherDrugs.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.otherDrugs[i].id) {
                //console.log("otherDrugs " + i);
                return ABBREV_ELEMENT_OBJECTS.otherDrugs[i];
            }
        }

        //check if element belongs to ARP
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.ARP.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.ARP[i].id) {
                //console.log("ARP " + i);
                return ABBREV_ELEMENT_OBJECTS.ARP[i];
            }
        }

        //check if element belongs to depression
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.depression.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.depression[i].id) {
                //console.log("ARP " + i);
                return ABBREV_ELEMENT_OBJECTS.depression[i];
            }
        }

        //check if element belongs to MAST
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.MAST.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.MAST[i].id) {
                //console.log("MAST " + i);
                return ABBREV_ELEMENT_OBJECTS.MAST[i];
            }
        }

        //check if element belongs to dependence
        for (var i = 0; i < ABBREV_ELEMENT_OBJECTS.dependence.length; i++) {
            if (elemId == ABBREV_ELEMENT_OBJECTS.dependence[i].id) {
                //console.log("dependence " + i);
                return ABBREV_ELEMENT_OBJECTS.dependence[i];
            }
        }

        return false;
    };

    //following helper function is used to update the howMuchHowOften survey since it is dependent on 3 sections to be complete

    function updateHowMuchHowOften(progressIndx) {
        //check if need to mark howMuchHowOften complete by checking if both myDrinking and otherDrugs is complete
        //by seeing if that have timestamps within this same index
        /* console.log("in updateHowMuchHowOften");
         console.log(progressIndx);
         console.log($scope.currentUserProgress.attributes);*/
        var lenFH = $scope.currentUserProgress.attributes.familyHistory.length;
        var lenOD = $scope.currentUserProgress.attributes.otherDrugs.length;
        var lenMY = $scope.currentUserProgress.attributes.myDrinking.length;

        if (progressIndx < lenFH && progressIndx < lenOD && progressIndx < lenMY) {
            if ($scope.currentUserProgress.attributes.howMuchHowOften[progressIndx].percentageComplete == "66") {
                //mark the howMuchHowOften survey complete
                //console.log("marking howMuchHowOften complete!!!");
                markHowMuchSurveyComplete();
            } else {
                if ($scope.currentUserProgress.attributes.howMuchHowOften[progressIndx].percentageComplete == "33") {
                    //console.log("updating howMuchHowOften 66!!!");
                    $scope.currentUserProgress.attributes.howMuchHowOften[progressIndx].percentageComplete = "66";
                } else {
                    //console.log("updating howMuchHowOften 33!!!");
                    $scope.currentUserProgress.attributes.howMuchHowOften[progressIndx].percentageComplete = "33";
                }
            }
        }

        /*if(($scope.currentUserProgress.attributes.familyHistory[progressIndx].timeStamp) || ($scope.currentUserProgress.attributes.otherDrugs[progressIndx].timeStamp)){
            //set howMuchHowOften to 66%
            $scope.currentUserProgress.attributes.howMuchHowOften[progressIndx].percentageComplete = "66";
        }else{
            //set howMuchHowOften to 33%
            $scope.currentUserProgress.attributes.howMuchHowOften[progressIndx].percentageComplete = "33";
        }*/
    }

    function markHowMuchSurveyComplete() {
        var defaultValue = {
            "timestamp": "",
            "responsesPtr": [],
            "percentageComplete": "0",
            "currentElement": ""
        };
        var timeCompleted = Date.now();

        //get the last entry index in the howMuchHowOften array
        var index = $scope.currentUserProgress.attributes.howMuchHowOften.length - 1;

        //update the howMuchHowOften by updating the percentageComplete and the timestamp and pushing last response
        $scope.currentUserProgress.attributes.howMuchHowOften[index].percentageComplete = "100";
        $scope.currentUserProgress.attributes.howMuchHowOften[index].timestamp = timeCompleted;

        //add new howMuchHowOften entry
        $scope.currentUserProgress.attributes.howMuchHowOften[index + 1] = defaultValue;

        //save users progress
        $scope.currentUserProgress.save().then(function (progress) {
            return console.log("User's progress updated successfully.  The howMuchHowOften was marked complete on:  " + timeCompleted);
        }, function (error) {
            return console.log("There was an error updating the user's progress.  Error: " + error);
        });
    }

    //the following function is responsible for marking a survey complete whenever a user has finished the last question
    //of that survey
    function markSurveyComplete(surveyName, responseObject) {
        var defaultValue = {
            "timestamp": "",
            "responsesPtr": [],
            "percentageComplete": "0",
            "currentElement": ""
        };
        var timeCompleted = Date.now();

        //if currentUserHasProgress, if not then need to update the audit in the newUserProgress object
        if ($scope.currentUserProgress) {
            if (surveyName == "audit") {

                //get the last entry index in the audit array
                var index = $scope.currentUserProgress.attributes.audit.length - 1;

                //check if the audits current percent complete if is zero if so then the audit cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.audit[index].percentageComplete != "0") {
                    //update the audit by updating the percentageComplete and the timestamp and pushing last response object
                    $scope.currentUserProgress.attributes.audit[index].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.audit[index].timestamp = timeCompleted;
                    //console.log($scope.currentUserProgress.attributes.audit );
                    $scope.currentUserProgress.attributes.audit[index].responsesPtr.push(responseObject);

                    //add new audit entry
                    $scope.currentUserProgress.attributes.audit[index + 1] = defaultValue;

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The Audit was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "GTNSGT") {
                //get the last entry index in the GTNSGT array
                var _index = $scope.currentUserProgress.attributes.GTNSGT.length - 1;

                //check if the GTNSGT current percent complete if is zero if so then the GTNSGT cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.GTNSGT[_index].percentageComplete != "0") {
                    //update the GTNSGT by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.GTNSGT[_index].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.GTNSGT[_index].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.GTNSGT[_index].responsesPtr.push(responseObject);

                    //add new GTNSGT entry
                    $scope.currentUserProgress.attributes.GTNSGT[_index + 1] = defaultValue;

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The GTNSGT was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "howMuchHowOften") {
                //get the last entry index in the howMuchHowOften array
                var _index2 = $scope.currentUserProgress.attributes.howMuchHowOften.length - 1;

                //check if the howMuchHowOften current percent complete if is zero if so then the howMuchHowOften cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.howMuchHowOften[_index2].percentageComplete != "0") {
                    //update the howMuchHowOften by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.howMuchHowOften[_index2].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.howMuchHowOften[_index2].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.howMuchHowOften[_index2].responsesPtr.push(responseObject);

                    //add new howMuchHowOften entry
                    $scope.currentUserProgress.attributes.howMuchHowOften[_index2 + 1] = defaultValue;

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The howMuchHowOften was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "familyHistory") {
                //get the last entry index in the familyHistory array
                var _index3 = $scope.currentUserProgress.attributes.familyHistory.length - 1;

                //check if the familyHistory current percent complete if is zero if so then the familyHistory cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.familyHistory[_index3].percentageComplete != "0") {

                    //update the familyHistory by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.familyHistory[_index3].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.familyHistory[_index3].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.familyHistory[_index3].responsesPtr.push(responseObject);

                    //add new familyHistory entry
                    $scope.currentUserProgress.attributes.familyHistory[_index3 + 1] = defaultValue;

                    //update howMuchHowOften
                    //console.log("index sent to howMuchHowOften " + index);
                    updateHowMuchHowOften(_index3);

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The familyHistory was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "myDrinking") {
                //get the last entry index in the myDrinking array
                var _index4 = $scope.currentUserProgress.attributes.myDrinking.length - 1;

                //check if the myDrinking current percent complete if is zero if so then the myDrinking cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.myDrinking[_index4].percentageComplete != "0") {

                    //update the myDrinking by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.myDrinking[_index4].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.myDrinking[_index4].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.myDrinking[_index4].responsesPtr.push(responseObject);

                    //add new myDrinking entry
                    $scope.currentUserProgress.attributes.myDrinking[_index4 + 1] = defaultValue;;

                    //update howMuchHowOften
                    updateHowMuchHowOften(_index4);

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The myDrinking was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "otherDrugs") {
                //get the last entry index in the otherDrugs array
                var _index5 = $scope.currentUserProgress.attributes.otherDrugs.length - 1;

                //check if the otherDrugs current percent complete if is zero if so then the otherDrugs cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.otherDrugs[_index5].percentageComplete != "0") {

                    //update the otherDrugs by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.otherDrugs[_index5].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.otherDrugs[_index5].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.otherDrugs[_index5].responsesPtr.push(responseObject);

                    //add new otherDrugs entry
                    $scope.currentUserProgress.attributes.otherDrugs[_index5 + 1] = defaultValue;

                    //update howMuchHowOften
                    updateHowMuchHowOften(_index5);

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The otherDrugs was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "ARP") {
                //get the last entry index in the ARP array
                var _index6 = $scope.currentUserProgress.attributes.ARP.length - 1;

                //check if the ARP current percent complete if is zero if so then the ARP cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.ARP[_index6].percentageComplete != "0") {

                    //update the ARP by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.ARP[_index6].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.ARP[_index6].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.ARP[_index6].responsesPtr.push(responseObject);

                    //add new ARP entry
                    $scope.currentUserProgress.attributes.ARP[_index6 + 1] = defaultValue;

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The ARP was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "depression") {
                //get the last entry index in the depression array
                var _index7 = $scope.currentUserProgress.attributes.depression.length - 1;

                //check if the depression current percent complete if is zero if so then the depression cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.depression[_index7].percentageComplete != "0") {

                    //update the depression by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.depression[_index7].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.depression[_index7].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.depression[_index7].responsesPtr.push(responseObject);

                    //add new depression entry
                    $scope.currentUserProgress.attributes.depression[_index7 + 1] = defaultValue;

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The depression was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "MAST") {
                //get the last entry index in the MAST array
                var _index8 = $scope.currentUserProgress.attributes.MAST.length - 1;

                //check if the MAST current percent complete if is zero if so then the MAST cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.MAST[_index8].percentageComplete != "0") {
                    //update the MAST by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.MAST[_index8].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.MAST[_index8].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.MAST[_index8].responsesPtr.push(responseObject);

                    //add new MAST entry
                    $scope.currentUserProgress.attributes.MAST[_index8 + 1] = defaultValue;

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The MAST was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else if (surveyName == "dependence") {
                //get the last entry index in the dependence array
                var _index9 = $scope.currentUserProgress.attributes.dependence.length - 1;

                //check if the dependence current percent complete if is zero if so then the dependence cannot be complete, it can be completed
                if ($scope.currentUserProgress.attributes.dependence[_index9].percentageComplete != "0") {
                    //update the dependence by updating the percentageComplete and the timestamp and pushing last response
                    $scope.currentUserProgress.attributes.dependence[_index9].percentageComplete = "100";
                    $scope.currentUserProgress.attributes.dependence[_index9].timestamp = timeCompleted;
                    $scope.currentUserProgress.attributes.dependence[_index9].responsesPtr.push(responseObject);

                    //add new dependence entry
                    $scope.currentUserProgress.attributes.dependence.push(defaultValue);

                    //save users progress
                    $scope.currentUserProgress.save().then(function (progress) {
                        return console.log("User's progress updated successfully.  The dependence was marked complete on:  " + timeCompleted);
                    }, function (error) {
                        return console.log("There was an error updating the user's progress.  Error: " + error);
                    });
                }
            } else {
                //console.log("Could not mark "+ surveyName + " complete!  Please try again!");
            }
        } else {
            //the users progress needs to be saved to the newUsersProgress object
            if (surveyName == "audit") {

                //get the last entry index in the audit array
                var _index10 = $scope.newUserProgress.audit.length - 1;

                //update the audit by updating the percentageComplete and the timestamp and pushing last response
                $scope.newUserProgress.audit.percentageComplete = "100";
                $scope.newUserProgress.audit.timestamp = timeCompleted;
                $scope.newUserProgress.audit.responsesPtr.push(responseObject);
            }
        }

        $scope.currentQuestionNumber = 0;
        $scope.currentPercentComplete = 0;
    };

    //utility function to check if objects are empty
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    };

