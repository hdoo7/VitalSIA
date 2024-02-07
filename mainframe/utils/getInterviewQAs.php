<?php

require_once(__DIR__."/../main.config.php");
require_once(__DIR__."/Counselling.classes.php");

//connection to the database
$dbhandle = mysql_connect($db_hostname, $db_username, $db_password) or die("Unable to connect to database.");

//select a database to work with
$selected = mysql_select_db($db_database,$dbhandle) or die("Could not select database.");

//execute the SQL query and return records
$lang = 13; //en-US
$topicID = 1;
$interviewID = 1;

$allQuestionsWithAnswersForFirstTopicInterview = 'SELECT
InterviewQuestions.idInterviewQuestion AS idQU, InterviewQuestionTranslations.text AS textQU,
InterviewQuestionAnswers.idInterviewQuestionAnswer AS idAN, InterviewQuestionAnswerTranslations.text AS textAN,
InterviewQuestions.order AS orderQU, InterviewQuestionAnswers.order AS orderAN, InterviewQuestionAnswers.riskScore AS riskAN
FROM
(
    (
        (InterviewQuestionAnswerTranslations INNER JOIN InterviewQuestionAnswers ON InterviewQuestionAnswerTranslations.idInterviewQuestionAnswer=InterviewQuestionAnswers.idInterviewQuestionAnswer)
        INNER JOIN
        (InterviewQuestionTranslations INNER JOIN InterviewQuestions ON InterviewQuestionTranslations.idInterviewQuestion=InterviewQuestions.idInterviewQuestion)
        ON InterviewQuestionAnswers.idInterviewQuestion=InterviewQuestions.idInterviewQuestion
    )
    INNER JOIN
    (InterviewTranslations INNER JOIN Interviews ON InterviewTranslations.idInterview=Interviews.idInterview)
    ON InterviewQuestions.idInterview=Interviews.idInterview
)
INNER JOIN
(CounsellingTopicTranslations INNER JOIN CounsellingTopics ON CounsellingTopicTranslations.idCounsellingTopic=CounsellingTopics.idCounsellingTopic)
ON Interviews.idCounsellingTopic=CounsellingTopics.idCounsellingTopic

WHERE
CounsellingTopicTranslations.idLanguage='.$lang.' AND InterviewTranslations.idLanguage='.$lang.' AND InterviewQuestionTranslations.idLanguage='.$lang.' AND InterviewQuestionAnswerTranslations.idLanguage='.$lang.'
AND CounsellingTopics.idCounsellingTopic='.$topicID.'
AND Interviews.idInterview='.$interviewID.'

ORDER BY orderQU, orderAN;';

$result = mysql_query($allQuestionsWithAnswersForFirstTopicInterview);

//close the connection
mysql_close($dbhandle);

$questions = [];
//fetch tha data from the database 
while ($row = mysql_fetch_array($result))
{
    if (!isset($questions[$row{'idQU'}])) $questions[$row{'idQU'}] = new Question($row{'idQU'}, $row{'textQU'});
    $questions[$row{'idQU'}]->addAnswer(new Answer($row{'idAN'}, $row{'textAN'}, $row{'riskAN'}));
}

$xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><interview/>');

foreach($questions as $que)
{
    $que->appendXMLTo($xml);
}

Header('Content-type: text/xml; charset=utf-8');
print($xml->asXML());

/*
$xml = new SimpleXMLElement('<xml/>');

$question = $xml->addChild('question');
$question->addAttribute('id', 0);
$question->addAttribute('text',"Would you like green eggs and ham?");

$answer = $question->addChild('answer');
$answer->addAttribute('qid',0);
$answer->addAttribute('id',1);
$answer->addAttribute('text',"I do not like green eggs and ham.");

$answer = $question->addChild('answer');
$answer->addAttribute('qid',0);
$answer->addAttribute('id',2);
$answer->addAttribute('text',"I do not like them.");

$answer = $question->addChild('answer');
$answer->addAttribute('qid',0);
$answer->addAttribute('id',3);
$answer->addAttribute('text',"No.");


$question = $xml->addChild('question');
$question->addAttribute('id', 1);
$question->addAttribute('text', "Would you like them here or there?");

$answer = $question->addChild('answer');
$answer->addAttribute('qid',1);
$answer->addAttribute('id',1);
$answer->addAttribute('text', "I would not like them here or there.");

$answer = $question->addChild('answer');
$answer->addAttribute('qid',1);
$answer->addAttribute('id',2);
$answer->addAttribute('text',"I would not like them anywhere.");

$answer = $question->addChild('answer');
$answer->addAttribute('qid',1);
$answer->addAttribute('id',3);
$answer->addAttribute('text',"I do not like green eggs and ham.");

Header('Content-type: text/xml');
print($xml->asXML());
*/
?>
