<?php

require_once(__DIR__."/../../app/main.config.php");
require_once(__DIR__."/../../app/utils/Counselling.classes.php");

//connection to the database
$dbhandle = mysqli_connect($db_hostname, $db_username, $db_password, $db_database) or die("Unable to connect to database.");

//default
$lang = 13; //en-US
$nickname = "Danny";
$userID = "-1";
/*
//fetch nickname and id of user
$query_userProfile = 'SELECT
Users.idUser, Users.nickname, Users.idLanguage
FROM Users
WHERE Users.email="'.$this->session->flashdata('email').'";';

$resultUserProfile = mysqli_query($dbhandle, $query_userProfile);
if (!$resultUserProfile)
{
    printf("Error: %s\n", mysqli_error($dbhandle));
    exit();
}

if ($userProfile = mysqli_fetch_array($resultUserProfile))
{
    $lang = $userProfile['idLanguage'];
    $nickname = $userProfile['nickname'];
    $userID = $userProfile['idUser'];
}
*/
//execute the SQL query and return records
$topicID = 1;
$interviewID = 1;

$query_allQuestionsWithAnswersForFirstTopicInterview = 'SELECT
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

$resultQAs = mysqli_query($dbhandle, $query_allQuestionsWithAnswersForFirstTopicInterview);

//close the connection
mysqli_close($dbhandle);

$questions = [];
//fetch tha data from the database 
while ($row = mysqli_fetch_array($resultQAs))
{
    if (!isset($questions[$row{'idQU'}])) $questions[$row{'idQU'}] = new Question($row{'idQU'}, $row{'textQU'});
    $questions[$row{'idQU'}]->addAnswer(new Answer($row{'idAN'}, $row{'textAN'}, $row{'riskAN'}));
}

$xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><interview/>');

//add user profile information
$profile = $xml->addChild('user');
$profile->addAttribute('id', $userID);
$profile->addAttribute('nickname',$nickname);

foreach($questions as $que)
{
    $que->appendXMLTo($xml);
}

Header('Content-type: text/xml; charset=utf-8');
print($xml->asXML());

?>
