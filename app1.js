'use strict';

/*
 *   Authors: Guido Ruiz, Daniel Rivero
 *
 *   Description: You can add all the dependencies you need here. The process of adding a new
 *   angular dependency is to add the .js on the correct folder and importing it through the index.jade, then writing
 *   the module name on it (found usually on the site of the dependency) as a new item in the array.
 */

Parse.initialize("83fy28yfh238");
//note if running on local host user the following string for the Parse.serverURL:  http://localhost:3013/parse (note: 3013 is the port number that you are using to run eEVA)
//Parse.serverURL = 'https://virtualhealthcounseling.com/parse';
Parse.serverURL = 'http://localhost:3013/parse';

angular.module('app', ['xeditable', 'ngAnimate', 'ui.bootstrap', 'angularTreeview', 'ngclipboard', 'ui.router', 'ngCookies', 'ngMaterial', 'angular-bind-html-compile', 'chart.js', 'oc.lazyLoad', 'LocalStorageModule', 'ui.sortable', 'ngSanitize']);
'use strict';

/*
 *   Authors: Guido Ruiz, Daniel Rivero
 *
 *   Description: Below are all the routes of eEva, shared across all controllers. A route is a way of telling angular
 *   what controller / page to load when a particular URL is found on the web page. For example, localhost:3000/#/ is
 *   read by this route, and returned is the home.view.html with the controller homeController. In all the other files
 *   we've simply created the description of these controllers and web templates, but this route file is what actually
 *   puts them together, instantiates them, and gives to the user. The best way to think about this is the user visiting
 *   the home page and seeing a TV, and angular changes the chanel depending on what URL the user types (analogy of
 *   pressing buttons on a TV remote). The TV does not change, unlike older web pages, the TV (skeleton) of the site
 *   stays the same, but the content within it is swapped 'injected' with something else. This is why the web page never
 *   truly 'reloads' unlike older web pages.
 *
 *   NOTE that some routes have an extra 'htmlModules' and 'mainframeConfig'. These are used by the counseling
 *   controller because we have many different demos. We didn't want to create a separate page for each demo, instead,
 *   we let the counseling controller use these two files to know what character to load, what intervention to load,
 *   and what HTML blocks to load (camera? user button? unity or haptek? etc). You can create a custom key value pair
 *   if you need to for another controller based on the route similar to how we did it with the counseling controller.
 *
 *   You can add new routes by creating a new '.when' parameter. There is a catch '.otherwise' that handles any route
 *   in the URL not involving the ones dictated here. The routes should be self explanatory.
 */
angular.module('app').config(states);

states.$inject = ['$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider'];

function states($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    //--------------------------------------------------------------------------------------------------------------
    /* PRODUCTION ROUTES */
    //--------------------------------------------------------------------------------------------------------------
    /*  $stateProvider.state('home', {
            url: '/',
            templateUrl: 'views/home.view.html',
            controller: 'homeController'
        });
        */
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'views/welcome.view.html',
        controller: 'welcomeController'
    });
    /*
    
        $stateProvider.state('home', {
            url: '/admin',
            templateUrl: 'views/home.view.html',
            controller: 'homeController'
        });
    */

    $stateProvider.state('password', {
        url: '/account/:token',
        templateUrl: 'views/password.view.html',
        controller: 'passwordController'
    });

    $stateProvider.state('machine', {
        url: '/machine/{edit}',
        params: { edit: null },
        templateUrl: "views/machine.view.html",
        controller: "machineController"
    });

    $stateProvider.state('editor', {
        templateUrl: "views/editor.view.html",
        controller: "editorController"
    });

    $stateProvider.state('welcome', {
        url: '/counseling',
        templateUrl: 'views/welcome.view.html',
        controller: 'welcomeController'
    });

    $stateProvider.state('counseling', {
        templateUrl: 'views/counseling.view.html',
        controller: 'counselingController'
    });

    //todo:  get rid of the one following state, this is for testing the feedback module
    $stateProvider.state('testUsrFeedback', {
        templateUrl: 'views/testFeedback/feedbackTEST.view.html',
        url: '/feedbackTEST'
    });
    //end of todo


    $stateProvider.state('feedback', {
        templateUrl: 'views/testFeedback/feedbackTEST.view.html',
        controller: 'scoreController'
    });

    $stateProvider.state('feedback.intervention', {
        url: '/feedbackTEST',
        templateUrl: 'views/testFeedback/selectIntervention.feedback.html'
    });

    $stateProvider.state('feedback.form', {
        templateUrl: 'views/testFeedback/selectForm.feedback.html'
    });

    $stateProvider.state('survey', {
        templateUrl: 'views/survey/newSurvey.html',
        controller: 'newSurveyController'
    });

    $stateProvider.state('survey.intervention', {
        url: '/survey',
        templateUrl: 'views/survey/selectIntervention.html'
    });

    $stateProvider.state('survey.form', {
        templateUrl: 'views/survey/selectForm.html'
    });

    $stateProvider.state('survey.element', {
        templateUrl: 'views/survey/selectElement.html'
    });

    $stateProvider.state('survey.editElement', {
        templateUrl: 'views/survey/editElement.html'
    });

    $stateProvider.state('surveyFormTest', {
        url: '/surveyFormTest',
        templateUrl: 'views/surveyFormTest.view.html'
    });

    $stateProvider.state('notYetMapped', {
        url: '/notYetMapped',
        templateUrl: 'views/not.yet.mapped.view.html',
        controller: 'notYetMappedController'
    });

    $stateProvider.state('webgl', {
        url: '/robocanes',
        data: {
            mainframeConfig: 'mainframe/configs/eEvaConfig.xml',
            htmlModules: ['userButton', 'userMenu', 'virtualys', 'contentView', 'cameraMenu', 'cameraButton', 'pauseButton', 'resumeButton', 'backButton', 'progressBar', 'micButton', 'micSlash', 'myProgress']
            //           htmlModules: ['userButton', 'userMenu', 'elementPanel', 'virtualys', 'contentView', 'cameraMenu', 'cameraButton', 'pauseButton', 'resumeButton', 'backButton', 'progressBar' ,'micButton', 'micSlash', 'navBar', 'myProgress']
        },
        templateUrl: 'views/webgl.view.html',
        controller: 'webglController'
    });

    //--------------------------------------------------------------------------------------------------------------
    /* TESTING, DEBUGGING ROUTES */
    //--------------------------------------------------------------------------------------------------------------

    $stateProvider.state('office01', {
        url: "/demo/office/01",
        data: {
            mainframeConfig: 'mainframe/configs/dcuConfig.xml',
            htmlModules: ['userButton', 'userMenu', 'elementPanel', 'virtualys', 'contentView', 'cameraMenu', 'cameraButton', 'navbar', 'myProgress'],
            character: { // overrides user selected character
                id: "OFFICE_DEMO_01",
                img: "",
                type: "virtualys",
                name: "Office Demo 01",
                path: "unity/tests/FIU_WomanBlondHair_WithOffice_2017_02_16/"
            }
        },
        templateUrl: 'views/webgl.view.html',
        controller: 'webglController'
    });

    $urlRouterProvider.otherwise("/");

    localStorageServiceProvider.setPrefix('eEva');
}
'use strict';

angular.module('app').controller('counselingController', counselingController);

counselingController.$inject = ['$scope', '$window', '$uibModal', '$state', 'characterService'];

function counselingController($scope, $window, $uibModal, $state, characterService) {
    $scope.counselors = characterService.counselors;
    $scope.selectedCounselor = $scope.counselors[0];
    $scope.previewImgSrc = $scope.selectedCounselor.img;

    $scope.setCounselor = function (index) {
        characterService.setUsersCounselor(index);
        $scope.selectedCounselor = characterService.getUsersCounselor();
        // characterService.changeName($scope.selectedCounselor.name);

        $scope.nextHref = $scope.selectedCounselor.url;
        $scope.previewImgSrc = $scope.selectedCounselor.img;
    };
}
'use strict';

angular.module('app').controller('homeController', homeController);

homeController.$inject = ['$scope', 'AuthService', 'UserService', 'AdminService'];

function homeController($scope, AuthService, UserService, AdminService) {

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

    $scope.currentUser = AuthService.currentUser();

    $scope.mode = 'login';

    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.changeMode = function (mode) {
        return $scope.mode = mode;
    };

    $scope.login = function () {
        return AuthService.login($scope.credentials).then(function (success) {
            return $scope.currentUser = AuthService.currentUser();
        }, function (error) {
            $scope.currentUser = AuthService.currentUser();
            $scope.Error(error.message);
        });
    };

    $scope.registration = function () {
        return AuthService.registration($scope.credentials).then(function (success) {
            $scope.currentUser = AuthService.currentUser();
            $scope.mode = 'login';
        }, function (error) {
            return $scope.currentUser = AuthService.currentUser();
        });
    };

    $scope.logout = function () {
        return AuthService.logout().then(function (success) {
            return $scope.currentUser = AuthService.currentUser();
        }, function (error) {
            return $scope.currentUser = AuthService.currentUser();
        });
    };

    $scope.forgot = function () {};

    $scope.getAvailableUsers = function () {
        //set mode to addAdminUser
        $scope.mode = 'addAdminUser';
        //populate list of all active users
        //todo: do not add the users that are already administrators
        UserService.getActiveUsers().then(function (objects) {
            return $scope.activeUsers = objects;
        }, function (error) {});
    };

    $scope.selectUserForAdmin = function (userName) {
        //set the username of the user to add as administrator
        $scope.newAdmin = userName;
    };

    $scope.addUserToAdminGroup = function () {

        //user to be added to administrator role
        var userID = $scope.newAdmin;
        //run cloud code to add user to as administrator via AdminService
        AdminService.addUserToAdminGroup(userID).then(function (success) {
            return $scope.Success('User added successfully to Administrator group.');
        }, function (error) {
            return $scope.Error('Error: user was not added to Administrator group.');
        });
    };

    // function validateEmail(email) {
    //     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return re.test(email);
    // }
    //
    // $scope.forgot = function() {
    //     if(validateEmail($scope.requestEmail)) {
    //         $http.post('/auth/password/request', { email: $scope.requestEmail })
    //             .then((res) => { console.log(res); })
    //             .catch((err) => { console.log(err); });
    //     }
    // }
}
'use strict';

/*
 *   Authors: Guido Ruiz, Daniel Rivero
 *
 *   Description: Here lies all the controllers for the state machine page, in charge of creating different route maps
 *   for the virtual character (known also as interventions). The state machine page has a <node, edge> interface that
 *   makes it easy to create route maps for the virtual character, as well as allows creations of primitive element
 *   types that work with Mihai's mainframe. The mainframe is not discussed in this file.
 *
 *   There are (3) controllers at the time of this writing. The machine controller is in charge of the <node, edge>
 *   graph, with functions that add nodes, add edges, and modify the view given data (also communicates with JSPlumb).
 *   The start controller is in charge of loading a new state machine or creating a new one. The tree view controller
 *   is in charge of a tiny view on the bottom right side of the state machine page that shows a tree view structure of
 *   the elements stored in the database to easily get their IDs.
 *
 *   Good luck!
 */

angular.module('app').controller('machineController', machineController);

machineController.$inject = ['$scope', '$state', '$timeout', '$stateParams', 'StateMachineService', 'AddedService'];

function machineController($scope, $state, $timeout, $stateParams, StateMachineService, AddedService) {
    var Added = Parse.Object.extend('Added');

    $scope.manager = StateMachineService;

    $scope.alert = null; // stores any alerts to show to the user
    $scope.nameBox = "";
    $scope.expressionBox = "";
    $scope.addLoaded = false;
    $scope.dynamicPopover = {
        templateUrl: 'views/templates/confirmbox.view.html',
        nameToDelete: '',
        title: 'Warning',
        placement: 'bottom'
    };

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

    $scope.new = function () {
        var object = AddedService.prototype();

        AddedService.createAdded(object).then(function (success) {
            return $scope.manager.added.push(success);
        }, function (error) {
            return $scope.Error("Could not copy the state machine selected.");
        });
    };

    // -----------------------------------------------------------------------------------------------------------------
    // this function is called when you want to load a state graph for editing
    // -----------------------------------------------------------------------------------------------------------------

    $scope.load = function (added) {
        $state.go('machine', { edit: added.object.id });
    };

    // -----------------------------------------------------------------------------------------------------------------
    // save logic for when user clicks save on a state graph
    // -----------------------------------------------------------------------------------------------------------------

    $scope.save = function () {
        // delete states and transitions if primitive
        if ($scope.manager.sm.primitive) {
            $scope.manager.sm.init.states = [];
            $scope.manager.sm.init.transitions = [];
        } else $scope.manager.sm.execute = "";

        // upload your new state machine map to the server as a new <node>
        $scope.manager.sm.save().then(function (success) {
            $scope.Success("State machine was successfully saved into the system.");

            AddedService.getAllAdded().then(function (success) {
                return $scope.manager.added = success;
            }, function (error) {
                return $scope.Error("There was an error contacting the server. Please try again.");
            });
        }, function (error) {
            return $scope.Error("There was an error contacting the server. Please try again.");
        });
    };

    // -----------------------------------------------------------------------------------------------------------------
    // delete a state graph from the server completely
    // -----------------------------------------------------------------------------------------------------------------

    $scope.delete = function () {
        if ($scope.manager.sm) {
            $scope.manager.sm.delete().then(function (success) {
                return $state.reload();
            }, function (error) {
                return $scope.Error('Could not delete the state machine from the server.');
            });
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // copy a state graph and make a new one (a copy)
    // -----------------------------------------------------------------------------------------------------------------

    $scope.copy = function (added) {
        added.name += "_Copy";

        AddedService.createAdded(added).then(function (success) {
            return $state.go('machine', { edit: success.object.id });
        }, function (error) {
            return $scope.Error("Could not copy the state machine selected.");
        });
    };

    // -----------------------------------------------------------------------------------------------------------------
    // in charge of updating an <edge> label in the JSPlumb scene as you edit the name of the <edge> on the side panel
    // -----------------------------------------------------------------------------------------------------------------

    var initializing = true;
    $scope.$watch('expressionBox', function (newValue, oldValue) {
        if (initializing) $timeout(function () {
            return initializing = false;
        });else $scope.manager.transitionIdToObject[$scope.manager.selected.id].connection.getOverlay("label").setLabel(newValue);
    });

    // -----------------------------------------------------------------------------------------------------------------
    // fixes the size of the <edge> when the <node> changes in size due to it being renamed
    // -----------------------------------------------------------------------------------------------------------------

    $scope.updateConnection = function (node_Id) {
        return $scope.manager.instance.repaintEverything();
    };

    // -----------------------------------------------------------------------------------------------------------------
    // deletes a <node> from the state graph
    // -----------------------------------------------------------------------------------------------------------------

    $scope.removeNode = function (node) {
        return $scope.manager.removeNode(node);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // add a <node> to the state graph from the side panel inventory
    // -----------------------------------------------------------------------------------------------------------------

    $scope.addNode = function (class_id) {
        // add node to angular first
        $scope.manager.addNodeAngular(class_id);

        // add node to plumb second (the visual GUI state graph)
        $scope.$$postDigest(function () {
            // add state to jsPlumb
            var el = $scope.manager.instance.getSelector("#nodeId_" + $scope.manager.nodeId)[0];
            $scope.manager.addNodePlumb(el);
        });
    };

    // -----------------------------------------------------------------------------------------------------------------
    // remove an <edge> from the state graph
    // -----------------------------------------------------------------------------------------------------------------

    $scope.removeTransition = function (transition) {
        // remove transition from angular first
        $scope.manager.removeTransition(transition.id);
        if (transition == $scope.manager.selected) $scope.manager.selected = null;

        // remove transition from plumb second (the visual GUI state graph)
        $scope.manager.instance.detach($scope.manager.transitionIdToObject[transition.id]);
        delete $scope.manager.transitionIdToObject[transition.id];
    };

    // -----------------------------------------------------------------------------------------------------------------
    // this function starts up jsPlumb, the graphical GUI library that shows the state graph
    // -----------------------------------------------------------------------------------------------------------------

    $scope.jsPlumbInit = function () {
        console.log("Started jsPlumb");

        // settings
        $scope.manager.instance = jsPlumb.getInstance({
            Endpoint: ["Dot", {
                radius: 2
            }],
            Connector: "StateMachine",
            HoverPaintStyle: {
                strokeStyle: "#1e8151",
                lineWidth: 2
            },
            ConnectionOverlays: [["Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            }], ["Label", {
                label: "",
                id: "label",
                cssClass: "aLabel"
            }]],
            Container: "canvas"
        });

        // allow for anchor connections (means the <edge> 'hook' onto the <nodes>)
        $scope.manager.instance.registerConnectionType("basic", {
            anchor: "Continuous",
            connector: "StateMachine"
        });

        // event function called when an <edge> is formed within the state graph
        $scope.manager.instance.bind("connection", function (c) {
            var source = c.source.id;
            var target = c.target.id;

            c.connection._jsPlumb.id = "transId_" + $scope.manager.transId;

            var label = $scope.manager.lastExpression != "" ? $scope.manager.lastExpression : " ";
            c.connection.getOverlay("label").setLabel(label);
            $scope.manager.lastExpression = "";

            $scope.manager.transitionIdToObject["transId_" + $scope.manager.transId] = c;
            $scope.manager.addTransition(source, target);
            $scope.manager.incrementTID();

            $scope.$apply();
        });

        // event function called when an <edge> is clicked within the state graph
        $scope.manager.instance.bind("click", function (c) {
            var selected = c._jsPlumb.id;

            var trans = $scope.manager.sm.init.transitions.find(function (t) {
                return t.id == selected;
            });

            if (trans) $scope.$apply(function () {
                return $scope.manager.selected = trans;
            });
        });

        // the actual init function of jsPlumb
        $scope.manager.instance.batch(function () {
            // add state to jsPlumb
            var els = jsPlumb.getSelector(".statemachine-demo .w");
            var highestId = "0";

            els.forEach(function (el, i) {
                $scope.manager.addNodePlumb(el);

                var currId = parseInt($scope.manager.sm.init.states[i].id.split("_")[1]);
                highestId = Math.max(currId, highestId);
            });

            $scope.manager.nodeId = highestId;
            $scope.manager.incrementNID();

            // prevents infinite loop, as 'connect' jsPlumb calls the bind declared above
            var copy = angular.copy($scope.manager.sm.init.transitions);
            $scope.manager.sm.init.transitions = [];

            copy.forEach(function (c, i) {
                $scope.manager.lastExpression = c.guard.expression;

                $scope.manager.instance.connect({
                    source: c.from,
                    target: c.to,
                    type: "basic"
                });

                $scope.manager.sm.init.transitions[i].guard = c.guard;
            });
        });
    };

    // jsPlumb wait timer
    $scope.initWait = function () {
        if (!$scope.addLoaded) $timeout($scope.initWait, 100);else $scope.jsPlumbInit();
    };

    // starts jsPlumb when angular is ready first, uses wait timer above to do this
    jsPlumb.ready($scope.initWait);

    function init() {
        $scope.manager.reset();
        $scope.manager.editing = $stateParams.edit;

        AddedService.getAllAdded().then(function (objects) {
            $scope.manager.added = objects;

            // look for current 'editing' state machine if we're editing
            var existing = $scope.manager.added.find(function (a) {
                return a.object.id == $scope.manager.editing;
            });

            console.log("Finished loading added states");

            if (!existing) return;

            // id to param size
            var idToParamSize = {};

            $scope.manager.added.forEach(function (a) {
                idToParamSize[a.object.id] = a.init.params.length;
            });

            $scope.manager.sm = existing;

            // update any parameters changed by a previous edit
            $scope.manager.sm.init.states.forEach(function (s) {
                var oldLen = s.params.length;
                var newLen = idToParamSize[s.class];

                if (newLen > oldLen) for (var i = 0; i < newLen - oldLen; i++) {
                    s.params.push("");
                } else if (newLen < oldLen) for (var _i = 0; _i < oldLen - newLen; _i++) {
                    s.params.pop();
                } // fix any negative positions
                s.plumbleft = Math.max(0, parseInt(s.plumbleft.replace("px", ""))) + "px";
                s.plumbtop = Math.max(0, parseInt(s.plumbtop.replace("px", ""))) + "px";
            });

            $scope.addLoaded = true;
            $scope.manager.showLoad = false;
        }, function (error) {
            return $scope.Error('There was an error contacting the server. Please try again.');
        });
    }

    // initial load of empty state machine
    init();
}
'use strict';

angular.module('app').controller('newSurveyController', newSurveyController);

newSurveyController.$inject = ['$scope', '$state', 'InterventionService', 'FormService', 'ElementService'];

function newSurveyController($scope, $state, InterventionService, FormService, ElementService) {
    $scope.interventions = [];
    $scope.forms = [];
    $scope.elements = [];

    $scope.totElements = 0;

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

    // -- helper functions that refresh arrays above
    function refreshElements() {
        if (!$scope.formSelected) return;

        // code goes here...
        ElementService.getElementsByForm($scope.formSelected.object).then(function (objects) {
            $scope.elements = objects;

            //automatically reorder if deletion of an element has occurred and reordering of elements
            //have not taken place
            for (var i = 0; i < $scope.elements.length; i++) {
                if (i != $scope.elements[i].order) {
                    $scope.elements[i].order = i;
                    $scope.elements[i].save();
                }
            }

            //update the number of total elements belonging to current form (used for reording elements in
            //the editor view
            $scope.totElements = $scope.elements.length - 1;
        }, function (error) {});
    }
    function refreshForms() {
        if (!$scope.interventionSelected) return;

        FormService.getFormsByIntervention($scope.interventionSelected.object).then(function (objects) {
            return $scope.forms = objects;
        }, function (error) {});
    }
    function refreshInterventions() {
        InterventionService.getAllInterventions().then(function (objects) {
            return $scope.interventions = objects;
        }, function (error) {});
    }

    // this function is responsible for updating the order of all elements if the user has decided to change
    // the order of one of the elements
    function reorderElements(elem, prevOrder, newOrder) {
        if (prevOrder < newOrder) {
            console.log("previous is less than new");
            for (var i = prevOrder + 1; i <= newOrder; i++) {
                elem[i].order -= 1;
                elem[i].save();
            }
        } else if (prevOrder > newOrder) {
            console.log("previous is greater than new");
            for (var _i = newOrder; _i < prevOrder; _i++) {
                elem[_i].order += 1;
                elem[_i].save();
            }
        }
        return elem;
    }

    // -- select an intervention, form, or element

    $scope.interventionSelected = null;
    $scope.formSelected = null;
    $scope.elementSelected = null;
    $scope.elementPrevOrder = null;
    //$scope.workingElement = new Object();
    $scope.workingElement = {
        phrase: [],
        content: []
    };

    $scope.editorMode = {};

    $scope.selectIntervention = function (intervention) {
        $scope.interventionSelected = intervention;
        refreshForms();
        $state.go('survey.form');
    };
    $scope.selectForm = function (form) {
        $scope.formSelected = form;
        refreshElements();
        $state.go('survey.element');
    };
    $scope.selectElement = function (element) {
        // code goes here...
        console.log("EditorMode!");
        $scope.workingElement = {
            phrase: [],
            content: []
        };

        $scope.elementSelected = element;

        console.log(element);

        $scope.elementSelected.phrase.forEach(function (p, index) {
            // console.log(index);
            $scope.workingElement.phrase.push({
                text: p
            });
        });
        $scope.elementSelected.content.forEach(function (c, index) {
            $scope.workingElement.content.push({
                text: c
            });
        });

        $scope.elementPrevOrder = element.order;

        var elType = $scope.elementSelected.type;
        console.log(elType);
        //the following switch case statement determines the fields that are needed to be displayed
        //in the element editor view based on the type of element that is currently selected
        switch (elType) {
            case "QuestionAnswer":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = true;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = true;
                break;
            case "QuestionAnswer-Checkbox":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = true;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = true;
                break;
            case "textArea":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = false;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = true;
                break;
            case "feedback":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = false;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = false;
                break;
            case "feedbackList":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = true;
                $scope.editorMode.content = false;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = false;
                break;
            case "Content":
                $scope.editorMode.phrase = false;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = false;
                $scope.editorMode.html = true;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = false;
                break;
            case "TabularInput":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = false;
                $scope.editorMode.html = false;
                $scope.editorMode.table = true;
                $scope.editorMode.moreOptions = true;
                break;
            case "MenuElement":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = true;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = false;
                break;
            case "RangeSliderElement":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = true;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = true;
                break;
            case "LoginRegisterElement":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = false;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = false;
                break;
            case "MenuWithCompletion":
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = false;
                $scope.editorMode.content = true;
                $scope.editorMode.html = false;
                $scope.editorMode.table = false;
                $scope.editorMode.moreOptions = false;
                break;
            default:
                $scope.editorMode.phrase = true;
                $scope.editorMode.morePhrases = true;
                $scope.editorMode.content = true;
                $scope.editorMode.html = true;
                $scope.editorMode.table = true;
                $scope.editorMode.moreOptions = true;
        }
        $state.go('survey.editElement');
    };

    // -- create objects in the server
    $scope.newIntervention = {};
    $scope.newForm = {};
    $scope.newElement = {};
    $scope.numRows = -1;
    $scope.numCols = -1;
    $scope.xHeaders = false;
    $scope.yHeaders = false;

    $scope.createIntervention = function () {
        if ($scope.newIntervention.name) {
            InterventionService.createIntervention($scope.newIntervention).then(function (objects) {
                return refreshInterventions();
            }, function (error) {});
            $scope.Success("New intervention has been created successfully, and is now at the bottom of the intervention list.");
        } else {
            $scope.Error("To create a new intervention you must first provide the name of the intervention to be created.");
        }
    };
    $scope.createForm = function () {
        if ($scope.newForm.name) {
            FormService.createForm($scope.newForm, $scope.interventionSelected.object).then(function (objects) {
                return refreshForms();
            }, function (error) {});
            $scope.Success("New form has been created successfully, and is now at the bottom of the form list.");
        } else {
            $scope.Error("To create a new form you must first provide the name of the form to be created.");
        }
    };
    $scope.createElement = function (elementType) {
        // code goes here...
        $scope.newElement.type = elementType;
        $scope.newElement.order = $scope.elements.length;

        ElementService.createElement($scope.newElement, $scope.formSelected.object).then(function (objects) {
            return refreshElements();
        }, function (error) {});

        var msg = 'The ' + elementType + ' element has been added to the ' + $scope.formSelected.name + ' form successfully, and can be viewed at the bottom of the list of available elements.';
        $scope.Success(msg);
    };

    /* --- following code is specific to creating a table that will allow user to input data ---  */
    $scope.createTabularInputElement = function (rows, cols, xHead, yHead) {

        //set the type of element and the order in which the element displays
        $scope.newElement.type = "TabularInput";
        $scope.newElement.order = $scope.elements.length;

        /*following is a temp array that is used to build the structure of the table. The
        //table structure is an an array of objects and is explained below
        //  [
        //    {
        //        row: is an integer that represents index of the row
        //        content: is an array of objects that holds the content of the table
        //    },
        //    {
        //      ...
        //    },
        //    ....
        //  ]
        //The content object defined below:
        //  [
        //      { value: a string that is to be the label of the row or col, if not a label this is blank for user input
        //        isHeader:  a boolean that is true if the value represents a header false if left for user input
        //      },
        //    {
        //      ...
        //    },
        //    ....
        //  ]
        //
        */
        var structure = new Array();
        var header = false;
        //build table based on the number of rows and cols the user has indicated in the prompt in the survey editor
        //start by traversing the rows
        for (var i = 0; i < rows; i++) {
            //build the content array for table structure
            var content = new Array();
            //traverse the columns within that row
            for (var j = 0; j < cols; j++) {
                //Check if the current position is a header or not, indicated by the user via survey editor
                if (xHead && i == 0 || yHead && j == 0) {
                    header = true;
                }
                content[j] = {
                    value: "empty",
                    isHeader: header
                };
                header = false;
            }
            //push this row to the structure
            structure.push({
                row: i,
                content: content
            });
        }
        //set the content attribute of the element to the newly build table structure
        $scope.newElement.content = structure;

        //use the element service to add this new element to the dataBase
        ElementService.createElement($scope.newElement, $scope.formSelected.object).then(function (objects) {
            return refreshElements();
        }, function (error) {});

        var msg = 'The ${$scope.newElement.type} element has been added to the ${$scope.formSelected.name} form successfully, and can be viewed at the bottom of the list of available elements.';
        $scope.Success(msg);
    };

