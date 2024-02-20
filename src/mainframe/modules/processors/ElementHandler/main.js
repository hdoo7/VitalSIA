/**
 * Class that handles the sending and retrieving of data elements
 * to angular html elements.
 *
 * @class
 * @augments AbstractModule
 */
var ElementHandler = Class.create(AbstractModule,
        {
            /**
             * Initializes the element handler and retrieves the
             * scope of data element controller.
             * @return {void}
             *
             * @membeof ElementHandler#
             */
            initialize: function($super, params)
            {
                var self = this;
                $super(params);

                self.name = "ElementHandler"; //unknown name, to be overriden by subclasses
                self.type = ModuleType.Processor; //unknown type, to be overriden
                self.mandatory = false; //is this model mandatory ? to be overriden

                self.resourceNames = {
                    R_ELEMENTJSON: 0,
                    R_USERTEXT: 1,
                    R_ELEMENTITERATION: 2,

                    P_USERCHOICE: 0
                };

                self.requiredResources[self.resourceNames.R_ELEMENTJSON] = new MongoElementJSON();
                self.requiredResources[self.resourceNames.R_USERTEXT] = new UserText();
                self.optionalResources[self.resourceNames.R_USERTEXT] = new UserText(); //make optional
                self.requiredResources[self.resourceNames.R_ELEMENTITERATION] = new MongoElementIteration();
                self.optionalResources[self.resourceNames.R_ELEMENTITERATION] = new MongoElementIteration(); //make optional

                self.providedResources[self.resourceNames.P_USERCHOICE] = new UserInterviewChoice();

                self.angularScope = null;
                self.controllerScope = null;
                self.lastAngularUpdate = 0;
                self.lastUserSpoke = 0;
                self.lastInput = 0;
                self.elementSpeechHandler = null;

                self.getAngularElement();
            },

            /**
             * Finds the scope of the controller used to display
             * data elements.
             *
             * @return {void}
             *
             * @memberof ElementHandler#
             */
            getAngularElement : function()
            {
                var self = this;

                var appElement = document.querySelector('[id=inputPanel]');//webgl-app]');
                //console.log("appElement"+appElement);
                var scope = angular.element(appElement).scope();

                if(scope === undefined)
                {
                    setTimeout(function() {
                        self.getAngularElement();
                    }, 10);
                    return;
                }

                self.controllerScope = scope;
                //console.log("ElementHandler line 76:" + scope);
                self.angularScope = scope.$root;
                //console.log("ElementHandler line 78:" + self.angularScope);
            },

            /**
             * ElementHandler step function called by the mainframe; updates controller variables for
             * user response and appropriate json.
             *
             * @return {void}
             *
             * @memberof ElementHandler#
             */
            run: function()
            {
                var self = this;

                if(self.angularScope != null)
                {

                    //console.log("going into if(self.angularScope != null): line 93 ");
                    //this block handles speech
                    if (self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp > self.lastUserSpoke)
                    {
                        //console.log("going into if (self.requiredResources[self.resourceNames.R_USERTEXT].container.timestamp > self.lastUserSpoke): line 98 ");
                        try{
                            var userChoice = self.elementSpeechHandler.evaluate(self.requiredResources[self.resourceNames.R_USERTEXT].container.text);

                            self.providedResources[self.resourceNames.P_USERCHOICE].container.choice = userChoice; //initial value, could be updated in the following loop

                            self.angularScope.$apply(function() {
                                self.angularScope.userResponse = userChoice;
                            });

                            //update resource
                            var rightNow = Date.now();
                            self.providedResources[self.resourceNames.P_USERCHOICE].container.timestamp = rightNow;
                            self.lastUserSpoke = rightNow;
                        }catch(error){
                            console.log(error);
                        }
                    }

                    //if got new input from UI (angular timestamp was updated)
                    if(self.angularScope.directInputTimestamp > self.lastInput)
                    {
                        //console.log("going into if(self.angularScope.directInputTimestamp > self.lastInput): line 120");

                        //console.log("Got new input");
                        self.providedResources[self.resourceNames.P_USERCHOICE].container.choice = self.angularScope.userResponse;

                        var rightNow = Date.now();
                        self.providedResources[self.resourceNames.P_USERCHOICE].container.timestamp = rightNow;
                        self.lastInput = rightNow;
                    }

                    if (self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.timestamp > self.lastAngularUpdate)
                    {
                        //console.log("going into if: line 132");
                        self.angularScope.$apply(function(){

                            if(self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json.type == "Content"){
                                //console.log("going into if: line 137");

                                self.angularScope.contentData = self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json;

                                if(self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json["html"] == "") {
                                    //console.log("going into if: line 142");
                                    self.controllerScope.toggleFullscreen(true);
                                } else self.controllerScope.toggleFullscreen(false);

                            } else self.angularScope.elementData = self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json;

                            //process by type
                            var elemType = self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json.type;
                            if (elemType == "QuestionAnswer" || elemType == "MenuElement" || elemType == "MenuWithCompletion" || elemType == "QuestionAnswer-Checkbox")
                            {
                                //console.log("going into if: line 151");
                                self.elementSpeechHandler = new MongoElement_MultiChoice(self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json);
                            }else if (elemType == "SpeechPause"){
                                //console.log("we are in the speechPause if-else");
                                var pause = self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json.object.attributes.pauseDuration;
                                /*setTimeout(function() {
                                    //sitIdle
                                    self.elementSpeechHandler = new MongoElement_MultiChoice(self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json);
                                    console.log("completed pause");
                                }, pause);*/
                            }
                            //console.log("completed speechPause if-else");
                            //TODO Rest of types...
                            //TODO set from history, if exists
                            //self.angularScope.userResponse = ...;
                            //TODO else...
                            //self.angularScope.userResponse = null;
                            self.angularScope.updateUserResponseFromLocal(self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.json._id);

                        });
                        self.lastAngularUpdate = self.requiredResources[self.resourceNames.R_ELEMENTJSON].container.timestamp;
                    }

                    //update element iteration in elementData. this is done continuously, and only used when needed in the interface
                    self.angularScope.$apply(function () {
                        self.angularScope.elementIteration = self.requiredResources[self.resourceNames.R_ELEMENTITERATION].container.iter;
                        //console.log(self.angularScope.elementIteration);
                    });
                }
            }
        });