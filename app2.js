    //update objects that were edited to reflect in the database
    $scope.renameIntervention = function (interven) {
        interven.save().then(function (success) {
            $scope.Success("The intervention has been renamed successfully");
        }, function (error) {
            return $scope.Error("There was an error contacting the server. Please try again.");
        });
    };
    $scope.renameForm = function (form) {
        form.save().then(function (success) {
            $scope.Success("The form has been renamed successfully");
        }, function (error) {
            return $scope.Error("There was an error contacting the server. Please try again.");
        });
    };

    $scope.updateElement = function () {

        if ($scope.editorMode.moreOptions) {
            $scope.elementSelected.isRecorded = 'true' == $scope.elementSelected.isRecorded;
            $scope.elementSelected.displayBackBtn = 'true' == $scope.elementSelected.displayBackBtn;
            $scope.elementSelected.displayProgress = 'true' == $scope.elementSelected.displayProgress;
        }

        var arr = [];

        $scope.workingElement.phrase.forEach(function (p, index) {
            arr.push(p.text);
        });

        $scope.elementSelected.phrase = arr;

        arr = [];

        if (!($scope.elementSelected.type === "TabularInput")) {
            $scope.workingElement.content.forEach(function (c, index) {
                arr.push(c.text);
            });

            $scope.elementSelected.content = arr;
        }

        console.log("Saving element: ");
        console.log($scope.elementSelected);

        if ($scope.elementSelected != $scope.elementPrevOrder) {
            $scope.elements = reorderElements($scope.elements, $scope.elementPrevOrder, $scope.elementSelected.order);
        }

        $scope.elementSelected.save().then(function (success) {
            $scope.Success("The element has been saved successfully");
            refreshElements();
        }, function (error) {
            return $scope.Error("There was an error contacting the server. Please try again.");
        });
    };

    //Code for the element editor in the survey editor

    //the following allows multiple inputs for phrase and content sections of element editor
    //the function addInput() appends a new input element as the child of the div provided
    //via function arguments
    $scope.addInput = function (attr) {
        var defInput = "";

        if (attr === "content") {
            $scope.elementSelected.content.push(defInput);
            $scope.workingElement.content.push({
                text: ""
            });
        }
        if (attr === "phrase") {
            $scope.elementSelected.phrase.push(defInput);
            $scope.workingElement.phrase.push({
                text: ""
            });
        }
    };

    $scope.deleteInput = function (attr, index) {

        /*if (attr === "content") {
         $scope.elementSelected.content.splice(index, 1);
         for(let i = 0; i < $scope.elementSelected.content.length; i++){
         $scope.elementSelected.content[i].order = i;
         }
         }*/

        if (index > -1) {
            if (attr === "content") {
                $scope.elementSelected.content.splice(index, 1);
                $scope.workingElement.content.splice(index, 1);
            }
            if (attr === "phrase") {
                $scope.elementSelected.phrase.splice(index, 1);
                $scope.workingElement.phrase.splice(index, 1);
            }
        }

        $scope.updateElement();
    };

    $scope.deleteElement = function (element) {
        $scope.elementSelected = element;

        ElementService.deleteElement($scope.elementSelected, $scope.formSelected.object).then(function (success) {
            $scope.Success("The element has been deleted successfully");
            refreshElements();
        }, function (error) {
            return $scope.Error("There was an error contacting the server. Please try again.");
        });
    };

    //used to navigate back to state determined by the state attribute
    $scope.goBack = function (state) {
        refreshElements();
        refreshForms();
        refreshElements();
        $state.go(state);
    };

    //the following function is used to determine if the field is of the current element will be displayed via
    //the element preview, this is determined by the type of element and the current field
    $scope.displayElementField = function (elementType, field) {
        if (field === "phrase") {
            if (elementType === 'QuestionAnswer' || elementType === 'MenuWithCompletion' || elementType === 'RangeSliderElement' || elementType === 'MenuElement' || elementType === 'feedback' || elementType === 'feedbackList' || elementType === 'QuestionAnswer-Checkbox' || elementType === 'QuestionAnswer' || elementType === 'textArea' || elementType === 'LoginRegisterElement') {
                return true;
            } else {
                return false;
            }
        } else if (field === "content") {
            if (elementType === 'QuestionAnswer' || elementType === 'MenuWithCompletion' || elementType === 'QuestionAnswer-Checkbox' || elementType === 'MenuElement' || elementType === 'RangeSliderElement') {
                return true;
            } else {
                return false;
            }
        } else if (field === "html") {
            if (elementType === 'Content') {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    $scope.elReorder = false;

    //the following function updates the order of the elements when there has been a change in the order. it sets
    //elReorder to true indicating that the order of the elements have changed and needs to be saved
    $scope.stop = function (e, ui) {
        for (var i = 0; i < $scope.elements.length; i++) {
            $scope.elements[i].order = i;
        }
        if (!$scope.elReorder) {
            $scope.elReorder = true;
        }
    };

    $scope.updateElementsOrder = function () {

        $scope.elements.forEach(function (element, index) {
            element.save().then(function (success) {
                if (index === $scope.elements.length - 1) {
                    $scope.Success("The elements have been successfully reordered.");
                    $scope.elReorder = false;
                }
            }, function (error) {
                $scope.Error("There was an error contacting the server. Please try again.");
                $scope.elReorder = false;
            });
        });
    };

    refreshInterventions();
}
'use strict';

angular.module('app').controller('scoreController', scoreController);

scoreController.$inject = ['$scope', 'ScoreService', 'AuthService', 'InterventionService', 'FormService', '$state', 'ElementService'];

function scoreController($scope, ScoreService, AuthService, InterventionService, FormService, $state, ElementService) {

    $scope.currentUser = AuthService.currentUser();

    $scope.interventionSelected = null;
    $scope.scoredFormSelected = null;

    $scope.calculateScoreByFormObj = function (form) {

        if (!$scope.currentUser) return;

        $scope.scoredFormSelected = form;

        var formID = $scope.scoredFormSelected.object.id;

        ScoreService.calculateFormScore(formID).then(function (score) {
            console.log(score);
            $scope.score = score;
        }, function (error) {
            console.log(error.message);
        });
    };

    $scope.scoredInterventions = [];
    $scope.scoredForms = [];
    $scope.elementsOfScoredForm = [];

    // -- helper functions that refresh arrays above
    function getScoredForms() {
        if (!$scope.interventionSelected) return;

        FormService.getFormsByIntervention($scope.interventionSelected.object).then(function (objects) {
            return $scope.scoredForms = objects;
        }, function (error) {});
    }
    function getScoredInterventions() {
        InterventionService.getAllInterventions().then(function (objects) {
            return $scope.scoredInterventions = objects;
        }, function (error) {});
    }
    function getScoredElements() {
        if (!$scope.scoredFormSelected) return;

        // code goes here...
        ElementService.getElementsByForm($scope.scoredFormSelected.object).then(function (objects) {
            $scope.elementsOfScoredForm = objects;
        }, function (error) {});
    }

    $scope.selectScoredIntervention = function (intervention) {
        $scope.interventionSelected = intervention;
        getScoredForms();
        $state.go('feedback.form');
    };

    function init() {
        getScoredInterventions();
    }

    init();
}
"use strict";

var character;
var mainframe;

var AUDIT = [{
    "id": "480OIkUfRe",
    "survey": "audit",
    "isFirst": true,
    "isLast": false
}, {
    "id": "NTEyjG7JaV",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "3b8HApHIsW",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "9PV3mDHsYj",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "o3Vvd9PuV4",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "7hrQrRkroo",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "fcrMyhewqP",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "XnBeaqJpLP",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "EoNDjbREoC",
    "survey": "audit",
    "isFirst": false,
    "isLast": false
}, {
    "id": "TRbkGxXZij",
    "survey": "audit",
    "isFirst": false,
    "isLast": true
}];
var GTNSGT = [{
    "id": "PBuf3sVCCj",
    "survey": "GTNSGT",
    "isFirst": true,
    "isLast": false
}, {
    "id": "UY59yLDhwG",
    "survey": "GTNSGT",
    "isFirst": false,
    "isLast": true
}];
var HOWMUCHHOWOFTEN = [{
    "id": "pleBxUHgyt",
    "survey": "familyHistory",
    "isFirst": true,
    "isLast": false
}, {
    "id": "mR3X2pZszK",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "rvYjxAukwA",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "YHmKYTz5Y5",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "0OcF0WWPsl",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "uwT5nhssr2",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "qPjT3Q1sXr",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "lfaPYb8211",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "VOKthC7rpT",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "b3OOreWXJ5",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Ud8heugqCQ",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "r6ZkJCdBEz",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "wPFh7S9lhn",
    "survey": "myDrinking",
    "isFirst": false,
    "isLast": false
}, {
    "id": "f8B0ihkAKr",
    "survey": "myDrinking",
    "isFirst": false,
    "isLast": false
}, {
    "id": "VLutfNbPnB",
    "survey": "myDrinking",
    "isFirst": false,
    "isLast": false
}, {
    "id": "nrFKqQekln",
    "survey": "otherDrugs",
    "isFirst": false,
    "isLast": false
}, {
    "id": "BmqCFA3LpF",
    "survey": "otherDrugs",
    "isFirst": false,
    "isLast": false
}, {
    "id": "XTxMZ7TJ4h",
    "survey": "otherDrugs",
    "isFirst": false,
    "isLast": true
}];
var FAMILYHISTORY = [{
    "id": "pleBxUHgyt",
    "survey": "familyHistory",
    "isFirst": true,
    "isLast": false
}, {
    "id": "mR3X2pZszK",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "rvYjxAukwA",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "YHmKYTz5Y5",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "0OcF0WWPsl",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "uwT5nhssr2",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "qPjT3Q1sXr",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "lfaPYb8211",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "VOKthC7rpT",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "b3OOreWXJ5",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Ud8heugqCQ",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": false
}, {
    "id": "r6ZkJCdBEz",
    "survey": "familyHistory",
    "isFirst": false,
    "isLast": true
}];
/*const MYDRINKING = [
    {
        "id": "wPFh7S9lhn",
        "survey": "myDrinking",
        "isFirst": true,
        "isLast": false
    },
    {
        "id": "f8B0ihkAKr",
        "survey": "myDrinking",
        "isFirst": false,
        "isLast": false
    },
    {
        "id": "VLutfNbPnB",
        "survey": "myDrinking",
        "isFirst": false,
        "isLast": true
    }
];*/
var MYDRINKING = [{
    "id": "2ryq9FqhYi",
    "survey": "myDrinking",
    "isFirst": true,
    "isLast": false
}, {
    "id": "F94yWz8Ail",
    "survey": "myDrinking",
    "isFirst": false,
    "isLast": false
}, {
    "id": "VLutfNbPnB",
    "survey": "myDrinking",
    "isFirst": false,
    "isLast": true
}];
var OTHERDRUGS = [{
    "id": "nrFKqQekln",
    "survey": "otherDrugs",
    "isFirst": true,
    "isLast": false
}, {
    "id": "BmqCFA3LpF",
    "survey": "otherDrugs",
    "isFirst": false,
    "isLast": false
}, {
    "id": "XTxMZ7TJ4h",
    "survey": "otherDrugs",
    "isFirst": false,
    "isLast": true
}];
var A_R_P = [{
    "id": "is6vw6wRnG",
    "survey": "ARP",
    "isFirst": true,
    "isLast": false
}, {
    "id": "tBryo4ALxF",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "GuFCbEhXOV",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "dSQV6eGkSu",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "PzQplrhIWi",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "CSKw4wbij4",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "GggkBmfJ7o",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "XLn7eaEH96",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "AJycKpEegc",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "1wjSdhf2eM",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "9WHQFfzF4J",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Rf7rQvJfOt",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "udBLvwkRax",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "KQlF0k42wm",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "t5Vll6TJyu",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "jLu5TZtwYU",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "8Qz0T7pwMZ",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "UqgD7PlgW3",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "83FfJ9Zq3M",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "oMop003d7A",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "YHvVH5MqP1",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "jUnJEgy9dm",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "igQMYRzHJa",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "XD5NKWQKhc",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "S9UOlj8XAS",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "QqcaH4ZiJM",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "OmbUxx1Jha",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Et0gmveEIz",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "rqnLEOB52H",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "2oKhO7mWbO",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "v9frAvBSJq",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "a4QamiGCA3",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "bGlMCixyKA",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "wMWqoTE1gA",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "k2ip8q0K2L",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "xdA8C0leeD",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Wv4wzrJp0T",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "WPjoWWTdGW",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "7uAQj46Kc9",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Rvg0whSSHr",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "ySxADohMIJ",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "gCf1E8xcBt",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "VlJABvnKDr",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "6HjTndVKpf",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Gzv94vSMlK",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "WDYFKBp4Ra",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "o0gfHVKiZo",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "8kksZw0b1i",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "tPbHqZDc4F",
    "survey": "ARP",
    "isFirst": false,
    "isLast": false
}, {
    "id": "xX6fmHzV8a",
    "survey": "ARP",
    "isFirst": false,
    "isLast": true
}];
var DEPRESSION = [{
    "id": "wEl6CRXHap",
    "survey": "depression",
    "isFirst": true,
    "isLast": false
}, {
    "id": "7C7lYsNVrG",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "yQhfDjY1Hv",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "ESzTFSxNqP",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "VNpgWGgR4M",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "skEnfaheGA",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "u0M8THtHeu",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "DO85GeUxhE",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "3z52fzxiYn",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "ZEBeQFKqD6",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "HsJFBrsREs",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "AvCFAxuxUF",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "vRMntIjuE2",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "bYjn7kpxgy",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "NB7AzeSBRH",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "rSlFWovcfk",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "cKiSS5MKkf",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Muxcv4Ua10",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "6cBmIYiTKC",
    "survey": "depression",
    "isFirst": false,
    "isLast": false
}, {
    "id": "tWHgD3sg4A",
    "survey": "depression",
    "isFirst": false,
    "isLast": true
}];
var MAST = [{
    "id": "P8ZORJCP2t",
    "survey": "MAST",
    "isFirst": true,
    "isLast": false
}, {
    "id": "anKnOz2zw9",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "NebDyUe5qg",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "EbJlYYgmON",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "wnj3m1I4fr",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "da57qkCJJx",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "lTBnnPVswQ",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "XPNbG5yWKK",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "FSxb56512e",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "tZqTfnFqFk",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "G4RdTw8AlV",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "lkq0iDzd7Z",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "Ww5xSMi2CC",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "wsCQRHjYkg",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "LW2xfnSTxl",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "3GuR72PJfe",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "P3h1vN21qh",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "2M78gEZsmt",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "sFMai1HlQC",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "DffMpv7KJi",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "yQyMx17bXy",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "GivFm6vAUY",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "AAtW0GCLKn",
    "survey": "MAST",
    "isFirst": false,
    "isLast": false
}, {
    "id": "e1yYpKX6jG",
    "survey": "MAST",
    "isFirst": false,
    "isLast": true
}];
var DEPENDENCE = [{
    "id": "IJcTOH7fGb",
    "survey": "dependence",
    "isFirst": true,
    "isLast": false
}, {
    "id": "JrWYjpNoTq",
    "survey": "dependence",
    "isFirst": false,
    "isLast": false
}, {
    "id": "entTOZcC7x",
