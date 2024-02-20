/**
 * Class used to normalize speech transcripts so that they are easier to process.
 * @class 
 */
var MongoElementSpeechHandler = Class.create(
{
    initialize: function (jsonData) {
        var self = this;

        self.jsonData = jsonData;
    },

    /**
     * Converts raw speech transripts into a normalized version, i.e. numbers get converted to text.
     * 
     * @param  {String} text Raw transcript.
     * @return {String} text Normalized transcript.
     */
    cleanUserText : function(text)
    {
        var self = this;

        if(text.search(/\d/) != -1)
        {
            var match = text.match(/\dx/);
            if (match)
            {
                text = text.replace(match[0], match[0].charAt(0)+" times");
            }

            var match = text.match(/\d\d/);
            if (match) console.log("Here: "+match[0]);
            if (match && match[0] == "10")
            {
                text = text.replace(match[0], "ten");
            }

            console.log("Before: "+text);
            //find sets of 2 digits and put space between them
            var match = text.match(/\d\d/);
            while (match)
            {
                text = text.replace(match[0], match[0].charAt(0)+" "+match[0].charAt(1));
                match = text.match(/\d\d/);
            }
            console.log("After: "+text);


            //if there is a number
            console.log("Before replace: "+text);
            var match = text.match(/\d/);
            while (match)
            {
                text = text.replace(match[0], self.numMap[parseInt(match[0])]);
                console.log(match[0]);
                match = text.match(/\d/);
            }
            console.log("After replace: "+text);
        }

        return text;
    },

    evaluate : function(text)
    {
        console.log("Null choice");
        return null;
    }
});

/**
 * Handles the processing and storing of data from multiple choice data element types.
 * I.e. Question & Answer Radio buttons and checkboxes.  
 * @class
 * @augments MongoElementSpeechHandler 
 */
var MongoElement_MultiChoice = Class.create(MongoElementSpeechHandler,
{
    /**
     * Initialize Radio/Checkbox Question & Answer Data elements and maps
     * their answers.
     * @class
     * @param  {JSON} jsonData  a data element
     * @memberof MongoElement_MultiChoice#
     */
    initialize: function ($super, jsonData)
    {
        var self = this;

        $super(jsonData);

        //TODO multilanguage...
        self.numMap = ["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
        self.replacements = {};
        self.replacements["sex"] = "six";

        self.answerMatchHashmap = []; //used for matching user's speech to an answer
        self.wordsPerAnswer = []; //used for calculating the best match

        self.buildAnswerMatchHashmap();
    },

    /**
     * Maps answers to an easy to use Hashmap
     * @return {void} 
     *
     * @memberof MongoElement_MultiChoice#
     */
    buildAnswerMatchHashmap : function()
    {
        var self = this;

        self.answerMatchHashmap = []; //clear old map

        var test = "";

/*        console.log(self.jsonData);*/

        self.jsonData.content.forEach(function(answer, i) {
            //check if there are numbers inside the string
            if(answer.search(/\d/) != -1)
            {
                //if there is a number
                var match = answer.match(/\d+/g);

                //replace the number with its equivalent word i.e 1 = one
                answer = answer.replace(match[0], self.numMap[parseInt(match[0])]).replace(match[1], self.numMap[parseInt(match[1])]);
            }

            //replace usually misunderstood words
            for (var rep in self.replacements)
            {
                answer = answer.replace(rep, self.replacements[rep]);
            }

            //clean answer
            answer = answer.toLowerCase();
            answer = answer.replace(/[^\w\s]/gi, '');

            var answerSplit = answer.split(" ");

            for (var j=0; j<answerSplit.length; ++j)
            {
                var word = answerSplit[j];

                //check if word has been registered before, if not -> initialize
                if (!self.answerMatchHashmap.hasOwnProperty(word))
                {
                    self.answerMatchHashmap[word] = []; //initialize
                    // console.log("init??");
                }

                //check if we already added this answer number to the word (add only if not present)
                if (self.answerMatchHashmap[word].indexOf(i) < 0)
                {
                    self.answerMatchHashmap[word].push(i);
                    // console.log("pushed "+i+" for "+word);
                }

                test += "::"+word;
            }

            self.wordsPerAnswer[i] = answerSplit.length;
        });
    },

    /**
     * Checks the validity of the user speech transcript and
     * evaluates the score of the answer chosen.
     * 
     * @param  {String} text        raw speech transcript
     * @return {Int}    bestMatch   answer number that best matched user transcript.
     *
     * @memberof MongoElement_MultiChoice#
     */
    evaluate : function(text)
    {
        var self = this;

        //clean text
        text = text.toLowerCase();

        //check if there are numbers inside the string
        text = self.cleanUserText(text);

        var textSplit = text.split(" ");

        var answerVotes = [];
        for (var i=0; i<self.jsonData.content.length; ++i)
        {
            answerVotes[i] = 0; //init
        }

        //vote for answers
        for (var i=0; i<textSplit.length; ++i)
        {
            var word = textSplit[i];
            if (self.answerMatchHashmap.hasOwnProperty(word))
            {
                for (var j=0; j<self.answerMatchHashmap[word].length; ++j)
                {
                    answerVotes[self.answerMatchHashmap[word][j]]++;
                }
            }
        }

        //calculate score based on number of words in the answer
        var answerScores = [];
        for (var i=0; i<self.jsonData.content.length; ++i)
        {
            answerScores[i] = answerVotes[i]+answerVotes[i]/self.wordsPerAnswer[i];
        }

        var bestMatch = -1;
        var bestVote = 0;
        for (var i=0; i<self.jsonData.content.length; ++i)
        {
            var score = answerScores[i];
            //console.log(self.jsonData.content[i].answer_id + ":"+answerVotes[i]+" score:"+score);
            console.log("answer_id: " + answerVotes[i]+" score:"+score);

            if (score > bestVote)
            {
                bestVote = score;
                //bestMatch = self.jsonData.content[i].answer_id;
                bestMatch = i;
            }
        }

        if(self.hasDuplicateAnswers(answerScores, bestVote) && bestMatch != -1)
        {
            //set feedback mode to HINTS
            console.log("++++You have duplicates++++++");
            return null;
        }

        console.log("Matching answer: "+bestMatch+" with score "+bestVote);

        if (bestVote > 0.2) return bestMatch; //avoid silly matches

        return null;
    },

    /**
     * Secures that an answerScore is not calculated more than once
     * if there are duplicate words in the transcript
     * 
     * @param  {Array}   answers     A list of scores per answer
     * @param  {Int}     needle      threshold
     * @return {Boolean}             returns true if there are duplicates
     *
     * @memberof MongoElement_MultiChoice#
     */
    hasDuplicateAnswers : function(answers, needle)
    {
        var occurrences = 0;
        for(var i = 0; i < answers.length; ++i)
        {
            if(Math.abs(answers[i] - needle) < 0.0001)
            {
                occurrences++;
            }
        }

        return (occurrences >= 2); //needle occurs at least twice
    }
});
