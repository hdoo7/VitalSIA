var ResourceBox = Class.create
({
    initialize: function(requiredResources, providedResources, resourceNames, placeholders)
    {
        var self = this;
        
        self.required = requiredResources;
        self.provided = providedResources;
        self.names = resourceNames;

        self.placeholders = placeholders;
    }
});

var EventGuard = Class.create
({
    initialize: function(event, onTransition)
    {
        var self = this;

        if (onTransition === undefined) onTransition = function(m){};
        
        self.event = event;
        self.onTransition = onTransition; //a function that gets executed on transitioning
    },
    
    eval: function(events, memory)
    {
        var self = this;
        
        if (self.event === "lambda") return true;
        for (var i=0; i<events.length; ++i)
        {
            //console.log("checking events: " + self.event + " vs " + events[i]);
            if (self.event === events[i]) return true;
        }

        return false;
    },

    exec: function(memory)
    {
        var self = this;

        self.onTransition(memory);
    }
});

var ConditionGuard = Class.create
({
    initialize: function(f, onTransition)
    {
        var self = this;

        if (onTransition === undefined) onTransition = function(m){};
        
        self.f = f;
        self.onTransition = onTransition; //a function that gets executed on transitioning
    },
    
    eval: function(events, memory)
    {
        var self = this;
        
        return self.f(memory);
    },

    exec: function(memory)
    {
        var self = this;

        return self.onTransition(memory);
    }
});

var InterventionEngineState = Class.create
({
    initialize: function(memory, resBox)
    {
        var self = this;
        
        if (memory===undefined) memory = {};
        
        self.memory = memory;
        //self.defaultInternalState={};
    },
    
    initMemoValue: function(key, val)
    {
        var self = this;
        
        if (!(key in self.memory))
        {
            self.memory[key] = val;
        }
    },
    
    writeToMemo: function(key, val)
    {
        var self = this;
        
        self.memory[key] = val;
    },
    
    readFromMemo: function(key)
    {
        var self = this;
        
        return self.memory[key];
    },
    
    beforeExecution: function()
    {
        //may be overriden
    },
    
    afterExecution: function()
    {
        var self = this;
        
        //may be overriden
    },
    
    //returns true if done, false otherwise (returning false will keep calling the execute method)
    execute: function()
    {
        var self = this;
        
        return true;
    }
});

var InterventionEngineTransition = Class.create
({
    initialize: function(from, to, guard)
    {
        var self = this;
        
        self.from = from; //state transitioning from
        self.to = to; //state transitioning to
        self.guard = guard; //only transition if event happened (lambda constantly happens)
    },
    
    equals: function(t)
    {
        var self = this;
        
        if (self.from === t.from && self.to === t.to) return true;
        
        return false;
    }
});

var InterventionEngine = Class.create(InterventionEngineState, //inherits from State, so that we can have nested state machines
{
    initialize: function($super, memory)
    {
        var self = this;
        
        $super(memory);
        
        self.states = []; // (name: stateName, state: stateObject) values
        self.transitions = []; // (from: stateNamei, to: stateNamej, event: eventi])
        self.initialState = null;
        self.finalStates = [];
        self.currentState = null;
        
        self.internalStates = {
            EXECUTING_STATE: 0,
            EXECUTING_TRANSITION: 1
        };
        self.currentInternalState = self.internalStates.EXECUTING_STATE;
        
        self.eventsHappened = []; //shared by all submachines
    },
    
    addState: function(name, obj)
    {
        var self = this;
        
        if (name in self.states)
        {
            console.log("InterventionEngine: Duplicate state name: "+name+" !");
            return;
        }
        
        self.states[name] = obj;
        obj.eventsHappened = self.eventsHappened;
    },
    
    addTransition: function(from, to, guard)
    {
        var self = this;
        
        if(guard === undefined) guard = new EventGuard("lambda");
        
        var transition = new InterventionEngineTransition(from, to, guard);
        
        for (var i=0; i<self.transitions.length; ++i)
        {
            if (transition.equals(self.transitions[i]))
            {
                console.log("InterventionEngine: Transition from "+from+" to "+to+" already exists.");
                return;
            }
        }
        
        self.transitions.push(transition);
    },
    
    setInitialState: function(name)
    {
        var self = this;
        
        if (!(name in self.states))
        {
            console.log("InterventionEngine: Initial state name "+name+" not in state list.");
            return;
        }
        
        self.initialState = name;
        
        if (self.currentState === null)
        {
            self.currentState = self.initialState;
        }
    },
    
    setFinalState: function(name)
    {
        var self = this;
        
        if (!(name in self.states))
        {
            console.log("InterventionEngine: Final state name "+name+" not in state list.");
            return;
        }
        
        if (!self.isFinalState(name))
        {
            self.finalStates.push(name);
        }
    },
    
    isFinalState: function(name)
    {
        var self = this;
        
        for (var i=0; i<self.finalStates.length; ++i)
        {
            if (self.finalStates[i] === name) return true;
        }
        return false;
    },
    
    beforeExecution: function($super)
    {
        var self = this;
        
        $super();
        
        self.currentState = self.initialState;
        self.currentInternalState = self.internalStates.EXECUTING_STATE;
    },
    
    execute: function() //overrides execute method of InterventionEngineState
    {
        var self = this;
        
        if (self.currentState === null)
        {
            console.log("InterventionEngine: Current state is null, cannot execute !");
            return false;
        }
        
        if (self.currentInternalState == self.internalStates.EXECUTING_STATE)
        {
            if (self.states[self.currentState].execute())
            {
                self.states[self.currentState].afterExecution(); //call after execution method on state
                self.currentInternalState = self.internalStates.EXECUTING_TRANSITION; //state returned true, go to transition mode
            }
        }
        
        if (self.currentInternalState == self.internalStates.EXECUTING_TRANSITION)
        {
            //iterate through available transitions to check where execution can flow to
            for (var i=0; i<self.transitions.length; ++i)
            {
                //if there is a transition following this state and its guards evaluates to true
                if ((self.transitions[i].from === self.currentState) && (self.transitions[i].guard.eval(self.eventsHappened, self.memory)))
                {
                    self.transitions[i].guard.exec(self.memory); //execute any function that may be associated with the transition

                    //we have a match, do the transition
                    self.currentState = self.transitions[i].to;
                    self.currentInternalState = self.internalStates.EXECUTING_STATE; //go to state execution mode
                    self.states[self.currentState].beforeExecution();
                    break;
                }
            }

            self.clearEvents(); //discard events, because we assume that they have been taken into consideration in this step
        }
        
        if (self.isFinalState(self.currentState))
        {
            return true; //continue in higher level
        }
        
        return false; //keep executing
    },
    
    reset: function()
    {
        var self = this;
        
        self.currentState = null;
    },
    
    sendEvent: function(event)
    {
        var self = this;
        
        self.eventsHappened.push(event);
    },
    
    clearEvents: function()
    {
        var self = this;
        
        self.eventsHappened.length = 0;
    }
});

//****************************************************************************************************//
//****************************************************************************************************//

var InterviewAnswer = Class.create
({
    initialize: function(id, text, riskScore)
    {
        var self = this;
        
        self.id = parseInt(id);
        self.text = text;
        self.riskScore = parseInt(riskScore);
    },
    
    toString: function()
    {
        var self = this;
        
        return " ["+self.id+" / risk: "+self.riskScore+"]"+self.text;
    }
});

var InterviewQuestion = Class.create
({
    initialize: function(id, text)
    {
        var self = this;
        
        self.id = parseInt(id);
        self.text = text;
        self.answers = [];
    },
    
    addAnswer: function(answer)
    {
        var self = this;
        
        self.answers.push(answer);
    },
    
    getRiskScoreById: function(answerId)
    {
        var self = this;
        
        for (var i=0; i<self.answers.length; ++i)
        {
            if (self.answers[i].id === answerId)
            {
                return self.answers[i].riskScore;
            }
        }
        
        return 0;
    },
    
    toString: function()
    {
        var self = this;
        
        var result = "["+self.id+"] "+self.text;
        for (var i=0; i<self.answers.length; ++i)
        {
            result += "\n"+self.answers[i].toString();
        }
        
        return result;
    }
});

var InterventionScores = Class.create
({
    initialize: function(nrOfQuestions)
    {
        var self = this;

        self.nrOfQuestions = nrOfQuestions;

        self.answerScores = [];
        for (var i=0; i<nrOfQuestions; ++i) self.answerScores.push(0);
    },

    set: function(answerNumber, score)
    {
        var self = this;

        self.answerScores[answerNumber] = score;
    },

    getTotalScore: function()
    {
        var self = this;

        var sum = 0;
        for (var i=0; i<self.nrOfQuestions; ++i)
        {
            sum += self.answerScores[i];
        }

        return sum;
    }
});

var Placeholder = Class.create
({
    initialize: function(val)
    {
        var self = this;

        if (val === undefined) self.values = [];
        else self.values = [val];
    },
    
    addValues : function(value)
    {
        var self = this;
        
        self.values.push(value);
    },
    
    get : function()
    {
        var self = this;
        self.getRandomValue(); 
    },
    
    getRandomValue : function()
    {
        var self = this;
        return self.values[Math.floor(Math.random() * self.values.length)];
    }
});

//****************************************************************************************************//
//****************************************************************************************************//

var State_TurnOnMicrophone = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox)
    {
        var self = this;
        
        $super(memory, resBox);
        
        self.P_micState = resBox.provided[resBox.names.P_MICSTATE];
    },
    
    execute: function()
    {
        var self = this;
        
        //console.log("State_TurnOnMicrophone");
        
        self.P_micState.container.state = true;
        return true;
    }
});

var State_TurnOffMicrophone = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox)
    {
        var self = this;
        
        $super(memory);
        
        self.P_micState = resBox.provided[resBox.names.P_MICSTATE];
    },
    
    execute: function()
    {
        var self = this;
        
        //console.log("State_TurnOffMicrophone");
        
        self.P_micState.container.state = false;
        return true;
    }
});

var State_CharacterSay = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox, phrase) //, R_charSpeaking, P_charText)
    {
        var self = this;
        
        $super(memory, resBox);
        
        self.phrase = phrase;
        self.R_charSpeaking = resBox.required[resBox.names.R_CHARSPEAKING];
        self.P_charText = resBox.provided[resBox.names.P_CHARTEXT];
        self.talked = false; //flag to only say the phrase once
        self.waitingToSpeak = false; //flag to indicate that the character should start speaking soon (when audio gets loaded)
    },
    
    beforeExecution: function()
    {
        var self = this;
        
        self.talked = false;
        self.waitingToSpeak = false;
    },
    
    execute: function()
    {
        var self = this;
        
        if (!self.talked)
        {
            self.P_charText.container.text = self.phrase;
            self.P_charText.container.timestamp = Date.now();
            self.talked = true;
            self.waitingToSpeak = true;
        }
        else
        {
            if (self.R_charSpeaking.container.speaking)
            {
                self.waitingToSpeak = false; //the character actually began to speak
            }
            
            //if wait time is over, and she's no longer speaking
            if (!self.waitingToSpeak && !self.R_charSpeaking.container.speaking)
            {
                return true; //exit state
            }
        }
        
        return false; //continue to iterate
    }
});

var State_AskQuestion = Class.create(State_CharacterSay,
{
    initialize: function($super, memory, resBox, question)
    {
        var self = this;
        
        $super(memory, resBox, question.text);
    }
});

var State_CharacterSayPlaceholderRandom = Class.create(State_CharacterSay,
{
    initialize: function($super, memory, resBox, placeholder)
    {
        var self = this;

        self.placeholder = placeholder;

        $super(memory, resBox, question.text);
    },

    beforeExecution: function($super)
    {
        var self = this;

        self.phrase = self.placeholder.getRandomValue();

        $super();
    }
});

var State_CharacterSayPlaceholderRandomWithSubtitles = Class.create(State_CharacterSayPlaceholderRandom,
{
    initialize: function($super, memory, resBox, placeholder)
    {
        var self = this;

        $super(memory, resBox, placeholder);

        self.P_subs = resBox.provided[resBox.names.P_QA];
    },

    execute: function($super)
    {
        var self = this;

        self.P_subs.container.questionId = -1;
        self.P_subs.container.question = self.phrase;
        self.P_subs.container.answers = []; //clear old answers
        self.P_subs.container.timestamp = Date.now();

        return $super();
    }
});

var State_ShowQuestionAndAnswers = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox, question)
    {
        var self = this;
        
        self.question = question;
        self.P_qa = resBox.provided[resBox.names.P_QA];
    },
    
    execute: function()
    {
        var self = this;
        
        self.P_qa.container.questionId = self.question.id;
        self.P_qa.container.question = self.question.text;
        self.P_qa.container.answers = []; //clear old answers
        for (var i=0; i<self.question.answers.length; ++i)
        {
            self.P_qa.container.answers[self.question.answers[i].id] = self.question.answers[i].text;
        }
        self.P_qa.container.timestamp = Date.now();
        
        return true;
    }
});

var State_ProcessUserAnswer = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox, question)
    {
        var self = this;
        
        self.memory = memory;
        self.R_userChoice = resBox.required[resBox.names.R_USERCHOICE];
        self.P_questionInfo = resBox.provided[resBox.names.P_CRTQUESTIONINFO];
        self.P_answerInfo = resBox.provided[resBox.names.P_CRTANSWERINFO];
        self.question = question;
        self.timeEnteredState = Date.now();
    },
    
    beforeExecution: function()
    {
        var self = this;
        
        self.timeEnteredState = Date.now();
        self.memory["lastUserAnswerId"] = -1;
    },
    
    execute: function()
    {
        var self = this;
        
        if (self.R_userChoice.container.timestamp > self.timeEnteredState)
        {
            self.memory["currentAnswerRiskScore"] = self.question.getRiskScoreById(self.R_userChoice.container.choice);
            self.memory["lastUserAnswerId"] = self.R_userChoice.container.choice;

            //transmit information about current question and answer
            self.P_questionInfo.container.id = self.question.id;
            self.P_questionInfo.container.nrOfAnswers = self.question.answers.length;
            self.P_questionInfo.container.timestamp = Date.now();
            self.P_answerInfo.container.id = self.memory["lastUserAnswerId"];
            self.P_answerInfo.container.riskScore = self.memory["currentAnswerRiskScore"];
            self.P_answerInfo.container.timestamp = Date.now();
            return true;
        }
        else
        {
            return false; //keep waiting for user to answer
        }
    }
});

var State_WaitToVerifyUserAnswer = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox, timeToWait, cancelCommands)
    {
        var self = this;
        
        self.timeEnteredState = Date.now();
        self.lastCheckedInterimText = Date.now();
        self.timeToWait = timeToWait;
        self.cancelCommands = cancelCommands;
        self.R_interimUserText = resBox.required[resBox.names.R_INTERIMUSERTEXT];
        self.memory = memory;
    },
    
    beforeExecution: function()
    {
        var self = this;
        
        self.lastCheckedInterimText = Date.now();
        self.timeEnteredState = Date.now();
        self.memory["answerVerified"] = false;
    },
    
    execute: function()
    {
        var self = this;
        
        if (Date.now() - self.timeEnteredState > self.timeToWait)
        {
            self.memory["answerVerified"] = true;
            return true;
        }
        else
        {
            //check if user uttered any commands to cancel the choice
            //cancelCommands
            //self.R_interimUserText
            if (self.R_interimUserText.container.timestamp > self.lastCheckedInterimText)
            {
                self.lastCheckedInterimText = self.R_interimUserText.container.timestamp;
                
                var interimWords = self.R_interimUserText.container.text.toLowerCase().split(" ");
                for (var i=0; i<interimWords.length; ++i)
                {
                    for (var j=0; j<self.cancelCommands.length; ++j)
                    {
                        if (interimWords[i] === self.cancelCommands[j])
                        {
                            self.memory["answerVerified"] = false;
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }
});

var State_CumulateRiskScore = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox)
    {
        var self = this;
        
        self.P_interviewRiskScore = resBox.provided[resBox.names.P_RISKSCORE];
        self.memory = memory;
    },
    
    execute: function()
    {
        var self = this;

        console.log("cumulate risk score: " + self.memory["currentQuestionNumber"] + " " + self.memory["currentAnswerRiskScore"]);
        self.memory["cumulativeRiskScore"].set(self.memory["currentQuestionNumber"], self.memory["currentAnswerRiskScore"]);

        self.P_interviewRiskScore.container.riskScore = self.memory["cumulativeRiskScore"].getTotalScore();
        
        return true;
    }
});

var State_ShowReferralSources = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox)
    {
        var self = this;

        self.memory = this;
        self.referralRes = resBox.provided[resBox.names.P_REFERRALSTATUS];
    },

    execute: function()
    {
        var self = this;
        self.referralRes.container.visible = true;
        self.referralRes.container.timestamp = Date.now();
        return true;
    }
});

var State_HideReferralSources = Class.create(InterventionEngineState,
{
    initialize: function($super, memory, resBox)
    {
        var self = this;

        self.memory = this;
        self.referralRes = resBox.provided[resBox.names.P_REFERRALSTATUS];
    },

    execute: function()
    {
        var self = this;
        self.referralRes.container.visible = false;
        self.referralRes.container.timestamp = Date.now();
        return true;
    }
});

//****************************************************************************************************//
//****************************************************************************************************//

var Procedure_CharacterSayPlaceholderNoMicrophone = Class.create(InterventionEngine,
{
    initialize: function($super, memory, resBox, phrase, subtitles)
    {
        var self = this;

        if (subtitles === undefined) subtitles = false;

        $super(memory);

        self.addState("start", new InterventionEngineState(memory));
        self.addState("turnOffMicrophone", new State_TurnOffMicrophone(memory, resBox));
        if (subtitles) self.addState("say", new State_CharacterSayPlaceholderRandomWithSubtitles(memory, resBox, phrase));
        else self.addState("say", new State_CharacterSayPlaceholderRandom(memory, resBox, phrase));
        self.addState("turnOnMicrophone", new State_TurnOnMicrophone(memory, resBox));
        self.addState("end", new InterventionEngineState(memory));

        self.addTransition("start", "turnOffMicrophone");
        self.addTransition("turnOffMicrophone", "say");
        self.addTransition("say", "turnOnMicrophone");
        self.addTransition("turnOnMicrophone", "end");

        self.setInitialState("start");
        self.setFinalState("end");
    }
});

var Procedure_CharacterSayNoMicrophone = Class.create(InterventionEngine,
{
    initialize: function($super, memory, resBox, phrase)
    {
        var self = this;

        $super(memory);

        self.addState("start", new InterventionEngineState(memory));
        self.addState("turnOffMicrophone", new State_TurnOffMicrophone(memory, resBox));
        self.addState("say", new State_CharacterSay(memory, resBox, phrase));
        self.addState("turnOnMicrophone", new State_TurnOnMicrophone(memory, resBox));
        self.addState("end", new InterventionEngineState(memory));

        self.addTransition("start", "turnOffMicrophone");
        self.addTransition("turnOffMicrophone", "say");
        self.addTransition("say", "turnOnMicrophone");
        self.addTransition("turnOnMicrophone", "end");

        self.setInitialState("start");
        self.setFinalState("end");
    }
});

var Procedure_SayMultiplePlaceholdersWithSubtitlesNoMicrophone = Class.create(InterventionEngine,
{
    initialize: function($super, memory, resBox, placeholders)
    {
        var self = this;

        $super(memory);

        self.addState("start", new InterventionEngineState(memory, resBox));
        self.addState("turnOffMicrophone", new State_TurnOffMicrophone(memory, resBox));
        for (var i=0; i<placeholders.length; ++i)
        {
            self.addState("sentence"+i, new State_CharacterSayPlaceholderRandomWithSubtitles(memory, resBox, placeholders[i]));
        }
        self.addState("turnOnMicrophone", new State_TurnOnMicrophone(memory, resBox));
        self.addState("end", new InterventionEngineState(memory, resBox));

        if (placeholders.length>0)
        {
            self.addTransition("start", "turnOffMicrophone");
            self.addTransition("turnOffMicrophone", "sentence0");
            for (var i=0; i<placeholders.length-1; ++i)
            {
                self.addTransition("sentence"+i, "sentence"+(i+1));
            }
            self.addTransition("sentence"+(placeholders.length-1), "turnOnMicrophone");
            self.addTransition("turnOnMicrophone", "end");
        }
        else self.addTransition("start", "end");
        
        self.setInitialState("start");
        self.setFinalState("end");
    }
});

var Procedure_AskInterviewQuestion = Class.create(InterventionEngine,
{
    initialize: function($super, memory, resBox, question, qNr, canGoBack)
    {
        var self = this;

        if (canGoBack === undefined) canGoBack = true;

        $super(memory);

        self.qNr = qNr;
        self.canGoBack = canGoBack;
        
        self.addState("start", new InterventionEngineState(memory, resBox));
        self.addState("turnOffMicrophone", new State_TurnOffMicrophone(memory, resBox));
        self.addState("showQuestionAndAnswers", new State_ShowQuestionAndAnswers(memory, resBox, question));
        self.addState("askQuestion", new State_AskQuestion(memory, resBox, question));
        self.addState("turnOnMicrophone", new State_TurnOnMicrophone(memory, resBox));
        self.addState("processUserAnswer", new State_ProcessUserAnswer(memory, resBox, question));
        self.addState("didNotUnderstand", new Procedure_CharacterSayPlaceholderNoMicrophone(memory, resBox, resBox.placeholders["Misunderstanding"], true));
        self.addState("showQuestionAndAnswersAgain", new State_ShowQuestionAndAnswers(memory, resBox, question));
        if (self.canGoBack) self.addState("verifyGoBack", new Procedure_CharacterSayNoMicrophone(memory, resBox, "Do you want to go back one question ?"));
        if (self.canGoBack) self.addState("sayNotGoingBack", new Procedure_CharacterSayNoMicrophone(memory, resBox, "Oh, ok!"));
        self.addState("waitToVerifyUserAnswer", new State_WaitToVerifyUserAnswer(memory, resBox, 2000, ["no", "not", "stop", "wait", "well", "actually"]));
        self.addState("answerNotValidated", new Procedure_CharacterSayPlaceholderNoMicrophone(memory, resBox, resBox.placeholders["ResetAnswerChoice"], true));
        self.addState("cumulateRiskScore", new State_CumulateRiskScore(memory, resBox));
        self.addState("end", new InterventionEngineState(memory, resBox));
        
        self.addTransition("start", "turnOffMicrophone");
        self.addTransition("turnOffMicrophone", "showQuestionAndAnswers");
        self.addTransition("showQuestionAndAnswers", "askQuestion");
        self.addTransition("askQuestion", "turnOnMicrophone");
        self.addTransition("turnOnMicrophone", "processUserAnswer");
        if (self.canGoBack) self.addTransition("processUserAnswer", "verifyGoBack", new EventGuard("goToPreviousQuestion")); //before going to "did not understand"
        if (self.canGoBack) self.addTransition("verifyGoBack", "end", new EventGuard("goBackOneQuestionConfirmed", function(m){m["goBackOneQuestion"]=true;}));
        if (self.canGoBack) self.addTransition("verifyGoBack", "sayNotGoingBack", new EventGuard("goBackOneQuestionCanceled", function(m){m["goBackOneQuestion"]=false;}));
        if (self.canGoBack) self.addTransition("sayNotGoingBack", "showQuestionAndAnswersAgain");
        self.addTransition("processUserAnswer", "didNotUnderstand", new ConditionGuard(function(m){return m["lastUserAnswerId"]==-1;}));
        self.addTransition("didNotUnderstand", "showQuestionAndAnswersAgain");
        self.addTransition("showQuestionAndAnswersAgain", "processUserAnswer");
        self.addTransition("processUserAnswer", "waitToVerifyUserAnswer", new ConditionGuard(function(m){return m["lastUserAnswerId"]>-1;}));
        self.addTransition("waitToVerifyUserAnswer", "answerNotValidated", new ConditionGuard(function(m){return !m["answerVerified"];}));
        self.addTransition("waitToVerifyUserAnswer", "cumulateRiskScore", new ConditionGuard(function(m){return m["answerVerified"];}));
        self.addTransition("answerNotValidated", "showQuestionAndAnswersAgain");
        self.addTransition("cumulateRiskScore", "end");
        
        self.setInitialState("start");
        self.setFinalState("end");
    },

    beforeExecution: function($super)
    {
        var self = this;

        $super();

        self.memory["currentQuestionNumber"] = self.qNr;
        self.memory["goBackOneQuestion"] = false;
    }
});

var Procedure_DCU_Audit = Class.create(InterventionEngine,
{
    initialize: function($super, memory, resBox, QAs)
    {
        var self = this;
        
        $super(memory);
        
        memory["currentAnswerRiskScore"] = 0;
        memory["cumulativeRiskScore"] = new InterventionScores(QAs.length);
        memory["currentQuestionNumber"] = -1;
        memory["lastUserAnswerId"] = -1;
        memory["answerVerified"] = false;
        memory["goBackOneQuestion"] = false;
        
        self.addState("start", new InterventionEngineState(memory, resBox));
        self.addState("turnOffMicrophone", new State_TurnOffMicrophone(memory, resBox));
        self.addState("greetUser", new Procedure_SayMultiplePlaceholdersWithSubtitlesNoMicrophone(memory, resBox, resBox.placeholders["GreetUser"])); //todo change english text
        for (var i=0; i<QAs.length; ++i)
        {
            if (i==0) self.addState("question"+i, new Procedure_AskInterviewQuestion(memory, resBox, QAs[i], i, false)); //remove ability to go back one question
            else self.addState("question"+i, new Procedure_AskInterviewQuestion(memory, resBox, QAs[i], i));
        }
        self.addState("lowRangeFeedback", new Procedure_SayMultiplePlaceholdersWithSubtitlesNoMicrophone(memory, resBox, resBox.placeholders["LowRangeFeedback"])); //todo change english text
        self.addState("showMediumReferralSources", new State_ShowReferralSources(memory, resBox));
        self.addState("mediumRangeFeedback", new Procedure_SayMultiplePlaceholdersWithSubtitlesNoMicrophone(memory, resBox, resBox.placeholders["MediumRangeFeedback"])); //todo change english text
        self.addState("showHighReferralSources", new State_ShowReferralSources(memory, resBox));
        self.addState("highRangeFeedback", new Procedure_SayMultiplePlaceholdersWithSubtitlesNoMicrophone(memory, resBox, resBox.placeholders["HighRangeFeedback"])); //todo change english text
        self.addState("end", new InterventionEngineState(memory, resBox));
        
        if (QAs.length > 0)
        {
            self.addTransition("start", "turnOffMicrophone"); //disable microphone
            self.addTransition("turnOffMicrophone", "greetUser"); //greet the user
            //make transitions between questions
            self.addTransition("greetUser", "question"+0);
            for (var i=0; i<QAs.length-1; ++i)
            {
                //if user answers no to first question (0 risk score), stop intervention
                if (i==0)
                {
                    self.addTransition("question"+(i+1), "question"+i, new ConditionGuard(function(m){return m["goBackOneQuestion"];})); //first transition to check
                    self.addTransition("question"+i, "question"+(i+1), new ConditionGuard(function(m){return m["cumulativeRiskScore"].getTotalScore()>0 && !m["goBackOneQuestion"];}));
                    self.addTransition("question"+i, "lowRangeFeedback", new ConditionGuard(function(m){return m["cumulativeRiskScore"].getTotalScore()==0;}));
                }
                else
                {
                    self.addTransition("question"+(i+1), "question"+i, new ConditionGuard(function(m){return m["goBackOneQuestion"];}));
                    self.addTransition("question"+i, "question"+(i+1), new ConditionGuard(function(m){return !m["goBackOneQuestion"]}));
                }
            }
            //direct user to feedback, based on score
            self.addTransition("question"+(QAs.length-1), "lowRangeFeedback", new ConditionGuard(function(m){return m["cumulativeRiskScore"].getTotalScore()<=8;}));
            self.addTransition("question"+(QAs.length-1), "showMediumReferralSources", new ConditionGuard(function(m){return m["cumulativeRiskScore"].getTotalScore()>8 && m["cumulativeRiskScore"].getTotalScore()<=13;}));
            self.addTransition("question"+(QAs.length-1), "showHighReferralSources", new ConditionGuard(function(m){return m["cumulativeRiskScore"].getTotalScore()>13;}));
            
            //end audit
            self.addTransition("lowRangeFeedback", "end");
            self.addTransition("showMediumReferralSources", "mediumRangeFeedback");
            self.addTransition("mediumRangeFeedback", "end");
            self.addTransition("showHighReferralSources", "highRangeFeedback");
            self.addTransition("highRangeFeedback", "end");
        }
        else
        {
            self.addTransition("start", "end");
        }
        
        self.setInitialState("start");
        self.setFinalState("end");
    },
    
});
