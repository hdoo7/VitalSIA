<?php

class Answer
{
    protected $answerID = -1;
    protected $answerText = '';
    protected $riskScore = 0;
    
    function __construct($answerID, $answerText, $riskScore)
    {
        $this->answerID = $answerID;
        $this->answerText = $answerText;
        $this->riskScore = $riskScore;
    }
    
    function appendXMLTo($sxe)
    {
        $ans = $sxe->addChild('answer');
        $ans->addAttribute('id', $this->answerID);
        $ans->addAttribute('text', $this->answerText);
        $ans->addAttribute('riskScore', $this->riskScore);
    }
}

class Question
{
    protected $questionID = -1;
    protected $questionText = '';
    protected $answers = [];
    
    function __construct($questionID, $questionText)
    {
        $this->questionID = $questionID;
        $this->questionText = $questionText;
    }
    
    function addAnswer($answer)
    {
        $this->answers[] = $answer;
    }
    
    function appendXMLTo($sxe)
    {
        $que = $sxe->addChild('question');
        $que->addAttribute('id', $this->questionID);
        $que->addAttribute('text', $this->questionText);
        foreach ($this->answers as $ans)
        {
            $ans->appendXMLTo($que);
        }
    }
}

class Feedback
{
    protected $feedbackText = '';
    protected $feedbackName = '';
    
    function __construct($feedbackText,$feedbackName)
    {
        $this->feedbackText = $feedbackText;
        $this->feedbackName = $feedbackName;
    }
    
    function appendXMLTo($sxe)
    {
        $que = $sxe->addChild($this->feedbackName);
        $que->addAttribute('text', $this->feedbackText);
    }
}

?>
