            }
        }
        if(!foundCounselor){
            selectedCounselor = counselors[0];
            return 1;
        }*/

        selectedCounselor = counselors[index];
        return 0;
    };

    var getUsersCounselor = function getUsersCounselor() {
        if (selectedCounselor != null) {
            return selectedCounselor;
        } else {
            return counselors[0];
        }
    };

    return {
        counselors: counselors,
        setUsersCounselor: setUsersCounselor,
        getUsersCounselor: getUsersCounselor
    };
}
'use strict';

angular.module('app').service('ctService', ctService);

ctService.$inject = [];

function ctService() {
    var obj = {
        editor: null,
        elementID: null,

        stopEditing: function stopEditing() {
            console.log("Stopped editing");
            if (this.editor.isEditing()) this.editor.stop(this.save);
        },
        startEditing: function startEditing() {
            console.log("Started editing");
            //this.init('*[data-editable]', 'data-name', null, false);
            if (!this.editor.isEditing()) this.editor.start();
        },
        save: function save() {
            this.showAlert(true);
            return angular.element(this.elementID)[0].innerHTML;
        },
        initHTML: function initHTML(defaultHTML) {
            angular.element(this.elementID)[0].innerHTML = defaultHTML;
        },
        showAlert: function showAlert(success) {
            if (success) {
                console.log("Saved");
                new ContentTools.FlashUI('ok');
            } else {
                console.log("Not Saved");
                new ContentTools.FlashUI('no');
            }
        },
        init: function init(query, naming, fixture, ignition, elementID) {
            ContentTools.StylePalette.add([new ContentTools.Style('Author', 'author', ['p'])]);

            this.editor = ContentTools.EditorApp.get();
            this.editor.init(query, naming, fixture, ignition);
            this.elementID = elementID;
        }
    };

    return obj;
}
'use strict';

angular.module('app').service('GWYWService', GWYWService);

GWYWService.$inject = [];

function GWYWService() {

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
    var usersAnswers = [];

    return {
        defaultAnswers: defaultAnswers,
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

/*
 *  State Machine Services
 *
 *  Authors: Guido Ruiz
 *
 *  Description: This service is a self contained resource that has the actual <nodes> and <edges>, their names, ids,
 *  and logic as well as code and comments. This service has a series of classes that are called by the machine
 *  controller to add a new node, remove a node, add a transition, remove transition, reset a node, change the x,y
 *  position of a node, keeps what node is selected, etc. All this logic is self sustained here as a service, which
 *  means the machine controller is essentially a Facade to the complex logic of this service. The name of each function
 *  should be self explanatory.
 *
 *  I highly suggest you keep each block minimized in the editor and only open the one you're interested in
 */

angular.module('app').service('StateMachineService', StateMachineService);

StateMachineService.$inject = [];

function StateMachineService() {
    var _this = this;

    this.showLoad = true;
    this.showAdded = false;
    this.showSettings = false;
    this.selected = null;
    this.instance = null;
    this.nodeId = "1";
    this.transId = "1";
    this.left = 50;
    this.top = 50;
    this.lastExpression = "";
    this.transitionIdToObject = {};
    this.added = [];
    this.sm = {};

    this.guardTypes = ["Conditional Guard", "Event Guard"];

    this.incrementNID = function () {
        return _this.nodeId++;
    };
    this.incrementTID = function () {
        return _this.transId++;
    };

    this.addNodeAngular = function (class_id) {
        // add state to angular array
        var state = {};

        state.name = "nodeId_" + _this.nodeId;
        state.id = "nodeId_" + _this.nodeId;
        state.plumbleft = _this.left + "px";
        state.plumbtop = _this.top + "px";
        state.class = class_id;
        state.params = [];

        var c = _this.getClassById(class_id);
        c.init.params.forEach(function (p) {
            return state.params.push("");
        });

        _this.sm.init.states.push(state);

        _this.left += 10;
        _this.top += 10;
    };
    this.addNodePlumb = function (el) {
        _this.instance.draggable(el, {
            drag: function drag(e) {
                var state = _this.sm.init.states.find(function (s) {
                    return s.id == e.el.id;
                });

                if (state) {
                    state.plumbleft = e.pos[0] + "px";
                    state.plumbtop = e.pos[1] + "px";
                }
            }
        });

        _this.instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: {
                strokeStyle: "#5c96bc",
                lineWidth: 2,
                outlineColor: "transparent",
                outlineWidth: 4
            },
            connectionType: "basic",
            extract: {
                "action": "the-action"
            },
            maxConnections: -1,
            onMaxConnections: function onMaxConnections(info, e) {
                return alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        _this.instance.makeTarget(el, {
            dropOptions: {
                hoverClass: "dragHover"
            },
            anchor: "Continuous",
            allowLoopback: true
        });

        _this.incrementNID();
    };
    this.removeNode = function (name) {
        _this.sm.init.states.splice(_this.sm.init.states.indexOf(name), 1);
    };

    this.addTransition = function (source, target) {
        var transition = {};

        transition.id = "transId_" + _this.transId;
        transition.from = source;
        transition.to = target;
        transition.guard = {
            "type": "",
            "expression": "",
            "onTransition": ""
        };

        _this.sm.init.transitions.push(transition);
    };
    this.removeTransition = function (id) {
        var transIndex = _this.sm.init.transitions.findIndex(function (t) {
            return t.id == id;
        });

        if (transIndex > -1) _this.sm.init.transitions.splice(transIndex, 1);
    };

    this.getParameterById = function (x, y) {
        return _this.added.find(function (a) {
            return a.object.id == x;
        }).init.params[y] || null;
    };
    this.getClassById = function (x) {
        return _this.added.find(function (a) {
            return a.object.id == x;
        }) || null;
    };

    this.reset = function () {
        _this.showLoad = true;
        _this.showAdded = false;
        _this.showSettings = false;
        _this.selected = null;
        _this.instance = null;
        _this.nodeId = "1";
        _this.transId = "1";
        _this.left = 50;
        _this.top = 50;
        _this.lastExpression = "";
        _this.transitionIdToObject = {};
        _this.added = [];
        _this.sm = {};
    };
}
'use strict';

angular.module('app').service('ScoreService', ScoreService);

ScoreService.$inject = ['$q'];

function ScoreService($q) {
    this.formscore = function (user, form) {
        var deferred = $q.defer();

        Parse.Cloud.run('calculateFormScore', { user: user, form: form }).then(function (score) {
            return deferred.resolve(score);
        }, function (error) {
            return deferred.reject(error);
        });
        return deferred.promise;
    };
}
'use strict';

angular.module('app').service('ScoreService', ScoreService);

ScoreService.$inject = ['$q'];

function ScoreService($q) {
    this.calculateFormScore = function (formID) {
        var deferred = $q.defer();

        Parse.Cloud.run('calculateFormScore', { formID: formID }).then(function (score) {
            return deferred.resolve(score);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };
}
'use strict';

/*
 *  Counseling Services
 *
 *  Authors: Guido Ruiz, Daniel Rivero
 *
 *  Description: Pretty much code that has been split away from the counseling controller, as it is tightly coupled with
 *  just getting HTML injects on the page and modifying them as such. Think of the HTML injects as building blocks that
 *  can be changed (their size, color, shape, what they do when they are clicked, etc) and these properties are
 *  maintained and modified in here. Therefore, the counseling controller, given a series of HTML modules to show,
 *  loads them from the client and stores them here, modifying the values whenever needed. For example, the eEva WebGL
 *  Unity scene is an HTML inject module, and the size is modified from fullscreen to halfscreen with the change of
 *  a parameter within this service.
 *
 *  Format: The format is as follows:
 *      <HTML block>:
 *          <id>: uniquely identifies the block
 *          <hidden>: dictates if the element is visible or not
 *          <content>: Actual HTML for the element, a.k.a <http><a href=""></a> .....
 *          <classes>: The classes that modify the block found on the main css file
 *          <fetch>: When called, replaces <content> with HTML fetched from the .html file
 *          <click>: When the 'block' is clicked, handle the click.
 *
 *  I highly suggest you keep each block minimized in the editor and only open the one you're interested in
 */

angular.module('app').service('widgetService', widgetService);

widgetService.$inject = ['$sce', '$templateRequest', '$state', '$window'];

function widgetService($sce, $templateRequest, $state) {
    var obj = {
        // ----- MENU ITEMS ----- //
        userButton: {
            id: 'userButton',
            hidden: false,
            content: "",
            classes: { 'userButton-hidden': false },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/user.image.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                    console.log("Content has been replaced!");
                });
            },
            click: function click() {
                var self = this;
                var userMenu = obj.userMenu;
                var cameraMenu = obj.cameraMenu;
                var cameraButton = obj.cameraButton;

                //css manipulation for displaying the widgets
                userMenu.classes['userMenu-hidden'] = !userMenu.classes['userMenu-hidden'];
                self.classes['userButton-hidden'] = !self.classes['userButton-hidden'];

                if (self.classes['userButton-hidden']) {
                    cameraMenu.classes['cameraMenu-hidden'] = true;
                } else if (!self.classes['userButton-hidden']) {
                    if (cameraButton.classes['cameraButton-hidden']) cameraMenu.classes['cameraMenu-hidden'] = false;
                }

                if (!self.classes['userButton-hidden']) userMenu.classes['userMenu-hidden'] = true;
            }
        },
        cameraButton: {
            id: 'cameraButton',
            hidden: false,
            content: "",
            classes: { 'cameraButton-hidden': false },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/camera.image.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                    console.log("Content has been replaced!");
                });
            },
            click: function click() {
                var self = this;
                var cameraMenu = obj.cameraMenu;
                var userMenu = obj.userMenu;
                var userButton = obj.userButton;

                //css manipulation for displaying the widgets
                cameraMenu.classes['cameraMenu-hidden'] = !cameraMenu.classes['cameraMenu-hidden'];
                self.classes['cameraButton-hidden'] = !self.classes['cameraButton-hidden'];

                if (self.classes['cameraButton-hidden']) userMenu.classes['userMenu-hidden'] = true;else if (!self.classes['cameraButton-hidden']) if (userButton.classes['userButton-hidden']) userMenu.classes['userMenu-hidden'] = false;

                if (!this.classes['cameraButton-hidden']) cameraMenu.classes['cameraMenu-hidden'] = true;
            }
        },
        userMenu: {
            id: 'userMenu',
            hidden: false,
            content: '',
            classes: { 'userMenu-hidden': true },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/user.menu.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },
        cameraMenu: {
            id: 'cameraMenu',
            hidden: false,
            content: '',
            classes: { 'cameraMenu-hidden': true },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/user.camera.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },
        //removing pause since doesn't work slunn002 04/23/2018

        // pauseButton: {
        //     id: 'pauseButton',
        //     hidden: false,
        //     content: '',
        //     classes: { 'pauseButton-hidden' :false },
        //     fetch: function(){
        //         var self =this;
        //         $templateRequest('/views/partials/menu/pause.button.html')
        //             .then(function(template){
        //                     self.content = $sce.trustAsHtml(template);
        //                     console.log("Pause button has been replaced!");
        //                 }
        //             );
        //     },
        //     click: function() {
        //         var self = this;
        //         var resumeButton = obj.resumeButton;
        //         //window.confirm("Voice paused!");
        //         resumeButton.classes['resumeButton-hidden'] = !resumeButton.classes['resumeButton-hidden'];
        //         self.classes['pauseButton-hidden'] = !self.classes['pauseButton-hidden'];
        //     }
        // },
        // resumeButton: {
        //     id: 'resumeButton',
        //     hidden: false,
        //     content: '',
        //     classes: { 'resumeButton-hidden': true},
        //     fetch: function() {
        //         var self = this;
        //         $templateRequest('/views/partials/menu/resume.button.html')
        //             .then(function(template){
        //                     self.content = $sce.trustAsHtml(template);
        //                 }
        //             );
        //     },
        //     click: function() {
        //         var self = this;
        //         var pauseButton = obj.pauseButton;
        //         //window.confirm("Voice paused!");
        //
        //
        //         //css manipulation for displaying the widgets
        //         pauseButton.classes['pauseButton-hidden'] = !pauseButton.classes['pauseButton-hidden'];
        //         self.classes['resumeButton-hidden'] = !self.classes['resumeButton-hidden'];
        //     }
        // },
        micButton: {
            id: 'micButton',
            hidden: false,
            content: '',
            classes: { 'micButton-hidden': false },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/mic.button.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                    console.log("Microphone button has been replaced!");
                });
            },
            click: function click() {
                if (!this.classes['micButton-hidden']) {
                    this.classes['micButton-hidden'] = true;
                    console.log("Microphone switch on");
                } else if (this.classes['micButton-hidden']) {
                    this.classes['micButton-hidden'] = false;
                    console.log("Microphone switch off");
                }
            }
        },
        micSlash: {
            id: 'micSlash',
            hidden: false,
            content: '',
            classes: { 'micSlash-hidden': false },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/micSlash.button.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                    console.log("Microphone Slash button has been replaced!");
                });
            },
            click: function click() {}
        },
        backButton: {
            id: 'backButton',
            hidden: false,
            content: '',
            classes: '',
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/back.button.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },
        progressBar: {
            id: 'progressBar',
            hidden: false,
            content: '',
            classes: '',
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/menu/progress.bar.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },
        // ----- MISC ITEMS ----- //
        elementPanel: {
            id: 'elementPanel',
            hidden: true,
            content: '',
            classes: {},
            fetch: function fetch() {
                var self = this;
                $templateRequest('views/partials/misc/element.panel.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },
        contentView: {
            id: 'contentView',
            hidden: false,
            content: '',
            classes: { 'contentView': true },
            fetch: function fetch() {
                var self = this;
                $templateRequest('views/partials/misc/content.panel.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },
        navBar: {
            id: 'navBar',
            hidden: false,
            content: '',
            classes: {},
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/misc/navbar.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },
        myProgress: {
            id: 'myProgress',
            hidden: true,
            content: '',
            classes: {},
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/misc/myprogress.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },

        // ----- VIRTUALYS ----- //
        virtualys: {
            id: 'virtualys',
            hidden: false,
            content: '',
            classes: { 'unityEva': true, 'ue-full': true, 'ue-half': false },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/chars/virtualys.webgl.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },

        // ----- HAPTEK ----- //
        webglEva: {
            id: 'webgl-app',
            hidden: false,
            content: '',
            classes: { 'webglEva': true },
            fetch: function fetch() {
                var self = this;
                $templateRequest('/views/partials/chars/eva.webgl.html').then(function (template) {
                    self.content = $sce.trustAsHtml(template);
                });
            },
            click: function click() {}
        },

        // ----- HELPER FUNCTIONS ----- //
        htmls: [],
        htmlUsed: function htmlUsed(id) {
            return $state.current.data.htmlModules.indexOf(id) >= 0;
        },
        fetchAll: function fetchAll() {
            for (var widget in obj) {
                if (obj[widget].id != undefined && obj.htmlUsed(obj[widget].id)) {
                    obj[widget].fetch();
                    obj.htmls.push(obj[widget]);
                }
            }
        }
    };

    return obj;
}
'use strict';

angular.module('app').controller('treeViewController', treeViewController);

treeViewController.$inject = ['$scope', '$http', 'InterventionService', 'FormService', 'ElementService'];

function treeViewController($scope, $http, InterventionService, FormService, ElementService) {
    $scope.showTree = false;
    $scope.roleList = [];
    $scope.buttonText = "";
    $scope.interventionSrv = InterventionService;
    $scope.formSrv = FormService;
    $scope.elSrv = ElementService;

    /*console.log("starting the tree view controller");
    let interventions = $scope.interventionSrv.getAllInterventions();
      for(var i = 0; i < interventions.length; i++){
          $scope.roleList.push({
            roleName: interventions[i].name,
            roleId: interventions[i].id,
            collapsed: true,
            children: []
        });
          var tmpChildren = $scope.formSrv.getFormsByIntervention(interventions[i]);
          for(var j = 0; j < tmpChildren.length; j++){
            $scope.roleList[i].children.push({
                roleName:tmpChildren[j].name,
                roleId: tmpChildren[j].id,
                collapsed: true,
                children: []
            });
        }
          for(var k = 0; $scope.roleList[i].children.length; k++){
            var elTmpChildren = $scope.elSrv.getElementsByForm($scope.roleList[i].children[k]);
              for(var l = 0; elTmpChildren.length; l++){
                $scope.roleList[i].children[k].push({
                    roleName: $scope.getElementDescription(elTmpChildren[l]),
                    roleId: elTmpChildren[l].id,
                    roleType: elTmpChildren[l].type,
                    roleOrder: elTmpChildren[l].order,
                    collapsed: true,
                    children: []
                });
            }
          }
        }*/

    console.log($scope.roleList);

    /*$http.get('/api/interventions').then(
        function(success) {
            for(var i = 0; i < success.data.length; ++i){
                $scope.roleList.push({
                    roleName: success.data[i].name,
                    roleId: success.data[i]._id,
                    collapsed: true,
                    children: []
                });
            }
        },
        function (err) {
          }
    );*/

    /* $http.get('/api/forms').then(
         function(success){
             //TODO Design faster algorithm
             for(var i = 0; i < $scope.roleList.length; ++i) {
                 for(var j = 0; j < success.data.length; ++j) {
                     if( $scope.roleList[i].roleId == success.data[j].intervention_id){
                         $scope.roleList[i].children.push({
                             roleName:success.data[j].name,
                             roleId: success.data[j]._id,
                             collapsed: true,
                             children: []
                         });
                     }
                 }
             }
         },
         function(err){}
     );*/
    /*
        $http.get('/api/elements').then(
         function(success){
             //TODO Design faster algorithm
             for(var i = 0; i < $scope.roleList.length; ++i) {
                 for(var j = 0; j < $scope.roleList[i].children.length; ++j) {
                     for(var k = 0; k < success.data.length; ++k) {
                         if( $scope.roleList[i].children[j].roleId == success.data[k].form_id){
                             $scope.roleList[i].children[j].children.push({
                                 roleName: $scope.getElementDescription(success.data[k]),
                                 roleId: success.data[k]._id,
                                 roleType: success.data[k].type,
                                 roleOrder: success.data[k].order,
                                 collapsed: true,
                                 children: []
                             });
                         }
                     }
                 }
             }
         },
         function (err) {
           }
     );
    */

    $scope.getElementDescription = function (dataElement) {
        if (dataElement.type == "QuestionAnswer") return dataElement.order + ": " + dataElement.phrase;else if (dataElement.type == "QuestionAnswer-Checkbox") return dataElement.order + ": " + dataElement.phrase;else if (dataElement.type == "textArea") return dataElement.order + ": " + dataElement.phrase;else if (dataElement.type == "feedback") return dataElement.order + ": " + dataElement.phrase;else if (dataElement.type == "feedbackList") return dataElement.order + ": " + dataElement.phrase[0].feedback_text;

        return "Unknown data element";
    };
}
'use strict';

/*
 *   Home Controllers
 *
 *   Authors: Guido Ruiz
 *
 *   Description: This angular controller controls the main index page. At the time of writing this description, it only
 *   has a simple login interface and links to other pages once logged in.
 */
angular.module('app').controller('passwordController', passwordController);

passwordController.$inject = ['$scope', '$http', '$stateParams', '$state'];

function passwordController($scope, $http, $stateParams, $state) {
    $scope.newPassword = "";
    $scope.confirmPassword = "";

    /*$scope.resetPassword = function(){
        var obj = {
            token: $stateParams.token,
            password: $scope.newPassword,
            confirm: $scope.confirmPassword
        };
          $http.post('/auth/password/complete', obj)
            .then(function(res){
                console.log(res);
                $state.go('login');
            })
            .catch(function(err){
                console.log(err);
                $state.go('login');
            })
    }*/
}
'use strict';

/*
 *   Shared Controllers
 *
 *   Authors: Guido Ruiz, Daniel Rivero
 *
 *   Description: Here lies all the controllers that manage all pages. Essentially, functionality that needs to be
 *   accessed by all other controllers are here (think of it like the dad of controllers, or an abstract class, etc.)
 *   At the time of writing this, the only thing that is shared between all controllers is the admin navigation bar
 *   in which the adminNavController handles the logout feature (button) on the right side.
 */

angular.module('app').controller('loginPopUpController', loginPopUpController);
angular.module('app').controller('registerPopUpController', registerPopUpController);
angular.module('app').controller('aboutUsPopUpController', aboutUsPopUpController);
angular.module('app').controller('adPolicyPopUpController', adPolicyPopUpController);
angular.module('app').controller('privacyPopUpController', privacyPopUpController);
angular.module('app').controller('copyrightPopUpController', copyrightPopUpController);
angular.module('app').controller('limitationsPopUpController', limitationsPopUpController);
angular.module('app').controller('notYetMappedController', notYetMappedController);

loginPopUpController.$inject = ['$scope', '$window', 'AuthService', '$uibModalInstance', '$timeout'];
registerPopUpController.$inject = ['$scope', '$window', 'AuthService', '$uibModalInstance'];
aboutUsPopUpController.$inject = ['$scope', '$window', '$uibModalInstance'];
adPolicyPopUpController.$inject = ['$scope', '$window', '$uibModalInstance'];
privacyPopUpController.$inject = ['$scope', '$window', '$uibModalInstance'];
copyrightPopUpController.$inject = ['$scope', '$window', '$uibModalInstance'];
limitationsPopUpController.$inject = ['$scope', '$window', '$uibModalInstance'];
notYetMappedController.$inject = ['$scope', '$window'];

function loginPopUpController($scope, $window, AuthService, $uibModalInstance, $timeout) {
    $scope.auth = AuthService;
    $scope.isLoggedIn = false;

    $scope.alerts = [];
    $scope.addAlert = function (alert) {
        $scope.alerts.push(alert);
        $timeout(function () {
            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
        }, 2500);
    };

    $scope.credentials = {
        username: "",
        password: ""
    };

    /* $scope.login = function()
     {
         console.log("*******************************************************");
         console.log("Attempting to login");
         $scope.auth.login($scope.credentials).then(
             success => {
                 $scope.currentUser = $scope.auth.currentUser();
                 $window.location.href = '/';
             },
             error => $scope.currentUser = $scope.auth.currentUser()
         );
       };*/

    $scope.login = function () {
        return AuthService.login($scope.credentials).then(function (success) {
            $scope.currentUser = AuthService.currentUser();
            $scope.userFname = AuthService.userFname;

            //console.log($scope.currentUser.get('firstName'));
            $scope.isLoggedIn = true;
            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "You have successfully logged in!"
            });

            /*Parse.Cloud.run("getUserName", {}).then(function (e){
               $scope.userFName = e.userGivenName;
                console.log("userFname: " +  $scope.userFName);
            });*/
            //$scope.cancel();
        }, function (error) {
            $scope.currentUser = AuthService.currentUser();
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
            $scope.isLoggedIn = false;
        });
    };

    $scope.logout = function () {
        return AuthService.logout($scope.credentials).then(function (success) {
            $scope.currentUser = {};
            $scope.userFname = "";

            $scope.isLoggedIn = false;
            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "You have successfully logged out!"
            });
        }, function (error) {
            //$scope.currentUser = AuthService.currentUser();
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
        });
    };

    $scope.logout = function () {
        $scope.auth.logout().then(function (success) {
            $scope.currentUser = $scope.auth.currentUser();
            $window.location.href = '/';
            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "You have successfully logged out!"
            });
        }, function (error) {
            $scope.currentUser = $scope.auth.currentUser();
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
        });
    };

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function registerPopUpController($scope, $window, AuthService, $uibModalInstance) {
    $scope.auth = AuthService;

    $scope.profile = { "answers": [] };
    $scope.$root.userResponse = "hello";
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
        race: "",
        maritalstatus: ""
    };

    $scope.educationType = ['Some high school', 'High school graduate or equivalent', 'Trade or Vocational degree', 'Some college', 'Associate degree', 'Bachelor\'s degree', 'Graduate or professional degree'];
