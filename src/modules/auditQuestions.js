const auditQuestions = `[
    {
      text: "How often do you have a drink containing alcohol?",
      options: [
        { response: "Never", score: 0 },
        { response: "Monthly or less", score: 1 },
        { response: "2-4 times a month", score: 2 },
        { response: "2-3 times a week", score: 3 },
        { response: "4 or more times a week", score: 4 }
      ]
    },
    {
      text: "How many drinks containing alcohol do you have on a typical day when you are drinking?",
      options: [
        { response: "1 or 2", score: 0 },
        { response: "3 or 4", score: 1 },
        { response: "5 or 6", score: 2 },
        { response: "7 to 9", score: 3 },
        { response: "10 or more", score: 4 }
      ]
    },
    {
      text: "How often do you have six or more drinks on one occasion?",
      options: [
        { response: "Never", score: 0 },
        { response: "Less than monthly", score: 1 },
        { response: "Monthly", score: 2 },
        { response: "Weekly", score: 3 },
        { response: "Daily or almost daily", score: 4 }
      ]
    },
    {
      text: "How often during the last year have you found that you were not able to stop drinking once you had started?",
      options: [
        { response: "Never", score: 0 },
        { response: "Less than monthly", score: 1 },
        { response: "Monthly", score: 2 },
        { response: "Weekly", score: 3 },
        { response: "Daily or almost daily", score: 4 }
      ]
    },
    {
      text: "How often during the last year have you failed to do what was normally expected from you because of drinking?",
      options: [
        { response: "Never", score: 0 },
        { response: "Less than monthly", score: 1 },
        { response: "Monthly", score: 2 },
        { response: "Weekly", score: 3 },
        { response: "Daily or almost daily", score: 4 }
      ]
    },
    {
      text: "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?",
      options: [
        { response: "Never", score: 0 },
        { response: "Less than monthly", score: 1 },
        { response: "Monthly", score: 2 },
        { response: "Weekly", score: 3 },
        { response: "Daily or almost daily", score: 4 }
      ]
    },
    {
      text: "How often during the last year have you had a feeling of guilt or remorse after drinking?",
      options: [
        { response: "Never", score: 0 },
        { response: "Less than monthly", score: 1 },
        { response: "Monthly", score: 2 },
        { response: "Weekly", score: 3 },
        { response: "Daily or almost daily", score: 4 }
      ]
    },
    {
      text: "How often during the last year have you been unable to remember what happened the night before because of your drinking?",
      options: [
        { response: "Never", score: 0 },
        { response: "Less than monthly", score: 1 },
        { response: "Monthly", score: 2 },
        { response: "Weekly", score: 3 },
        { response: "Daily or almost daily", score: 4 }
      ]
    },
    {
      text: "Have you or someone else been injured as a result of your drinking?",
      options: [
        { response: "No", score: 0 },
        { response: "Yes, but not in the last year", score: 2 },
        { response: "Yes, during the last year", score: 4 }
      ]
    },
    {
      text: "Has a relative, friend, doctor, or other health worker been concerned about your drinking or suggested you cut down?",
      options: [
        { response: "No", score: 0 },
        { response: "Yes, but not in the last year", score: 2 },
        { response: "Yes, during the last year", score: 4 }
      ]
    }
  ]`;
  
  export default auditQuestions;