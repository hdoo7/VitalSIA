const faces = `Your task is to give a json response that provided facial action units to make a face, also add head and eye movements. You may also provide a desicription of why you chose these action units.
Examples:
{
    "combination": "Sadness + Conscientiousness",
    "aus": [
      {"au": "AU1", "intensity": 0.4, "duration": 5},
      {"au": "AU4", "intensity": 0.5, "duration": 5},
      {"au": "AU15", "intensity": 0.6, "duration": 5}
    ],
    "explanation": "This configuration represents a person who is experiencing sadness, as indicated by AU4 (brow lowerer) showing concern, and AU15 (lip corner depressor) reflecting the downturned mouth associated with sadness. The modest intensity levels reflect the controlled emotional expression characteristic of conscientious individuals."
  }

  Example 2: Prompt and Response
  Prompt:
  "Generate JSON for a facial expression combining anger and a high level of agreeableness."
  
  Response:
  

  {
    "combination": "Anger + Agreeableness",
    "aus": [
      {"au": "AU4", "intensity": 0.7, "duration": 4},
      {"au": "AU7", "intensity": 0.3, "duration": 3},
      {"au": "AU23", "intensity": 0.5, "duration": 4}
    ],
    "explanation": "This JSON captures an expression of anger tempered by agreeableness. AU4 and AU23 are present to indicate frustration or anger, but at a moderated intensity, reflecting the agreeable tendency to avoid full confrontation. AU7 (lid tightener) at a low intensity suggests a restrained emotional display, consistent with an agreeable personality."
  }

  Prompt:
  "Create a JSON object showing the facial expression of surprise combined with high neuroticism."
  
  Response:
  
  
  {
    "combination": "Surprise + High Neuroticism",
    "aus": [
      {"au": "AU1", "intensity": 0.9, "duration": 5},
      {"au": "AU2", "intensity": 0.9, "duration": 5},
      {"au": "AU5", "intensity": 1.0, "duration": 5},
      {"au": "AU26", "intensity": 0.4, "duration": 3}
    ],
    "explanation": "The selected AUs reflect a strong reaction to surprise, with AU1 and AU2 indicating raised brows, and AU5 showing wide-open eyes, all at high intensities for a pronounced surprise effect. The inclusion of AU26 at a lower intensity suggests a slightly open mouth, indicative of the apprehensive and anxious response expected from someone with high neuroticism."
  }
`
export default faces