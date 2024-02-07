    function updateSurveyPercentComplete(surveyName, elemId, responseObject) {
        var percentageComplete = 0;

        //if currentUserHasProgress update the currentUserProgress, if not then need to update the audit in the newUserProgress object
        if ($scope.currentUserProgress != null) {
            //console.log($scope.currentUserProgress);
            if (surveyName == "audit") {

                //get the last entry index in the audit array
                var index = $scope.currentUserProgress.attributes.audit.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.audit[index].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*console.log("index..............." + index);
                    console.log("current User progress in the audit");
                    console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.audit[index].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.audit * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the audit by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.audit[index].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.audit[index].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The Audit's percentage complete was updated with the value:  " + percentageComplete + " The Audit's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "GTNSGT") {
                //get the last entry index in the GTNSGT array
                var _index11 = $scope.currentUserProgress.attributes.GTNSGT.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.GTNSGT[_index11].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*console.log("index..............." + index);
                    console.log("current User progress in the audit");
                    console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.GTNSGT[_index11].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.GTNSGT * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the audit by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.GTNSGT[_index11].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.GTNSGT[_index11].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The GTNSGT's percentage complete was updated with the value:  " + percentageComplete + " The GTNSGT's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "howMuchHowOften") {
                //get the last entry index in the howMuchHowOften array
                var _index12 = $scope.currentUserProgress.attributes.howMuchHowOften.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.howMuchHowOften[_index12].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /* console.log("index..............." + index);
                     console.log("current User progress in the howMuchHowOften");
                     console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.howMuchHowOften[_index12].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.howMuchHowOften * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the howMuchHowOften by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.howMuchHowOften[_index12].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.howMuchHowOften[_index12].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The howMuchHowOften's percentage complete was updated with the value:  " + percentageComplete + " The howMuchHowOften's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "familyHistory") {
                //get the last entry index in the familyHistory array
                var _index13 = $scope.currentUserProgress.attributes.familyHistory.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.familyHistory[_index13].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*console.log("index..............." + index);
                    console.log("current User progress in the familyHistory");
                    console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.familyHistory[_index13].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.familyHistory * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the familyHistory by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.familyHistory[_index13].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.familyHistory[_index13].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The familyHistory's percentage complete was updated with the value:  " + percentageComplete + " The familyHistory's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "myDrinking") {
                //get the last entry index in the myDrinking array
                var _index14 = $scope.currentUserProgress.attributes.myDrinking.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.myDrinking[_index14].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*console.log("index..............." + index);
                    console.log("current User progress in the myDrinking");
                    console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.myDrinking[_index14].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.myDrinking * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the myDrinking by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.myDrinking[_index14].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.myDrinking[_index14].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The myDrinking's percentage complete was updated with the value:  " + percentageComplete + " The myDrinking's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "otherDrugs") {
                //get the last entry index in the otherDrugs array
                var _index15 = $scope.currentUserProgress.attributes.otherDrugs.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.otherDrugs[_index15].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*console.log("index..............." + index);
                    console.log("current User progress in the otherDrugs");
                    console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.otherDrugs[_index15].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.otherDrugs * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the otherDrugs by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.otherDrugs[_index15].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.otherDrugs[_index15].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The otherDrugs's percentage complete was updated with the value:  " + percentageComplete + " The otherDrugs's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "ARP") {
                //get the last entry index in the ARP array
                var _index16 = $scope.currentUserProgress.attributes.ARP.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.ARP[_index16].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /* console.log("index..............." + index);
                     console.log("current User progress in the ARP");
                     console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.ARP[_index16].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.ARP * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the ARP by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.ARP[_index16].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.ARP[_index16].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The ARP's percentage complete was updated with the value:  " + percentageComplete + " The ARP's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "depression") {
                //get the last entry index in the depression array
                var _index17 = $scope.currentUserProgress.attributes.depression.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.depression[_index17].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*  console.log("index..............." + index);
                      console.log("current User progress in the depression");
                      console.log($scope.currentUserProgress);
                    */
                    $scope.currentUserProgress.attributes.depression[_index17].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.depression * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the depression by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.depression[_index17].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.depression[_index17].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The depression's percentage complete was updated with the value:  " + percentageComplete + " The depression's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "MAST") {
                //get the last entry index in the MAST array
                var _index18 = $scope.currentUserProgress.attributes.MAST.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.MAST[_index18].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*console.log("index..............." + index);
                    console.log("current User progress in the MAST");
                    console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.MAST[_index18].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.MAST * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the depression by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.MAST[_index18].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.MAST[_index18].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The MAST's percentage complete was updated with the value:  " + percentageComplete + " The MAST's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else if (surveyName == "dependence") {
                console.log("Attempting to update the dependence survey.");
                //get the last entry index in the dependence array
                var _index19 = $scope.currentUserProgress.attributes.dependence.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                //as well as push the current question response into the responsesPtr array of the Progress Object
                if (!($scope.currentUserProgress.attributes.dependence[_index19].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;

                    /*console.log("index..............." + index);
                    console.log("current User progress in the dependence");
                    console.log($scope.currentUserProgress);*/

                    $scope.currentUserProgress.attributes.dependence[_index19].responsesPtr.push(responseObject);
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.dependence * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the dependence by updating the percentageComplete and current element id and pushing responseObject in array
                $scope.currentUserProgress.attributes.dependence[_index19].percentageComplete = percentageComplete;
                $scope.currentUserProgress.attributes.dependence[_index19].currentElement = elemId;

                //save users progress
                $scope.currentUserProgress.save().then(function (progress) {
                    return console.log("User's progress updated successfully. The dependence's percentage complete was updated with the value:  " + percentageComplete + " The dependence's current element was updated with the value: " + elemId);
                }, function (error) {
                    return console.log("There was an error updating the user's progress.  Error: " + error);
                });
            } else {
                console.log("Could not update " + surveyName + "! Please try again!");
            }
        } else {
            if (surveyName == "audit") {

                //get the last entry index in the audit array
                var _index20 = $scope.newUserProgress.audit.length - 1;

                //check if the user clicks same answer twice by comparing elmId with last processed element, if not its okay to update current question number
                if (!($scope.newUserProgress.audit[_index20].currentElement == elemId)) {
                    $scope.currentQuestionNumber += 1;
                }

                //calculate percentage complete
                percentageComplete = Math.round($scope.currentQuestionNumber / TOTAL_NUM_QUESTIONS.audit * 100);

                //let scope know the current percentage complete to communicate to the user
                $scope.currentPercentComplete = percentageComplete;

                //update the audit by updating the percentageComplete and current element id and pushing last response
                $scope.newUserProgress.audit[_index20].percentageComplete = percentageComplete;
                $scope.newUserProgress.audit[_index20].currentElement = elemId;
                $scope.newUserProgress.audit[_index20].responsesPtr.push(responseObject);
            }
        }
    };

    //following function is responsible for saving the users progress object in the database, once after completion of
    //each survey - ehenl001
    $scope.updateUserProgress = function (elmId, responseObject) {

        //get abbreviated element object from elements const
        $scope.currentElement_abbreviated = getAbbrevElementObj(elmId);

        //if getAbbrevElementObj returns a valid object continue updating user progress
        //if not do nothing
        if ($scope.currentElement_abbreviated) {

            //check if element is last in current survey
            if ($scope.currentElement_abbreviated.isLast) {
                markSurveyComplete($scope.currentElement_abbreviated.survey, responseObject);
            } else {
                //if element is not last update percentage completed in the current survey
                updateSurveyPercentComplete($scope.currentElement_abbreviated.survey, elmId, responseObject);
            }
        }
    };

    //following function gets the users progress object from the database
    function getUserProgress(usrObject, updateProgressFromNew, updateProgressFromTemp) {

        $scope.progressSrv.getUserProgress(usrObject).then(function (progress) {
            $scope.currentUserProgress = progress;
            /*console.log("retrieving users progress..............");
            console.log($scope.currentUserProgress);*/
            if (updateProgressFromNew) {
                transferUserProgress(true);
            } else if (updateProgressFromTemp) {
                transferUserProgress(false);
            }
        }, function (error) {
            return console.log(error);
        });
    }

    // -----------------------------------------------------------------------------------------------------------------
    // function called when a user answers a question answer element
    // -----------------------------------------------------------------------------------------------------------------

    $scope.handleQuestionAnswer = function (elemID, answer, numItems) {
        $scope.next();

        var resObj = { elemID: elemID, answer: [answer] };

        if ($scope.isMenu(elemID) || $scope.isMenuCheck(elemID)) {
            //ensure the menuChoice is a numeric value and store to be used later
            var choiceIndex = Number(answer);

            //if the menu has been encountered for the first time
            if (!$scope.menuIdsVisited.includes(elemID)) {

                //add the current menu to the list of menus visited
                $scope.menuIdsVisited.push(elemID);

                //prepare the tempArr, used for initializing the menu's flags
                var tempArr = [];

                //build the initial menuFlag list for the corresponding menu with id: elemID
                for (var i = 0; i < numItems; i++) {
                    if (i == choiceIndex) {
                        tempArr[i] = true;
                    } else {
                        tempArr[i] = false;
                    }
                }

                //add the newly encountered menu to available menus array
                $scope.availableMenus.push({
                    "menuId": elemID,
                    "menuFlags": tempArr
                });

                //set the current menu to the current menu
                $scope.currentMenu = {
                    "menuId": elemID,
                    "menuFlags": tempArr
                };
            } else {
                //the menu has already been encountered
                //look for the correct element id and set the flag of that corresponding flag menu to true
                for (var i = 0; i < $scope.availableMenus.length; i++) {
                    //set the flag
                    if ($scope.availableMenus[i].menuId === elemID) {
                        $scope.availableMenus[i].menuFlags[choiceIndex] = true;
                    }

                    //if current menu is different from incoming menu set current menu to incoming menu
                    $scope.currentMenu = $scope.availableMenus[i];
                }
            }
        } else {
            $scope.updateUserProgress(elemID, resObj);
        }

        //if there is a currentUser save answer
        if ($scope.currentUser) {
            /*console.log("currentUser*****************************************************");
             console.log($scope.currentUser);*/
            Parse.Cloud.run('addResponse', { elemID: elemID, answer: [answer] });
            if ($scope.tempUser) {
                //console.log("temp user pushing new answer in tempRes");
                if ($scope.tmpRes.length > 0) {
                    for (var i = 0; i > $scope.tmpRes.length; i++) {
                        if (!$scope.tmpRes[i].elemID == elemID) {
                            $scope.tmpRes.push({
                                elemID: elemID,
                                answer: answer
                            });
                        } else {
                            $scope.tmpRes[i] = {
                                elemID: elemID,
                                answer: [answer]
                            };
                        }
                    }
                } else {
                    $scope.tmpRes.push({
                        elemID: elemID,
                        answer: answer
                    });
                }
            }
        } else {
            //if there is not currentUser store answer in a temporary array
            $scope.tmpRes.push({
                elemID: elemID,
                answer: answer
            });
        }

        //todo: add responses upon successful login
        //todo: add responses upon successful registration
        //todo: create a parse cloud function addMultipleResponses
        // var ansElem = $scope.responses.find(function(elem){
        //     return elem.question == elemId;
        // });

        // if (ansElem === undefined) {
        //     $scope.responses.push({"question": elemId, "answer": answer});
        // } else {
        //     ansElem.answer = answer;
        //     if($scope.auditAnswer < 10) {
        //         $scope.auditAnswer++;
        //         console.log("Audit Answered: "+ $scope.auditAnswer);
        //     }
        // }

        // $scope.progressValue = Math.max(($scope.auditAnswer / 10) * 100, 0);
        // console.log($scope.currentQuestionnaire + " progress : " + $scope.progressValue);

        $scope.$root.userResponse = "";
    };
    $scope.handleLRE = function () {
        $scope.next();
        $scope.$root.userResponse = "";
    };

    $scope.getRangeLabel = function (num) {
        $scope.rangeLabel = $scope.readinessLabels[num];
    };
    $scope.handleRangeSliderElement = function (elemID) {
        var res = $scope.$root.userResponse;
        $scope.next();

        Parse.cloud.run("addResponse", { elemID: elemID, answer: res });

        $scope.$root.userResponse = "";
    };

    $scope.menuIdsVisited = [];
    $scope.availableMenus = [];
    $scope.currentMenu = {};

    $scope.handleMenuItemSelection = function (numItems, elemID, menuChoice) {

        //progress to next element in the DCU
        //$scope.next();

        //ensure the menuChoice is a numeric value and store to be used later
        var choiceIndex = Number(menuChoice);

        //Parse.Cloud.run('addResponse', { elemID: elemID, answer: [menuChoice] });


        //if the menu has been encountered for the first time
        if (!$scope.menuIdsVisited.includes(elemID)) {

            //add the current menu to the list of menus visited
            $scope.menuIdsVisited.push(elemID);

            //prepare the tempArr, used for initializing the menu's flags
            var tempArr = [];

            //build the initial menuFlag list for the corresponding menu with id: elemID
            for (var i = 0; i < numItems; i++) {
                if (i == choiceIndex) {
                    tempArr[i] = true;
                } else {
                    tempArr[i] = false;
                }
            }

            //add the newly encountered menu to available menus array
            $scope.availableMenus.push({
                "menuId": elemID,
                "menuFlags": tempArr
            });

            //set the current menu to the current menu
            $scope.currentMenu = {
                "menuId": elemID,
                "menuFlags": tempArr
            };
        } else {
            //the menu has already been encountered
            //look for the correct element id and set the flag of that corresponding flag menu to true
            for (var i = 0; i < $scope.availableMenus.length; i++) {
                //set the flag
                if ($scope.availableMenus[i].menuId === elemID) {
                    $scope.availableMenus[i].menuFlags[choiceIndex] = true;
                }

                //if current menu is different from incoming menu set current menu to incoming menu
                $scope.currentMenu = $scope.availableMenus[i];
            }
        }

        /* console.log("******************************************************************************************");
         console.log($scope.availableMenus);*/

        //clear the user's response (the menu item selected)
        //$scope.$root.userResponse = "";

    };

    $scope.checkVisited = function (elemID, menuChoice) {

        var cssClass = '';

        //check to see if we have encountered this menu if not then the items all should have the default class
        if ($scope.menuIdsVisited.includes(elemID)) {
            //traverse the available menus and find the appropriate menu flag, assign the class based on the flag
            for (var i = 0; i < $scope.availableMenus.length; i++) {
                if ($scope.availableMenus[i].menuId === elemID) {
                    cssClass = $scope.availableMenus[i].menuFlags[menuChoice] ? 'visitedMenuItem' : 'defaultMenuItem';
                }
            }
        } else {
            cssClass = 'defaultMenuItem';
        }

        return cssClass;
    };

    $scope.getProgressValue = function () {
        return "p" + $scope.progressValue;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // function called when a user answers a checkbox element
    // -----------------------------------------------------------------------------------------------------------------

    $scope.checkboxExists = function (item) {
        if ($scope.$root.userResponse) return $scope.$root.userResponse.indexOf(item) > -1;else return false;
    };
    $scope.handleCheckbox = function (elemId, item) {
        if ($scope.$root.userResponse == null) $scope.$root.userResponse = [];

        var idx = $scope.$root.userResponse.indexOf(item);
        if (idx > -1) $scope.$root.userResponse.splice(idx, 1);else $scope.$root.userResponse.push(item);

        var ansElem = $scope.responses.find(function (elem) {
            return elem.question == elemId;
        });

        if (ansElem === undefined) $scope.responses.push({ "question": elemId, "answer": $scope.$root.userResponse });else ansElem.answer = $scope.$root.userResponse;

        //console.log($scope.$root.userResponse);
    };
    /*$scope.handleTabularInput = function(elemID){
       $scope.next();
       let response = $scope.$root.userResponse;
     let answer = new Array();
     let size = 0, keyA, keyB, i=0;
       for (keyA in response) {
     if (response.hasOwnProperty(keyA)){
     let content = new Array();
     for (keyB in response[keyA]){
     if (response[keyA].hasOwnProperty(keyB)){
     content.push(response[keyA][keyB]);
     }
     }
         answer[i] = content;
     i++;
     }
     }
       /!* Parse.Cloud.run('addResponse', { elemID: elemID, answer: answer });*!/
     };*/
    // -----------------------------------------------------------------------------------------------------------------
    // 'defaults' a response when visiting a question already answered
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$root.updateUserResponseFromLocal = function (elemId) {
        var ansElem = $scope.responses.find(function (elem) {
            return elem.question == elemId;
        });

        if (ansElem === undefined) $scope.$root.userResponse = null;else $scope.$root.userResponse = ansElem.answer;
    };

    // -----------------------------------------------------------------------------------------------------------------
    // stores error messages and displays them when added
    // -----------------------------------------------------------------------------------------------------------------

    $scope.alerts = [];
    $scope.addAlert = function (alert) {
        $scope.alerts.push(alert);
        $timeout(function () {
            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
        }, 2500);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // simple helper function that removes from 'arr' element at 'index'
    // -----------------------------------------------------------------------------------------------------------------

    $scope.removeElement = function (arr, index) {
        arr.splice(index, 1);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // called when the user clicks login
    // -----------------------------------------------------------------------------------------------------------------

    // $scope.loginButton = function () {
    //     var panel = $scope.widget.userMenu;
    //     var cameraMenu = $scope.widget.cameraMenu;
    //     var cameraButton = $scope.widget.cameraButton;
    //     var pauseButton = $scope.widget.pauseButton;
    //
    //     panel.classes['userMenu-hidden'] = !panel.classes['userMenu-hidden'];
    //     cameraMenu.classes['cameraMenu-hidden'] = true;
    //
    //     if(panel.classes['userMenu-hidden']) {
    //         if (cameraButton.classes['cameraButton-hidden'])
    //             cameraMenu.classes['cameraMenu-hidden'] = false;
    //     }
    // };

    // -----------------------------------------------------------------------------------------------------------------
    // user related models, profile with answers, credentials, etc.
    // -----------------------------------------------------------------------------------------------------------------

    $scope.responses = [];
    $scope.$root.userResponse = "hello";
    //$scope.credentials = { firstname: "", username: "", password: "", email: "", education: "", gender: "", dateOfBirth:"", age: "", weight: "", height: "", ethnicity: "", race: "", maritalstatus: "", fp_email: "", fp_DOB: "" };

    // -----------------------------------------------------------------------------------------------------------------
    // called when the user clicks the register button. registers the user into the server
    // -----------------------------------------------------------------------------------------------------------------


    //A function that will transfer the newUsersProgress to currentUserProgress upon login
    function transferUserProgress(xfrFromNewUser) {

        var tmpIndex = 0;

        //get last entry in audit array in current UserProgress
        var auditIndx = $scope.currentUserProgress.attributes.audit.length - 1;
        //console.log("last audit index:  " + auditIndx);

        //check if we need to transfer from new user progress if not then check if we need to transfer from tempUser Progress
        if (xfrFromNewUser) {
            //update the current user Progress from new user progress object
            $scope.currentUserProgress.attributes.audit[auditIndx] = $scope.newUserProgress.audit;
            /*console.log("pushing via new user progress:  ");
            console.log(typeof $scope.newUserProgress.audit.percentageComplete);*/
        } else {

            if ($scope.tempUserProgress.attributes.audit.length > 1) {
                var x = $scope.tempUserProgress.attributes.audit.length - 1;
                var audit = $scope.tempUserProgress.attributes.audit[x];
                if (audit.timestamp === "" && audit.percentageComplete === "0") {
                    tmpIndex = x - 1;
                } else {
                    tmpIndex = x;
                }
            }

            /*console.log("currentUserProgress: ");
             console.log($scope.currentUserProgress.attributes.audit[auditIndx]);
             console.log("audit index: ");
             console.log(auditIndx);
               console.log("tempUserProgress: ");
             console.log($scope.tempUserProgress.attributes.audit);
             console.log("tmp index: ");
             console.log(tmpIndex);
             */

            //update the current user Progress from new temp user progress object
            $scope.currentUserProgress.attributes.audit[auditIndx] = $scope.tempUserProgress.attributes.audit;

            //save the current user progress
            //save users progress
            //console.log( $scope.currentUserProgress);
            $scope.currentUserProgress.save().then(function (progress) {
                return console.log("Current users progress updated from temp user complete!");
            }, function (error) {
                return console.log("There was an error updating the user's progress from temp user.  Error: " + error);
            });

            /*console.log("pushing via temp user progress:  ");
            console.log(typeof $scope.newUserProgress.audit.percentageComplete);*/

            //clear temp scope variables
            $scope.tempUser = {};
            $scope.tempUserProgress = {};
        }
    };

    //helper function to transfer temp users responses to current user in DB
    function transferResFromTemp() {
        for (var i = 0; i < $scope.tmpRes.length; i++) {
            Parse.Cloud.run('addResponse', { elemID: $scope.tmpRes[i].elemID, answer: [$scope.tmpRes[i].answer] });
        }

        $scope.tmpRes = [];
    }

    $scope.register = function () {
        //$scope.credentials.responses = $scope.responses;

        $scope.credentials.tempUser = false;

        AuthService.register($scope.credentials).then(function (success) {
            $scope.currentUser = AuthService.currentUser();
            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "Your account has been created!"
            });

            $scope.mode.loggingIn = false;
            $scope.mode.register = false;
            $scope.mode.loggingOut = false;
            $scope.mode.forgotPW = false;
            // $scope.mode.forgotUN = false;
            $scope.mode.loginActivated = false;
            $scope.mode.updatePW = false;
            $scope.mode.isLoggedIn = true;
            $scope.mode.isTempUser = $scope.currentUser.object.attributes.tempUser;

            $scope.userGivenName = success.attributes.firstName;

            if ($scope.tmpRes.length > 0) {
                transferResFromTemp();
            }

            //create new progress object for the new user and set it to the currentUserProgress
            $scope.progressSrv.createProgress($scope.currentUser.object, $scope.currentUserProgress.attributes).then(function (progress) {

                $scope.currentUserProgress = {};
                $scope.currentUserProgress = progress;
                /* console.log("User Progress Created Successfully");
                 console.log($scope.currentUserProgress);*/
            }, function (error) {
                console.log("unsuccessful adding new progress");
            });
        }, function (error) {
            $scope.currentUser = AuthService.currentUser();
            $scope.addAlert({
                style: "alert-danger",
                type: "Error:",
                message: error
            });
        });
    };

    // -----------------------------------------------------------------------------------------------------------------
    // called when the user clicks the login button. logins the user into the site and creates a JWT
    // -----------------------------------------------------------------------------------------------------------------

    $scope.login = function () {
        return AuthService.login($scope.credentials).then(function (success) {
            //get previous User Object for Progress Obj transfer prep
            $scope.tempUser = $scope.currentUser;
            $scope.tempUserProgress = $scope.currentUserProgress;
            $scope.currentUser = AuthService.currentUser();
            $scope.mode.loggingIn = false;
            $scope.mode.register = false;
            $scope.mode.loggingOut = false;
            $scope.mode.forgotPW = false;
            // $scope.mode.forgotUN = false;
            $scope.updatePW = false;
            $scope.mode.loginActivated = false;
            $scope.mode.isLoggedIn = true;

            //todo: replace with addMultipleResponse when completed
            if ($scope.tmpRes.length > 0) {
                transferResFromTemp();
            }

            $scope.userGivenName = $scope.currentUser.object.attributes.firstName;
            $scope.mode.isTempUser = $scope.currentUser.object.attributes.tempUser;

            //if the current user is not temp and temp user is temp then set
            //func sign:  getUserProgress(usrObject, updateProgressFromNew - bool, updateProgressFromTemp - bool)

            if (!$scope.currentUser.object.attributes.tempUser && $scope.tempUser.object.attributes.tempUser) {
                //get the users progress when logged in successfully
                getUserProgress($scope.currentUser.object, false, true);
            } else {
                //get the users progress when logged in successfully
                getUserProgress($scope.currentUser.object, true, false);
            }

            //Parse.Cloud.run("transferResFromTemp", {tempUserID: $scope.tempUser.object.id});


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
        });
    };

    // -----------------------------------------------------------------------------------------------------------------
    // function called when the user clicks logout. removes JWT from the browser
    // -----------------------------------------------------------------------------------------------------------------

    $scope.logout = function () {
        return AuthService.logout().then(function (success) {
            $scope.currentUser = AuthService.currentUser();

            $scope.mode.loggingIn = false;
            $scope.mode.register = false;
            $scope.mode.loggingOut = false;
            $scope.mode.forgotPW = false;
            $scope.mode.forgotUN = false;
            $scope.mode.loginActivated = false;
            $scope.mode.isLoggedIn = false;
            $scope.userGivenName = "";

            $scope.addAlert({
                style: "alert-success",
                type: "Success!",
                message: "You have successfully logged out."
            });
            $state.go('home');
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

    // -----------------------------------------------------------------------------------------------------------------
    // function called whenever the answers of the user need to be saved onto the server
    // -----------------------------------------------------------------------------------------------------------------

    $scope.save = function () {
        if (!$scope.currentUser) return;

        $scope.currentUser.responses = $scope.responses;
        $scope.currentUser.save();
    };
    //new approach to survey list interaction
    // var selection;
    // $scope.setSelection = function(string_value) {
    //     // document.getElementsById(string_value);
    //     selection = string_value;
    // }
    // $scope.getSelection = function() {
    //     return selection;
    // }


    //Solution to print pages by url. (requires a url of the html file to be printed.
    function closePrint() {
        document.body.removeChild(this.__container__);
    }

    function setPrint() {
        this.contentWindow.__container__ = this;
        this.contentWindow.onbeforeunload = closePrint;
        this.contentWindow.onafterprint = closePrint;
        this.contentWindow.focus(); // Required for IE
        this.contentWindow.print();
    }

    $scope.printPage = function (sURL) {
        var oHiddFrame = document.createElement("iframe");
        oHiddFrame.onload = setPrint;
        oHiddFrame.style.visibility = "hidden";
        oHiddFrame.style.position = "fixed";
        oHiddFrame.style.right = "0";
        oHiddFrame.style.bottom = "0";
        oHiddFrame.src = sURL;
        document.body.appendChild(oHiddFrame);
    };
    // -----------------------------------------------------------------------------------------------------------------
    // function called to print properly the pages behind the virtual character
    // -----------------------------------------------------------------------------------------------------------------

    $scope.printContent = function () {
        var printWindow = window.open("", "_blank", "");
        printWindow.document.open();
        printWindow.document.write($rootScope.contentData.html);
        printWindow.document.close();
        printWindow.focus();
        //The Timeout is ONLY to make Safari work, but it still works with FF, IE & Chrome.
        setTimeout(function () {
            printWindow.print();
            printWindow.close();
        }, 100);
    };

    // -----------------------------------------------------------------------------------------------------------------
    // model containing the bar graph information to be displayed on the content view of the counseling site
    // -----------------------------------------------------------------------------------------------------------------

    $scope.redirect = function (location) {
        // store in browser cache the location
        localStorageService.set("redirect-page", location);
        $window.location.reload();
    };

    $scope.redirectNewTab = function (newTabUrl) {
        $window.open(newTabUrl, '_blank');
