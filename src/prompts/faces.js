import { ActionUnitsList } from "../unity/facs/shapeDict"

function describeActionUnits(units) {
  return units.map(unit => {
      return `ID: ${unit.id}, Name: ${unit.name}, Face Section: ${unit.faceSection}`;
  });
}

const faces = `"
Using the descriptions from the following json dictionary, generate a simple JSON response, including its intensity, duration, and role in facial expressions. "
${describeActionUnits(ActionUnitsList)}
Examples:
Example 1: Happiness

{
  "combination": "Happiness",
  "aus": [
    {
      "id": "12",
      "intensity": 0.8,
      "duration": 5,
      "explanation": "Lip corners pulled up in a smile, signifying happiness."
    },
    {
      "id": "6",
      "intensity": 0.5,
      "duration": 5,
      "explanation": "Cheeks raised, enhancing the smile, reflecting joy."
    },
    {
      "id": "25",
      "intensity": 0.3,
      "duration": 4,
      "explanation": "Lips part slightly, suggesting openness to experience."
    }
 ]
}
Example 2: Concentration + Determination

{
  "combination": "Concentration + Determination",
  "aus": [
    {
      "id": "4",
      "intensity": 0.7,
      "duration": 6,
      "explanation": "Brows furrowed, indicating focus and concentration."
    },
    {
      "id": "7",
      "intensity": 0.6,
      "duration": 5,
      "explanation": "Lids tightened, showing determination."
    },
    {
      "id": "53",
      "intensity": 0.4,
      "duration": 3,
      "explanation": "Head up, a posture of attentiveness and resolve."
    }
  ]
}
Example 3: Surprise + Confusion

{
  "combination": "Surprise + Confusion",
  "aus": [
    {
      "id": "1",
      "intensity": 0.9,
      "duration": 5,
      "explanation": "Inner brows raised, a key indicator of surprise."
    },
    {
      "id": "2",
      "intensity": 0.9,
      "duration": 5,
      "explanation": "Outer brows also raised, amplifying the expression of surprise."
    },
    {
      "id": "5",
      "intensity": 1.0,
      "duration": 5,
      "explanation": "Upper eyelids raised, signifying alertness and sudden attention."
    },
    {
      "id": "26",
      "intensity": 0.4,
      "duration": 3,
      "explanation": "Jaw slightly dropped, common in expressions of surprise and mild confusion."
    }
  ]
}
Guidelines for JSON Construction:
ID Only for AUs: Each AU is identified by its id only, removing the need for names to streamline the data structure.
Intensity and Duration: Specify how strongly each AU is activated (intensity) and for how long (duration).
Explanation: Include a rationale (explanation) for each AU's role in the overall expression, providing insight into the chosen configuration.
This format aims to offer a detailed, structured approach to describing complex facial expressions through a combination of facial action units, including both the micro-expressions of the face and broader movements of the head and eyes.







`
export default faces