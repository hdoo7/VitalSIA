    $scope.selectedEducation = "";

    $scope.genderType = ['Male', 'Female', 'Other'];
    $scope.selectedGender = "";

    $scope.ethnicityType = ['Hispanic or Latino', 'Not Hispanic or Latino'];
    $scope.selectedEthnicity = "";

    $scope.raceType = ['American Indian or Alaska Native', 'Asian', 'Black or African Descent', 'Native Hawaiian or Other Pacific Islander', 'White'];
    $scope.selectedRace = [];

    $scope.maritalType = ['Single, Not Married', 'Married', 'Living with partner', 'Separated', 'Divorced', 'Widowed', 'Prefer not to answer'];
    $scope.selectedMaritalStatus = "";

    $scope.selectedAnwser = "";

    // -----------------------------------------------------------------------------------------------------------------
    // called when the user clicks the register button. registers the user into the server
    // -----------------------------------------------------------------------------------------------------------------

    $scope.register = function () {

        $scope.hasRegistered = false;
        $scope.credentials.answers = $scope.profile.answers;
        $scope.credentials.education = $scope.selectedEducation;
        $scope.credentials.gender = $scope.selectedGender;
        $scope.credentials.ethnicity = $scope.selectedEthnicity;
        $scope.credentials.race = $scope.selectedRace;
        $scope.credentials.maritalstatus = $scope.selectedMaritalStatus;
        $scope.credentials.programRequired = $scope.selectedAnwser;
        //console.log($scope.credentials);


        AuthService.register($scope.credentials).then(function (success) {

            $scope.hasRegistered = true;
            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: success.message
            });

            //$scope.login();

        }, function (error) {
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error.message
            });
        });
        //uncommented slunn002 04/23/2018
        /*$scope.auth.register($scope.credentials)
            // .then(
            //     function(res) {
            //         var data = res.data;
            //
            //         if(data.success) {
            //             $scope.addAlert({
            //                 style: "alert-success",
            //                 type: "Success!",
            //                 message: data.message
            //             });
            //         } else {
            //             $scope.addAlert({
            //                 style: "alert-danger",
            //                 type: "Error:",
            //                 message: data.message
            //             });
            //         }
            //
            //         return res;
            //     },
            //     function(err) {
            //         $scope.addAlert({
            //             style: "alert-danger",
            //             type: "Error:",
            //             message: "The servers are currently down."
            //         });
            //
            //         return err;
            //     }
            // );*/
    };
    //uncommented slunn002 04/23/2018
    $scope.credentials = {
        username: "",
        password: ""
    };

    $scope.login = function () {
        console.log("Attempting to login");
        $scope.auth.login($scope.credentials).then(function (success) {
            $scope.currentUser = AuthService.currentUser();
            $scope.isLoggedIn = true;
            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "You have successfully logged in!"
            });
        }, function (error) {
            $scope.currentUser = AuthService.currentUser();
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
            $scope.isLoggedIn = false;
        });
        //$window.location.href = '/';
    };

    $scope.logout = function () {
        $scope.auth.logout();
        $window.location.href = '/';
    };

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function aboutUsPopUpController($scope, $window, $uibModalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function adPolicyPopUpController($scope, $window, $uibModalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function privacyPopUpController($scope, $window, $uibModalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function copyrightPopUpController($scope, $window, $uibModalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function limitationsPopUpController($scope, $window, $uibModalInstance) {

    $scope.close = function () {
        $modalInstance.close();
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function notYetMappedController($scope, $window) {

    $scope.redirect = function (location) {
        // store in browser cache the location
        localStorageService.set("redirect-page", location);
        $window.location.reload();
    };
}
'use strict';

/**
 * Created by SpeedProxy on 3/27/2017.
 */
angular.module('app').service('AlternativesToGetYouWhereYouWantToGoService', AlternativesToGetYouWhereYouWantToGoService);
//All these data should be fetched from data base. and not be hardcoded on service. TO DO/CHANGE
function AlternativesToGetYouWhereYouWantToGoService() {

    //stores the users answers to The Good Things About Drinking Questionnaire
    var defaultAnswers = [{
        response: "Meditate",
        dragID: "drag1"
    }, {
        response: "Call a friend",
        dragID: "drag2"
    }, {
        response: "Go work out",
        dragID: "drag3"
    }, {
        response: "Go dancing",
        dragID: "drag4"
    }, {
        response: "Catch a movie",
        dragID: "drag5"
    }, {
        response: "Go out to eat",
        dragID: "drag6"
    }, {
        response: "Play video games",
        dragID: "drag7"
    }, {
        response: "Go to the mall/shopping",
        dragID: "drag8"
    }, {
        response: "Listen to/play music",
        dragID: "drag9"
    }, {
        response: "Play sports",
        dragID: "drag10"
    }, {
        response: "Attend a sporting event",
        dragID: "drag11"
    }, {
        response: "Spend time with friends",
        dragID: "drag12"
    }, {
        response: "Go on AIM/chat",
        dragID: "drag13"
    }, {
        response: "Facebook",
        dragID: "drag14"
    }, {
        response: "Act like I've been drinking",
        dragID: "drag15"
    }, {
        response: "Go for a bike ride",
        dragID: "drag16"
    }];

    //stores the users answers to What I Like About Drinking in The Good Things Revisited Survey
    //need to grab these responses from the database
    var usersAnswers = [];

    return {
        defaultAnswers: defaultAnswers,
        userAnswers: usersAnswers,
        addUsersAnswer: function addUsersAnswer(answer) {
            var addIndex = usersAnswers.length;
            usersAnswers[addIndex] = answer;
        },
        removeUsersAnswer: function removeUsersAnswer(elemIndex) {
            usersAnswers.splice(elemIndex, 1);
        },
        getUsersAnswers: function getUsersAnswers() {
            return usersAnswers;
        }

    };
}
'use strict';

angular.module('app').service('GettingWhatYouWantService', GettingWhatYouWantService);
function GettingWhatYouWantService() {

    //stores the users answers to The Good Things About Drinking Questionnaire
    var defaultAnswers = [{
        response: "To reduce my stress levels",
        dragID: "drag1"
    }, {
        response: "To adjust my attitude",
        dragID: "drag2"
    }, {
        response: "To be more sociable",
        dragID: "drag3"
    }, {
        response: "To enjoy sex more",
        dragID: "drag4"
    }, {
        response: "To be more assertive",
        dragID: "drag5"
    }, {
        response: "To get high",
        dragID: "drag6"
    }, {
        response: "To be more creative",
        dragID: "drag7"
    }, {
        response: "To be a better lover",
        dragID: "drag8"
    }, {
        response: "To be braver or more daring",
        dragID: "drag9"
    }, {
        response: "To sleep",
        dragID: "drag10"
    }, {
        response: "To forget",
        dragID: "drag11"
    }, {
        response: "To feel better",
        dragID: "drag12"
    }, {
        response: "To fight boredom",
        dragID: "drag13"
    }, {
        response: "To escape",
        dragID: "drag14"
    }, {
        response: "To be more relaxed in social situations",
        dragID: "drag15"
    }, {
        response: "To feel accepted",
        dragID: "drag16"
    }, {
        response: "To have fun",
        dragID: "drag17"
    }, {
        response: "To fit in",
        dragID: "drag18"
    }];

    //stores the users answers to What I Like About Drinking in The Good Things Revisited Survey
    //need to grab these responses from the database
    var usersAnswers = [{
        response: "To be more relaxed in social situations.",
        dragID: "drag1"
    }, {
        response: "To feel accepted.",
        dragID: "drag2"
    }, {
        response: "To have fun.",
        dragID: "drag3"
    }, {
        response: "To fit in.",
        dragID: "drag4"
    }];

    return {
        defaultAnswers: defaultAnswers,
        userAnswers: usersAnswers,
        addUsersAnswer: function addUsersAnswer(answer) {
            var addIndex = usersAnswers.length;
            usersAnswers[addIndex] = answer;
        },
        removeUsersAnswer: function removeUsersAnswer(elemIndex) {
            usersAnswers.splice(elemIndex, 1);
        },
        getUsersAnswers: function getUsersAnswers() {
            return usersAnswers;
        }

    };
}
'use strict';

angular.module('app').directive('personalBACTable', personalBACTable);

function personalBACTable() {
    return {
        template: '<div class="table-container"><table class="table"> <tr><th class="center title-header" colspan="12">Numbers of Hours You Drink</th></tr>' + '<tr><th rowspan="11" class="box-rotate vertical-title-header"><div><span>Number of Drinks You Might Have</span></div></th><th class="EMPTY"></th> <th class="1">1</th> <th class="2">2' + '</th> <th class="3">3</th> <th class="4">4</th> <th class="5">5</th> <th class="6">6</th> <th class="7">7</th> ' + '<th class="8">8</th> <th class="9">9</th> <th class="10">10</th> </tr><tr> <th >1</th><td>0.013</td>' + '<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>' + '<tr> <th>2</th><td>0.043</td><td>0.026</td><td>0.009</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0' + '</td></tr><tr> <th >3</th><td>0.073</td><td>0.056</td><td>0.039</td><td>0.022</td><td>0.005</td>' + '<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr> <th>4</th><td>0.103</td><td>0.086</td>' + '<td>0.069</td><td>0.052</td><td>0.035</td><td>0.018</td><td>0.001</td><td>0</td><td>0</td><td>0</td></tr><tr>' + ' <th >5</th><td>0.133</td><td>0.116</td><td>0.099</td><td>0.082</td><td>0.065</td><td>0.048</td><td>' + '0.031</td><td>0.014</td><td>0</td><td>0</td></tr><tr> <th >6</th><td>0.163</td><td>0.146</td>' + '<td>0.129</td><td>0.112</td><td>0.095</td><td>0.078</td><td>0.061</td><td>0.044</td><td>0.027</td><td>0.01' + '</td></tr><tr> <th >7</th><td>0.193</td><td>0.176</td><td>0.159</td><td>0.142</td><td>0.125</td>' + '<td>0.108</td><td>0.091</td><td>0.074</td><td>0.057</td><td>0.04</td></tr><tr> <th >8</th><td>' + '0.233</td><td>0.206</td><td>0.189</td><td>0.172</td><td>0.155</td><td>0.138</td><td>0.121</td><td>0.104' + '</td><td>0.087</td><td>0.007</td></tr><tr> <th >9</th><td>0.253</td><td>0.236</td><td>0.219' + '</td><td>0.202</td><td>0.185</td><td>0.168</td><td>0.151</td><td>0.134</td><td>0.117</td><td>0.1</td>' + '</tr><tr> <th >10</th><td>0.283</td><td>0.266</td><td>0.249</td><td>0.232</td><td>0.215</td>' + '<td>0.198</td><td>0.181</td><td>0.164</td><td>0.147</td><td>0.13</td></tr></table></div>'
    };
}
'use strict';

/*
 *   Counseling Controllers
 *
 *   Authors: Guido Ruiz, Daniel Rivero, Vishal Chattwani
 *
 *   Description: This is an angular controller, designed to handle all the logic related with the counseling view. The
 *   counseling view is the view where the virtual counselor lies, and where the user takes his/her interventions.
 *   Among the many functions are some that communicate with the mainframe, which is Mihai's statemachine runner, or
 *   functions that login the user into the system, retrieve their answers, save their answers, and more. There are also
 *   helper functions as well, like print and progress bar, that modify content on the page dynamically or assist in
 *   tasks such as printing.
 */

angular.module('app').controller('ratingProsConsController', ratingProsConsController);
angular.module('app').controller('TGTRevisitedController', TGTRevisitedController);
angular.module('app').controller('TNSGTRevisitedController', TNSGTRevisitedController);
angular.module('app').controller('GWYWController', GWYWController);
angular.module('app').controller('ImportanceController', ImportanceController);
angular.module('app').controller('AlternativesController', AlternativesController);
angular.module('app').controller('gamePlanController', gamePlanController);
angular.module('app').controller('bacController', bacController);
//angular.module('app').controller('otherDrugsController', otherDrugsController);

// -----------------------------------------------------------------------------------------------------------------
// injects, or dependencies, used by each controller. must follow function signature
// -----------------------------------------------------------------------------------------------------------------

TGTRevisitedController.$inject = ['$scope', 'goodThingsAboutDrinkingService'];
TNSGTRevisitedController.$inject = ['$scope', 'notSoGoodThingsAboutDrinkingService'];
ratingProsConsController.$inject = ['$scope', 'notSoGoodThingsAboutDrinkingService', 'goodThingsAboutDrinkingService'];
GWYWController.$inject = ['$scope', 'GettingWhatYouWantService'];
ImportanceController.$inject = ['$scope', 'goodThingsAboutDrinkingService', 'notSoGoodThingsAboutDrinkingService'];
AlternativesController.$inject = ['$scope', 'AlternativesToGetYouWhereYouWantToGoService', 'GettingWhatYouWantService'];
gamePlanController.$inject = ['$scope', 'notSoGoodThingsAboutDrinkingService', 'gamePlanService'];
bacController.$inject = ['$scope', 'ScoreService'];
//otherDrugsController.$inject = ['$scope', 'otherDrugsService'];
// -----------------------------------------------------------------------------------------------------------------
// CounselingController: view description above
// -----------------------------------------------------------------------------------------------------------------

//for code reusability and handling of certain surveys that contain list functionality.
function surveyHandler(scp, srv) {
    var selection;
    scp.defaultResponses = srv.defaultAnswers;
    scp.userResponses = srv.getUsersAnswers();
    scp.addItem = function () {
        var obj = {
            response: scp.newResponse
        };
        srv.addUsersAnswer(obj);
        scp.newResponse = ''; //clears input field when done.
    };
    scp.moveItemToLeftList = function () {
        var elementIndex = selection;
        if (elementIndex == null) return;
        scp.defaultResponses.push(scp.userResponses[elementIndex]);
        scp.userResponses.splice(elementIndex, 1);
        selection = null;
    };

    scp.moveItemToRightList = function () {
        var elementIndex = selection;
        if (elementIndex == null) return;
        scp.userResponses.push(scp.defaultResponses[elementIndex]);
        scp.defaultResponses.splice(elementIndex, 1);
        selection = null;
    };

    scp.setSelection = function (elementIndex) {
        selection = elementIndex;
    };

    scp.allowDrop = function (ev) {
        ev.preventDefault();
    };

    scp.drag = function (ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    };

    scp.drop = function (ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
    };
}

function TGTRevisitedController($scope, goodThingsAboutDrinkingService) {
    surveyHandler($scope, goodThingsAboutDrinkingService);

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

    $scope.saveTGTR = function () {

        var tmp = [];

        $scope.userResponses.forEach(function (e) {
            tmp.push(e.response);
        });

        var userAnswer = tmp;
        var elementId = "PBuf3sVCCj";

        Parse.Cloud.run('addResponse', { elemID: elementId, answer: userAnswer }).then(function (success) {
            $scope.Success("Your responses have been saved successfully");
        }, function (error) {
            $scope.Error("Your responses were not saved. Error: " + error);
        });
    };
}
function TNSGTRevisitedController($scope, notSoGoodThingsAboutDrinkingService) {
    surveyHandler($scope, notSoGoodThingsAboutDrinkingService);
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

    $scope.saveTNSGTR = function () {

        var tmp = [];

        $scope.userResponses.forEach(function (e) {
            tmp.push(e.response);
        });

        var userAnswer = tmp;
        var elementId = "UY59yLDhwG";

        Parse.Cloud.run('addResponse', { elemID: elementId, answer: userAnswer }).then(function (success) {
            $scope.Success("Your responses have been saved successfully");
        }, function (error) {
            $scope.Error("Your responses were not saved. Error: " + error);
        });
    };
}
//
// function otherDrugsController ($scope, otherDrugsService){
//     surveyHandler($scope, otherDrugsService);
//
//     $scope.saveOtherDrugs = function(){
//
//         var tmp = [];
//
//         $scope.userResponses.forEach(function (e) {
//             tmp.push(e.response);
//         });
//
//         var userAnswer = tmp;
//         var elementId = "UY59yLDhwG";
//
//         Parse.Cloud.run('addResponse', { elemID: elementId, answer: userAnswer });
//     }
// }


function GWYWController($scope, GettingWhatYouWantService) {
    surveyHandler($scope, GettingWhatYouWantService);
}
function AlternativesController($scope, AlternativesToGetYouWhereYouWantToGoService, GettingWhatYouWantService) {
    $scope.myDesiredEffects = GettingWhatYouWantService.getUsersAnswers(); //this line fetches the data from the GWYWService array of user answers
    surveyHandler($scope, AlternativesToGetYouWhereYouWantToGoService);

    $scope.saveAlternatives = function () {

        var tmp = [];

        $scope.userResponses.forEach(function (e) {
            tmp.push(e.response);
        });

        var userAnswer = tmp;
        var elementId = "PEOFZ3qPHR";

        Parse.Cloud.run('addResponse', { elemID: elementId, answer: userAnswer });
    };
}
function ImportanceController($scope, goodThingsAboutDrinkingService, notSoGoodThingsAboutDrinkingService, otherDrugsService) {
    $scope.goodThings = goodThingsAboutDrinkingService.getUsersAnswers();
    $scope.notGoodThings = notSoGoodThingsAboutDrinkingService.getUsersAnswers();
    $scope.otherDrugs = otherDrugsService.getUsersAnswers();
}

function ratingProsConsController($scope, notSoGoodThingsAboutDrinkingService, goodThingsAboutDrinkingService) {
    var listName;
    var elementIndex;
    $scope.userResponsesLikeAboutDrinking = goodThingsAboutDrinkingService.getUsersAnswers();
    $scope.userResponsesDontLikeAboutDrinking = notSoGoodThingsAboutDrinkingService.getUsersAnswers();
    $scope.setSelection = function (index, list) {
        listName = list;
        elementIndex = index;
    };
    $scope.shiftDown = function () {

        if (listName === 'WILAD') {
            var len = $scope.userResponsesLikeAboutDrinking.length;
            if (elementIndex < len - 1) {
                var temp = $scope.userResponsesLikeAboutDrinking[elementIndex + 1];
                $scope.userResponsesLikeAboutDrinking[elementIndex + 1] = $scope.userResponsesLikeAboutDrinking[elementIndex];
                $scope.userResponsesLikeAboutDrinking[elementIndex] = temp;
                goodThingsAboutDrinkingService.updateUsersAnswersOrder($scope.userResponsesLikeAboutDrinking);
            }
        } else if (listName === 'WIDLAD') {
            var len = $scope.userResponsesDontLikeAboutDrinking.length;
            if (elementIndex < len - 1) {
                var temp = $scope.userResponsesDontLikeAboutDrinking[elementIndex + 1];
                $scope.userResponsesDontLikeAboutDrinking[elementIndex + 1] = $scope.userResponsesDontLikeAboutDrinking[elementIndex];
                $scope.userResponsesDontLikeAboutDrinking[elementIndex] = temp;
                goodThingsAboutDrinkingService.updateUsersAnswersOrder($scope.userResponsesLikeAboutDrinking);
            }
        }
    };
    $scope.shiftUp = function () {
        if (listName === 'WILAD') {
            var len = $scope.userResponsesLikeAboutDrinking.length;
            if (elementIndex != 0) {
                var temp = $scope.userResponsesLikeAboutDrinking[elementIndex - 1];
                $scope.userResponsesLikeAboutDrinking[elementIndex - 1] = $scope.userResponsesLikeAboutDrinking[elementIndex];
                $scope.userResponsesLikeAboutDrinking[elementIndex] = temp;
                notSoGoodThingsAboutDrinkingService.updateUsersAnswersOrder($scope.userResponsesDontLikeAboutDrinking);
            }
        } else if (listName === 'WIDLAD') {
            var len = $scope.userResponsesDontLikeAboutDrinking.length;
            if (elementIndex != 0) {
                var temp = $scope.userResponsesDontLikeAboutDrinking[elementIndex - 1];
                $scope.userResponsesDontLikeAboutDrinking[elementIndex - 1] = $scope.userResponsesDontLikeAboutDrinking[elementIndex];
                $scope.userResponsesDontLikeAboutDrinking[elementIndex] = temp;
                notSoGoodThingsAboutDrinkingService.updateUsersAnswersOrder($scope.userResponsesDontLikeAboutDrinking);
            }
        }
    };
}

function gamePlanController($scope, notSoGoodThingsAboutDrinkingService, gamePlanService) {
    $scope.userResponses = gamePlanService.usersAnswers;
    $scope.notSoGoodList = notSoGoodThingsAboutDrinkingService.getUsersAnswers();

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

    $scope.elementID_GP = ["QGPgGLjWyA", "B4r2DavPKN", "EFwmDRi9mP", "Q9AJDNzBvp", "rWxrQmpzuQ", "jo4cPjzut6"];
    $scope.saveAnswer = function (index, usrRes) {
        Parse.Cloud.run('addResponse', { elemID: $scope.elementID_GP[index], answer: [usrRes] }).then(function (success) {
            $scope.Success("Your responses have been saved successfully");
        }, function (error) {
            $scope.Error("Your responses were not saved. Error: " + error);
        });
    };

    $scope.insertList = function () {
        var len = $scope.notSoGoodList.length;
        var str = "";
        //console.log(len);
        for (i = 0; i < len; i++) {
            str += $scope.notSoGoodList[i].response;
            if (len > 1 && i < len - 1) {
                str += "\n";
            }
        }
        $scope.usrResponse = str;
    };
}

function bacController($scope, ScoreService, Constants) {
    /* $scope.calculateBAC = function () {
       var TD = $scope.x;
       var TH = $scope.totalHours;
         var allTableCells = document.getElementsByTagName("td");
       for (var i = 0, max = allTableCells.length; i < max; i++) {
           var node = allTableCells[i];
           var currentText = node.childNodes[0].nodeValue;
           if (TD == 1 && TH == 1) {
               if (currentText === "0.013") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 1) {
               if (currentText === "0.043") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 1) {
               if (currentText === "0.073") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 1) {
               if (currentText === "0.103") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 1) {
               if (currentText === "0.133") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 1) {
               if (currentText === "0.163") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 1) {
               if (currentText === "0.193") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 1) {
               if (currentText === "0.233") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 1) {
               if (currentText === "0.253") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 1) {
               if (currentText === "0.283") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 2) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 2) {
               if (currentText === "0.026") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 2) {
               if (currentText === "0.056") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 2) {
               if (currentText === "0.086") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 2) {
               if (currentText === "0.116") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 2) {
               if (currentText === "0.146") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 2) {
               if (currentText === "0.176") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 2) {
               if (currentText === "0.206") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 2) {
               if (currentText === "0.236") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 2) {
               if (currentText === "0.266") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 3) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 3) {
               if (currentText === "0.009") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 3) {
               if (currentText === "0.039") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 3) {
               if (currentText === "0.069") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 3) {
               if (currentText === "0.099") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 3) {
               if (currentText === "0.129") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 3) {
               if (currentText === "0.159") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 3) {
               if (currentText === "0.189") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 3) {
               if (currentText === "0.219") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 3) {
               if (currentText === "0.249") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 4) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 4) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 4) {
               if (currentText === "0.022") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 4) {
               if (currentText === "0.052") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 4) {
               if (currentText === "0.082") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 4) {
               if (currentText === "0.112") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 4) {
               if (currentText === "0.142") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 4) {
               if (currentText === "0.172") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 4) {
               if (currentText === "0.202") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 4) {
               if (currentText === "0.232") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 5) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 5) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 5) {
               if (currentText === "0.005") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 5) {
               if (currentText === "0.035") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 5) {
               if (currentText === "0.065") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 5) {
               if (currentText === "0.095") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 5) {
               if (currentText === "0.125") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 5) {
               if (currentText === "0.155") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 5) {
               if (currentText === "0.185") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 5) {
               if (currentText === "0.215") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 6) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 6) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 6) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 6) {
               if (currentText === "0.018") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 6) {
               if (currentText === "0.048") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 6) {
               if (currentText === "0.078") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 6) {
               if (currentText === "0.108") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 6) {
               if (currentText === "0.138") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 6) {
               if (currentText === "0.168") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 6) {
               if (currentText === "0.198") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 7) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 7) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 7) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 7) {
               if (currentText === "0.001") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 7) {
               if (currentText === "0.031") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 7) {
               if (currentText === "0.061") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 7) {
               if (currentText === "0.091") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 7) {
               if (currentText === "0.121") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 7) {
               if (currentText === "0.151") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 7) {
               if (currentText === "0.181") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 8) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 8) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 8) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 8) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 8) {
               if (currentText === "0.014") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 8) {
               if (currentText === "0.044") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 8) {
               if (currentText === "0.074") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 8) {
               if (currentText === "0.104") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 8) {
               if (currentText === "0.134") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 8) {
               if (currentText === "0.164") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 9) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 9) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 9) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 9) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 9) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 9) {
               if (currentText === "0.027") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 9) {
               if (currentText === "0.057") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 9) {
               if (currentText === "0.087") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 9) {
               if (currentText === "0.117") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 9) {
               if (currentText === "0.147") node.style.backgroundColor = "yellow";
           } else if (TD == 1 && TH == 10) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 2 && TH == 10) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 3 && TH == 10) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 4 && TH == 10) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 5 && TH == 10) {
               if (currentText === "0") node.style.backgroundColor = "yellow";
           } else if (TD == 6 && TH == 10) {
               if (currentText === "0.01") node.style.backgroundColor = "yellow";
           } else if (TD == 7 && TH == 10) {
               if (currentText === "0.04") node.style.backgroundColor = "yellow";
           } else if (TD == 8 && TH == 10) {
               if (currentText === "0.007") node.style.backgroundColor = "yellow";
           } else if (TD == 9 && TH == 10) {
               if (currentText === "0.1") node.style.backgroundColor = "yellow";
           } else if (TD == 10 && TH == 10) {
               if (currentText === "0.13") node.style.backgroundColor = "yellow";
           } else {
               alert("Invalid Entry!");
               break;
           }
       }
    };
    $scope.resetValues = function (){
         $scope.totalDrinks = 0;
       $scope.totalHours = 0;
         var isOdd = function (value) {
           var num = value/10;
           num = Math.floor(num);
           return (num%2);
       };
         var allTableCells = document.getElementsByTagName("td");
         for (var i = 0, max = allTableCells.length; i < max; i++) {
             var node = allTableCells[i];
             if (node.style.backgroundColor == "yellow") {
                 if(!isOdd(i)){
                   node.style.backgroundColor = "white";
               }
               else
                   node.style.backgroundColor = "#a9dba9";
           }
       }
    };*/

    var bacTableTemplate_male = [[0, 100, 120, 140, 160, 180, 200, 220, 240], [1, .021, .015, .010, .007, .004, .002, .001, .000], [2, .058, .046, .036, .030, .024, .020, .018, .014], [3, .095, .077, .062, .053, .044, .038, .035, .029], [4, .132, .108, .088, .076, .064, .056, .052, .044], [5, .169, .139, .114, .099, .084, .074, .069, .059], [6, .206, .170, .140, .122, .104, .092, .086, .074], [7, .243, .201, .166, .145, .124, .110, .103, .089], [8, .280, .232, .192, .168, .144, .128, .120, .104], [9, .317, .263, .218, .191, .164, .146, .137, .119], [10, .354, .294, .244, .214, .184, .164, .154, .134], [11, .391, .325, .270, .237, .204, .182, .171, .149], [12, .428, .356, .296, .260, .224, .200, .188, .164]];
    var bacTableTemplate_female = [[0, 100, 120, 140, 160, 180, 200, 220, 240], [1, .029, .021, .016, .012, .009, .006, .004, .002], [2, .074, .058, .048, .040, .034, .028, .024, .020], [3, .119, .095, .080, .068, .059, .050, .044, .038], [4, .164, .132, .112, .096, .084, .072, .064, .056], [5, .209, .169, .144, .124, .109, .094, .084, .074], [6, .253, .206, .176, .152, .134, .116, .104, .092], [7, .299, .243, .208, .180, .159, .138, .124, .110], [8, .344, .280, .240, .208, .184, .160, .144, .128], [9, .389, .317, .272, .236, .209, .182, .164, .146], [10, .434, .354, .304, .264, .234, .204, .184, .164], [11, .479, .391, .336, .292, .259, .226, .204, .182], [12, .524, .428, .368, .320, .284, .248, .224, .200]];
    var bacTableTemplate = void 0;
    var genBacTable = "";
    $scope.genBacTable;

    $scope.init = function () {

        Parse.Cloud.run("calculateAllScores", {}).then(function (e) {
            var yAxisHeaderCreated = false;

            $scope.avgBAC = e.bac.score.avgBAC;
            if (e.bac.score.userStats.gender == "Male") {
                bacTableTemplate = bacTableTemplate_male;
            } else bacTableTemplate = bacTableTemplate_female;

            angular.forEach(bacTableTemplate, function (row, index) {

                row.forEach(function (value, key) {

                    if (index == 0 && key == 0) {
                        //first cell need to set up table structure
                        genBacTable += "<table>";

                        //need to add the x-axis label
                        genBacTable += "<tr ><th colspan='10' class='center'>Weight (in lbs)</th></tr>";
                    }
                    if (key == 0) {
                        //first cell in the table row need to add tr tag to indicate this
                        genBacTable += "<tr>";
                        if (!yAxisHeaderCreated) {
                            genBacTable += "<th rowspan='13'class='box-rotate vertical-title-header'><div><span>Number of Drinks You Might Have</span></div></th>";
                            yAxisHeaderCreated = true;
                        }
                    }
                    if (index == 0 || key == 0) {
                        //the row cell belongs to the heading
                        genBacTable += "<th>";
                        genBacTable += value;
                        genBacTable += "</th>";
                    } else {

                        //console.log("avgBAC: " + $scope.avgBAC);
                        //console.log("value: " + value);
                        //the row cell is not a header and is data
                        if ($scope.avgBAC == value && key == e.bac.score.bac_y && index == e.bac.score.bac_x) {
                            //if usr avg bac is equal to current value hightlight and border
                            genBacTable += "<td class='usrBAC'>";
                        } else {
                            //if usr avg bac is not greater than or equal to current value do nothing just print value
                            genBacTable += "<td>";
                        }
                        genBacTable += value;
                        genBacTable += "</td>";
                    }
                }, $scope.avgBAC);
                //out of the row need to close tr tag
                genBacTable += "</tr>";
            }, $scope.avgBAC);

            //out of for loop close table tag
            genBacTable += "</table>";

            $scope.genBacTable = genBacTable;
        });
    };
    $scope.init();
}
'use strict';

/**
 * Created by ejhen on 3/23/2017.
 */
