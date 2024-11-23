const auditQuestions = `[
        {
      text: "How would you describe your emotional state over the past week?",
      options: [
        { response: "Very positive", score: 0 },
        { response: "Mostly positive", score: 1 },
        { response: "Neutral", score: 2 },
        { response: "Mostly negative", score: 3 },
        { response: "Very negative", score: 4 }
      ]
    },
    {
      text: "How often do you engage in physical activity or exercise?",
      options: [
        { response: "Daily", score: 0 },
        { response: "Several times a week", score: 1 },
        { response: "Once a week", score: 2 },
        { response: "Rarely", score: 3 },
        { response: "Never", score: 4 }
      ]
    },
    {
      text: "How would you rate your eating habits?",
      options: [
        { response: "Very healthy and balanced", score: 0 },
        { response: "Somewhat healthy and balanced", score: 1 },
        { response: "Neutral", score: 2 },
        { response: "Somewhat unhealthy", score: 3 },
        { response: "Very unhealthy", score: 4 }
      ]
    },
    {
      text: "Do you make time for hobbies or activities you enjoy?",
      options: [
        { response: "Always", score: 0 },
        { response: "Often", score: 1 },
        { response: "Sometimes", score: 2 },
        { response: "Rarely", score: 3 },
        { response: "Never", score: 4 }
      ]
    },
    {
      text: "How much sleep do you typically get each night?",
      options: [
        { response: "7-9 hours", score: 0 },
        { response: "6-7 hours", score: 1 },
        { response: "5-6 hours", score: 2 },
        { response: "4-5 hours", score: 3 },
        { response: "Less than 4 hours", score: 4 }
      ]
    },
    {
      text: "How often do you feel stressed or overwhelmed?",
      options: [
        { response: "Never", score: 0 },
        { response: "Rarely", score: 1 },
        { response: "Sometimes", score: 2 },
        { response: "Often", score: 3 },
        { response: "Always", score: 4 }
      ]
    },
    {
      text: "How frequently do you prepare and eat meals at home?",
      options: [
        { response: "Always", score: 0 },
        { response: "Often", score: 1 },
        { response: "Sometimes", score: 2 },
        { response: "Rarely", score: 3 },
        { response: "Never", score: 4 }
      ]
    },
    {
      text: "Do you feel socially connected and supported by others?",
      options: [
        { response: "Always", score: 0 },
        { response: "Often", score: 1 },
        { response: "Sometimes", score: 2 },
        { response: "Rarely", score: 3 },
        { response: "Never", score: 4 }
      ]
    },
    {
      text: "Do you find time to relax and unwind?",
      options: [
        { response: "Always", score: 0 },
        { response: "Often", score: 1 },
        { response: "Sometimes", score: 2 },
        { response: "Rarely", score: 3 },
        { response: "Never", score: 4 }
      ]
    },
    {
      text: "Do you drink enough water daily?",
      options: [
        { response: "Always", score: 0 },
        { response: "Often", score: 1 },
        { response: "Sometimes", score: 2 },
        { response: "Rarely", score: 3 },
        { response: "Never", score: 4 }
      ]
    }
  ]`;
  
  export default auditQuestions;