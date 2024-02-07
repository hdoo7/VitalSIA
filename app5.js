    };

    $scope.privacyOpen = function () {
        //console.log('opening privacy pop up');
        var modalInstance = $uibModal.open({
            templateUrl: 'views/partials/popup/privacy.popup.view.html',
            windowClass: 'center-privacy-popup',
            controller: 'privacyPopUpController',
            scope: $scope
        });
    };

    $scope.aboutUsOpen = function () {
        //console.log('opening aboutUs pop up');
        var modalInstance = $uibModal.open({
            templateUrl: 'views/partials/popup/aboutUs.popup.view.html',
            windowClass: 'center-aboutUs-popup',
            controller: 'aboutUsPopUpController',
            scope: $scope
        });
    };

    $scope.adPolicyOpen = function () {
        //console.log('opening adPolicy pop up');
        var modalInstance = $uibModal.open({
            templateUrl: 'views/partials/popup/adPolicy.popup.view.html',
            windowClass: 'center-adPolicy-popup',
            controller: 'adPolicyPopUpController',
            scope: $scope
        });
    };

    $scope.copyrightOpen = function () {
        //console.log('opening copyright pop up');
        var modalInstance = $uibModal.open({
            templateUrl: 'views/partials/popup/copyright.popup.view.html',
            windowClass: 'center-copyright-popup',
            controller: 'copyrightPopUpController',
            scope: $scope
        });
    };

    $scope.limitationsOpen = function () {
        //console.log('opening limitations pop up');
        var modalInstance = $uibModal.open({
            templateUrl: 'views/partials/popup/limitations.popup.view.html',
            windowClass: 'center-limitations-popup',
            controller: 'limitationsPopUpController',
            scope: $scope
        });
    };

    $scope.close = function () {
        $uibModal.close({});
    };

    $scope.hideLogin = function () {
        if ($scope.showLogin) {
            $scope.showLogin = false;
        } else {
            $scope.showLogin = true;
        }
    };

    $scope.labels = [['2006', '2007', '2008', '2009', '2010', '2011', '2012'], [], []];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [[65, 59, 80, 81, 56, 55, 40], [28, 48, 40, 19, 86, 27, 90]];

    $scope.bacTableResponse = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
    $scope.handlePersonalBACTable = function () {

        $scope.next();

        /* console.log('handlePersonalBACTable');
         console.log(elemID);
           console.log($scope.bacTableResponse);*/

        Parse.Cloud.run('addResponse', { elemID: elemID, answer: bacTableResponse });
    };

    $scope.surveyCompleted = function (formName) {
        switch (formName) {
            case "The screening questionnaire you took before registering":
                if ($scope.currentUserProgress.attributes.audit[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "How much and how often you drink":
                if ($scope.currentUserProgress.attributes.howMuchHowOften[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "What you like and don't like about drinking":
                if ($scope.currentUserProgress.attributes.GTNSGT[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "Age you started drinking and family history of problems":
                if ($scope.currentUserProgress.attributes.familyHistory[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "How much you drink":
                if ($scope.currentUserProgress.attributes.myDrinking[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "Other drug use":
                if ($scope.currentUserProgress.attributes.otherDrugs[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "Alcohol-related problems":
                if ($scope.currentUserProgress.attributes.ARP[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "A screening for depressed mood":
                if ($scope.currentUserProgress.attributes.depression[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "Chances of success with moderate drinking":
                if ($scope.currentUserProgress.attributes.MAST[0].timestamp) {
                    return true;
                } else return false;
                break;
            case "How much you've come to depend on drinking":
                if ($scope.currentUserProgress.attributes.dependence[0].timestamp) {
                    return true;
                } else return false;
                break;
            default:
                return false;
        }
    };

    $scope.myDrinks = {
        beer: [],
        wine: [],
        liquor: [],
        hours: []
    };

    $scope.saveMDRes = function () {
        var ans = [];
        ans[0] = $scope.myDrinks;
        Parse.Cloud.run('addResponse', { elemID: "wPFh7S9lhn", answer: ans }).then(function (success) {
            $scope.Success("Your responses have been saved successfully");
        }, function (error) {
            $scope.Error("Your responses were not saved. Error: " + error);
        });
    };

    $scope.peakDrink = {
        beer: [],
        wine: [],
        liquor: [],
        hours: []
    };

    $scope.savePeakRes = function () {
        var ans = [];
        ans[0] = $scope.peakDrink;
        Parse.Cloud.run('addResponse', { elemID: "f8B0ihkAKr", answer: ans }).then(function (success) {
            $scope.Success("Your responses have been saved successfully");
        }, function (error) {
            $scope.Error("Your responses were not saved. Error: " + error);
        });
    };

    $scope.testRegistration = function () {

        for (var i = 0; i < $scope.raceType.length; i++) {
            if ($scope.raceType[i].checked) {
                $scope.credentials.race.push($scope.raceType[i].name);
            }
        }

        $scope.credentials.maritalstatus = $scope.selectedMaritalStatus;
        $scope.credentials.education = $scope.selectedEducation;

        //console.log(typeof $scope.selectedEthnicity);
        $scope.credentials.ethnicity = $scope.selectedEthnicity;
        //console.log(typeof $scope.credentials.dateOfBirth);
        //console.log($scope.credentials.dateOfBirth);
        $scope.credentials.gender = $scope.selectedGender;

        var userAge = parseInt($scope.getAge());
        var userHeight = Number($scope.getHeight());
        $scope.credentials.age = userAge;
        $scope.register();
    };

    init();

    // $scope.registerOpen = function () {
    //     console.log('opening register pop up');
    //     var modalInstance = $uibModal.open({
    //         templateUrl: 'views/partials/popup/register.popup.view.html',
    //         controller: 'registerPopUpController',
    //         windowClass: 'center-register-popup',
    //         scope: $scope
    //     });
    // };

    /*$scope.goBackButton = function(){
     $scope.$root.userResponse = -99;
     $scope.next();
     };*/

    /*$scope.loginActivation = function(){
     var modalInstance = $uibModal.open({
     templateUrl: 'views/parti als/popup/loginNEW.popup.view.html',
     windowClass: 'center-loginNEW-popup',
     scope: $scope
     });
     };*/

    $scope.deactivateLoginPopup = function () {
        $scope.mode.loggingIn = false;
        $scope.mode.register = false;
        $scope.mode.loggingOut = false;
        $scope.mode.forgotPW = false;
        // $scope.mode.forgotUN = false;
        $scope.mode.loginActivated = false;
        $scope.mode.updatePW = false;
    };

    $scope.loginActivation = function () {
        $scope.mode.loggingIn = false;
        $scope.mode.register = false;
        $scope.mode.loggingOut = false;
        $scope.mode.forgotPW = false;
        // $scope.mode.forgotUN = false;
        $scope.mode.loginActivated = true;
        $scope.mode.optionsActivated = true;
        $scope.mode.updatePW = false;
    };

    $scope.loginLoad = function () {
        $scope.mode.loggingIn = true;
        $scope.mode.register = false;
        $scope.mode.loggingOut = false;
        $scope.mode.forgotPW = false;
        // $scope.mode.forgotUN = false;
        $scope.mode.optionsActivated = false;
        $scope.mode.updatePW = false;
    };

    $scope.registrationLoad = function () {
        $scope.mode.loggingIn = false;
        $scope.mode.register = true;
        $scope.mode.loggingOut = false;
        $scope.mode.forgotPW = false;
        // $scope.mode.forgotUN = false;
        $scope.mode.optionsActivated = false;
        $scope.mode.updatePW = false;
    };

    $scope.forgotPWLoad = function () {
        $scope.mode.loggingIn = false;
        $scope.mode.register = false;
        $scope.mode.loggingOut = false;
        $scope.mode.forgotPW = true;
        // $scope.mode.forgotUN = false;
        $scope.mode.updatePW = false;
    };

    $scope.updatePWLoad = function () {
        $scope.mode.loggingIn = false;
        $scope.mode.register = false;
        $scope.mode.loggingOut = false;
        $scope.mode.forgotPW = false;
        // $scope.mode.forgotUN = false;
        $scope.mode.updatePW = true;
    };

    // $scope.forgotUNLoad = function(){
    //     $scope.mode.loggingIn = false;
    //     $scope.mode.register = false;
    //     $scope.mode.loggingOut = false;
    //     $scope.mode.forgotPW = false;
    //     $scope.mode.forgotUN = true;
    // };

    $scope.fpUser = {};

    //function that helps validate email
    function checkEmail(email) {
        //find user by email
        var atpos = email.indexOf("@");
        var dotpos = email.lastIndexOf(".");

        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
            window.alert("Failed in the forgot pw before email");
            return false;
        }
        return true;
    }

    //new function reset user's password
    $scope.forgotPassword = function () {
        console.log("going to see if email in db");
        var emailIsValid = checkEmail($scope.credentials.fp_email);

        if (!emailIsValid) {
            window.alert("Not a valid e-mail address");
            return false;
        }

        $scope.usrSrvc.validateUserbyEmail($scope.credentials.fp_email).then(function (success) {
            Parse.User.requestPasswordReset($scope.credentials.fp_email, {
                success: function success() {
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
                        "isTempUser": true
                    };
                    window.alert("Password reset link has been sent to " + $scope.credentials.fp_email);
                    return true;
                },
                error: function error(_error) {
                    window.alert(_error.message);
                    return false;
                }
            });
        }, function (error) {
            return false;
        });
    };

    //function to reset user's PW
    $scope.resetPW = function () {
        //console.log("Going into reset PW function");
        var userEmail = $scope.credentials.fp_email;
        var userDOB = $scope.credentials.fp_DOB;
        /*        // if ((userEmail==$scope.credentials.email) && (userDOB==$scope.credentials.dateOfBirth))
                // {
                //     $scope.addAlert({
                //         style: "alert-success",
                //         type: "Success!",
                //         message: "Email and Date of Birth match"
                //     });
                //     console.log("Credentials match!!!");
                //     $scope.mode.loggingIn = false;
                //     $scope.mode.register = false;
                //     $scope.mode.loggingOut = false;
                //     $scope.mode.forgotPW = false;
                //     // $scope.mode.forgotUN = false;
                //     $scope.updatePW = true;
                //     $scope.mode.loginActivated = false;
                //     $scope.mode.isLoggedIn = false;
                //
                // }
                // else
                // {
                //     $scope.addAlert({
                //         style: "alert-danger",
                //         type: "Error:",
                //         message: error
                //     });
                //     console.log("Sorry, credentials do NOT match!");
                // }*/
        /*$scope.usrSrvc.updatePW(userEmail, userDOB).then(
            foundUser =>{
                $scope.fpUser = foundUser;
                /!*console.log("User was found in usrSrv.updatePW");
                console.log(foundUser);*!/
                $scope.updatePWLoad();
            },
            error => console.log("User not found.  Error: " + error)
        );*/
    };

    $scope.changePW = function () {
        if ($scope.credentials.password === $scope.credentials.confirmpassword) {
            /* console.log("in Change PW webgl................");
             console.log($scope.fpUser);*/
            Parse.Cloud.run('updatePW', { updateUsr: $scope.fpUser.id, newPW: $scope.credentials.password }).then(function (success) {
                return console.log(success);
            }, function (error) {
                return console.log(error);
            });

            /*$scope.usrSrvc.changePW($scope.credentials.password, $scope.fpUser).then(
                success => {
                    console.log("Success in changePW");
                    $scope.loginLoad();
                },
                error =>  {
                    console.log({
                        style: "alert-danger",
                        type: "Error:",
                        message: "Problem: " + error
                    });
                }
            );*/
        } else {
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: "Sorry! Passwords do not match! Please try again."
            });
        }
    };

    $scope.educationType = ['Some high school', 'High school graduate or equivalent', 'Trade or Vocational degree', 'Some college', 'Associate degree', 'Bachelor\'s degree', 'Graduate or professional degree'];

    $scope.selectedEducation = "";

    $scope.genderType = ['Male', 'Female', 'Other'];
    $scope.selectedGender = "";

    $scope.ethnicityType = ['Hispanic or Latino', 'Not Hispanic or Latino'];

    $scope.selectedEthnicity = "";

    /*$scope.raceType = [
     'American Indian or Alaska Native',
     'Asian',
     'Black or African Descent',
     'Native Hawaiian or Other Pacific Islander',
     'White'
     ];*/
    $scope.raceType = [{
        "name": "American Indian or Alaska Native",
        "checked": false
    }, {
        "name": "Asian",
        "checked": false
    }, {
        "name": "Black or African Descent",
        "checked": false
    }, {
        "name": "Native Hawaiian or Other Pacific Islander",
        "checked": false
    }, {
        "name": "White",
        "checked": false
    }];

    $scope.selectedRace = [];

    $scope.maritalType = ['Single, Not Married', 'Married', 'Living with partner', 'Separated', 'Divorced', 'Widowed', 'Prefer not to answer'];
    $scope.selectedMaritalStatus = "";

    $scope.selectedAnwser = "";

    $scope.changeEthnicity = function (val) {
        $scope.selectedEthnicity = val;
    };

    $scope.changeGender = function (val) {
        $scope.selectedGender = val;
    };

    $scope.changeMaritalStatus = function (val) {
        $scope.selectedMaritalStatus = val;
    };

    $scope.changeEducation = function (val) {
        $scope.selectedEducation = val;
    };

    //function for generating age from birthday
    $scope.getAge = function () {
        var birthday = $scope.credentials.dateOfBirth;
        var today = new Date();
        var age = (today - birthday) / 31557600000;
        age = Math.floor(age);
        return age;
    };

    //function for generating height from feet and inches entered
    $scope.getHeight = function () {
        var height_ft = $scope.credentials.height.feet;
        height_ft = Number(height_ft);
        var height_in = $scope.credentials.height.inches;
        height_in = Number(height_in);
        $scope.credentials.height.total = height_ft * 12 + height_in;
    };
}
'use strict';

angular.module('app').controller('welcomeController', welcomeController);

welcomeController.$inject = ['$scope', '$window', '$uibModal', '$state', 'localStorageService', 'AuthService', '$timeout', 'ProgressService', 'UserService'];

function welcomeController($scope, $window, $uibModal, $state, localStorageService, AuthService, $timeout, ProgressService, UserService) {
    $scope.usrSrvc = UserService;

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
        }]
    };
    $scope.currentUser = Parse.User.current();
    $scope.tempUser = false;
    $scope.alerts = [];
    var DEFAULTCREDENTIALS = {
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
        tempUser: false
    };

    $scope.credentials = DEFAULTCREDENTIALS;
    $scope.progressSrv = ProgressService;
    $scope.newUserProgress = NEW_USER_PROGRESS;
    $scope.currentUserProgress = {};

    //helper function for generating random strings
    function genString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }return text;
    };

    //helper function for generating age from birthday
    $scope.getTempAge = function () {
        var birthday = $scope.credentials.dateOfBirth;
        var today = new Date();
        var age = (today - birthday) / 31557600000;
        var age = Math.floor(age);
        return age;
    };

    $scope.tempUserStatus = function () {
        //allow user to log in if logged in as temp or not logged in at all

        if (!$scope.currentUser.object.attributes.tempUser && $scope.currentUser != null) {
            //the user logged in is not a temp  User => let user log out
            return false;
        } else {
            return true;
        }
    };

    $scope.createTempAccount = function () {

        //ehenl001 16 July 2018
        //flag this account is temp user account
        $scope.credentials.tempUser = true;
        $scope.tempUser = $scope.credentials.tempUser;

        //create temp string as id
        $scope.credentials.username = genString();

        //create temp string as password
        $scope.credentials.password = genString();

        //give the temp user the fName guest
        $scope.credentials.firstname = "Guest";

        //give bogus email for temp user
        $scope.credentials.email = $scope.credentials.username + "@g.c";

        //create temp education
        $scope.credentials.education = "Some college";

        //create temp gender
        $scope.credentials.gender = "Male";

        //create temp DOB using angular ng date format (yyyy-MM-dd)
        $scope.credentials.dateOfBirth = new Date();

        //generate age function for temp user
        $scope.credentials.age = 25;

        //create weight for temp user
        $scope.credentials.weight = "120";

        //create height for temp user
        $scope.credentials.height.total = 22;

        //create ethnicity for temp user
        $scope.credentials.ethnicity = "Hispanic or Latino";

        //create race for temp user
        $scope.credentials.race = ["Asian"];

        //create marital status for temp user
        $scope.credentials.maritalstatus = "Divorced";

        //create temp user in the database via Auth srvc registration function
        AuthService.register($scope.credentials).then(function (success) {
            $scope.currentUser = AuthService.currentUser();
            $scope.userGivenName = $scope.currentUser.object.attributes.firstName;
            $scope.credentials.username = "";
            $scope.credentials.password = "";

            //create new progress object for the new user and set it to the currentUserProgress
            $scope.createNewProgressObject($scope.currentUser.object);
        }, function (error) {
            $scope.currentUser = AuthService.currentUser();
            console.log(error);
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
        });
    };

    $scope.createNewProgressObject = function (userObj) {

        /*console.log("the user object___________:");
        console.log(userObj);*/
        $scope.progressSrv.createProgress(userObj, $scope.newUserProgress).then(function (progress) {
            $scope.currentUserProgress = progress;
            //console.log($scope.currentUserProgress);
        }, function (error) {
            console.log("unsuccessful adding new progress");
        });
    };

    function init() {

        AuthService.logout().then(function (success) {
            $scope.currentUser = AuthService.currentUser();

            // get from cache the variable
            var variable = localStorageService.get("redirect-page");
            localStorageService.remove("redirect-page");

            switch (variable) {
                case "home":
                    $state.go('home');
                    break;
                default:
                    break; //do nothing
            }

            //$scope.tempUser = AuthService.getTempUserStatus();

            //check if current user logged in
            if (AuthService.currentUser()) {
                $scope.currentUser = AuthService.currentUser();
                $scope.userGivenName = $scope.currentUser.object.attributes.firstName;
                if (AuthService.currentUser().object.attributes.tempUser) {

                    /* console.log("user is a temp!");
                     console.log($scope.currentUser.object.attributes.username);
                     console.log($scope.currentUser.object.attributes.tempUser);
                    */
                    $scope.createTempAccount();
                }
            } else {
                $scope.createTempAccount();
            }
        }, function (error) {
            return $scope.currentUser = AuthService.currentUser();
        });
    }

    init();

    $scope.addAlert = function (alert) {
        $scope.alerts.push(alert);
        $timeout(function () {
            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
        }, 2500);
    };

    //for logging in
    $scope.login = function () {
        return AuthService.login($scope.credentials).then(function (success) {
            $scope.currentUser = AuthService.currentUser();

            $scope.userGivenName = success.attributes.firstname;
            $scope.tempUser = success.attributes.tempUser;
            /*  console.log("logging in from welcome.js");
              console.log($scope.tempUser);*/

            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "You have successfully logged in!"
            });

            $('#loginModal').modal('hide');

            //$state.go('counseling');
        }, function (error) {
            $scope.currentUser = AuthService.currentUser();
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
        });
    };

    //for logging out
    $scope.logout = function () {
        return AuthService.logout().then(function (success) {
            $scope.currentUser = AuthService.currentUser();
            $scope.userGivenName = "";
            $scope.tempUser = false;

            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "You have successfully logged out."
            });
            //$state.go('/');
        }, function (error) {
            $scope.currentUser = AuthService.currentUser();
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
            $scope.isLoggedIn = true;
        });
    };

    //function that helps validate email
    function checkEmail(email) {
        //find user by email
        var atpos = email.indexOf("@");
        var dotpos = email.lastIndexOf(".");

        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
            window.alert("Failed in the forgot pw before email");
            return false;
        }
        return true;
    }

    //new function reset user's password
    $scope.forgotPassword = function () {
        //console.log("going to see if email in db");
        var emailIsValid = checkEmail($scope.credentials.fp_email);

        if (!emailIsValid) {
            window.alert("Not a valid e-mail address");
            return false;
        }

        $scope.usrSrvc.validateUserbyEmail($scope.credentials.fp_email).then(function (success) {
            Parse.User.requestPasswordReset($scope.credentials.fp_email, {
                success: function success() {
                    window.alert("Password reset link has been sent to " + $scope.credentials.fp_email);
                    return true;
                },
                error: function error(_error) {
                    window.alert(_error.message);
                    return false;
                }
            });
        }, function (error) {
            return false;
        });
    };

    $scope.openLogin = function () {
        //console.log('opening log in pop up');
        var modalInstance = $uibModal.open({
            templateUrl: 'views/partials/popup/login.popup.view.html',
            controller: 'loginPopUpController',
            windowClass: 'center-login-popup',
            scope: $scope
        });
    };

    $scope.openAbout = function () {
        //console.log('opening About pop up');
        var modalInstance = $uibModal.open({
            templateUrl: 'views/partials/popup/aboutUs.popup.view.html',
            windowClass: 'center-aboutUs-popup',
            controller: 'aboutUsPopUpController',
            scope: $scope
        });
    };

    $scope.redirect = function (location) {
        // store in browser cache the location
        localStorageService.set("redirect-page", location);
        $window.location.reload();
    };
}
'use strict';

/*
 *   Authors: Guido Ruiz, Daniel Rivero
 *
 *   Description: A directive is a custom HTML tag, similar to <html>, <body>, <a>, etc, with angular, you can create
 *   your own custom HTML tag that when read puts within a controller, actual HTML, the works. For example, instead of
 *   copying the controller for the navigation bar across all pages, we simply use the tag <navadmin></navadmin>, which
 *   in turn will inject within it the template and the adminNavController, in charge of that particular section. In
 *   other words, a directive is a packaged controller and html template that can be written as a tag anywhere.
 */

angular.module('app').directive('navadmin', adminNavDirective);

function adminNavDirective() {
    return {
        restrict: 'EA',
        templateUrl: 'views/templates/navadmin.view.html',
        controller: 'adminNavController'
    };
}

angular.module('app').controller('adminNavController', adminNavController);

adminNavController.$inject = ['$scope', '$window'];

function adminNavController($scope, $window) {
    $scope.auth = AuthService;

    console.log($scope.auth.currentUser);

    $scope.logout = function () {
        Parse.User.logOut().then(function (success) {
            console.log(success);
            $scope.currentUser = null;
            $scope.$apply();
        }, function (error) {
            ErrorService.handleParseError(error);
            $scope.$apply();
        });
    };
}
'use strict';

/*
 *   State Machine Filters
 *
 *   Authors: Guido Ruiz
 *
 *   Description: Think of filters as helper functions that format data. Imagine you store a timestamp on the server,
 *   say 201507081456, which is really hard to read. A formatter can convert that into many different formats, say,
 *   07/08/2015 14:56. In the state machine we only use one filter that converts an id of a class to its respective
 *   name. For example, id of 0 to State_Empty to use for the start and end states. Below is the function that does this
 */

angular.module('app').filter('friendlyClass', friendlyClass);

friendlyClass.$inject = ['StateMachineService'];

function friendlyClass(StateMachineService) {
    var manager = StateMachineService;

    return function (x) {
        var res = manager.getClassById(x);

        if (res) return res.name;else return null;
    };
}
'use strict';

angular.module('app').filter('parseFilter', parseFilter);

parseFilter.$inject = [];

function parseFilter() {
    return function (x) {
        var y = angular.copy(x);
        delete y.object;
        return y;
    };
}
'use strict';

/*
 *   State Machine Runs
 *
 *   Authors: Guido Ruiz
 *
 *   Description: Runs are configurations that are taken in by module dependencies. We have x-editable, which is an
 *   angular addon module that allows to edit text on the spot. We use this for the state graph details section where
 *   you can add a name, description, code to run before, after, etc. This x-editable module can take settings before
 *   it loads, which happens in the 'editableOptions' inject as seen below.
 */

angular.module('app').run(xeditSettings);

xeditSettings.$inject = ['editableOptions'];

function xeditSettings(editableOptions) {
  editableOptions.theme = 'bs3';
}
'use strict';

angular.module('app').service('characterService', characterService);

characterService.$inject = [];

function characterService() {
    var counselors = [{
        id: "001_FEMALE_CAU",
        name: "Amy",
        //description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque felis ex, cursus a " + "turpis ac, laoreet sollicitudin ipsum. Cras hendrerit eget elit ut pretium. Proin vel diam consectetur, " + "pharetra magna et, placerat tellus. Donec dignissim tempus dolor, ac interdum dui sagittis in. In maximus " + "diam sed lacus mollis maximus. Nunc gravida varius lorem vitae bibendum. Nunc sit amet mattis ipsum, eu " + "pellentesque ex. Cras porta condimentum neque, nec mattis eros suscipit eu. Curabitur ac elementum sem. ",
        img: "unity/img/001_FEMALE_CAU.PNG",
        type: "virtualys",
        // path: "unity/sources/001_FEMALE_CAU_2017_11_22/",
        path: "unity/sources/001_FEMALE_CAU_2019_05_06/",
        scene: "scene_001_FEMALE_CAU",
        voiceIndex: 5
    }];

    var selectedCounselor = counselors[0];
    var foundCounselor = false;

    var setUsersCounselor = function setUsersCounselor(index) {
        /*for(var i = 0; i < counselors.length; i++){
            if(charID == counselors[i].id){
                selectedCounselor = counselors[i];
                foundCounselor = true;
                // changeName(counselors[i].name);
                return 0;
