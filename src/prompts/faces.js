const faces = `Your task is to give a json response that provided facial action units to make a face. You may also use the Aus also add head and eye positions. You may also provide a desicription of why you chose these action units.
Here is the dictionary of our lab's Action unit codes (some are not standard but most are)

     id : "0"   name : "neutralFace"          //Main Codes
     id : "1"   name : "innerBrowRaiser"
     id : "2"   name : "outerBrowRaiser"
     id : "2L"  name : "outerBrowRaiserL"
     id : "2R"  name : "outerBrowRaiserR"
     id : "4"   name : "browLowerer"
     id : "5"   name : "upperLidRaiser"
     id : "6"   name : "cheekRaiser"
     id : "7"   name : "lidTightener"
     id : "8"   name : "lipsTowardEachOther"
     id : "9"   name : "noseWrinkler"
     id : "10"  name : "upperLipRaiser"
     id : "11"  name : "nasolabialDeepener"
     id : "12"  name : "lipCornerPuller"
     id : "13"  name : "sharpLipPuller"
     id : "14"  name : "dimpler"
     id : "15"  name : "lipCornerDepressor"
     id : "16"  name : "lowerLipDepressor"
     id : "17"  name : "chinRaiser"
     id : "18"  name : "lipPucker"
     id : "19"  name : "tongueShow"
     id : "20"  name : "lipStretcher"
     id : "21"  name : "neckTightener"
     id : "22"  name : "lipFunneler"
     id : "23"  name : "lipTightener"
     id : "24"  name : "lipPressor"
     id : "25"  name : "lipsPart"
     id : "26"  name : "jawDrop"
     id : "27"  name : "mouthStretch"
     id : "28"  name : "lipSuck"
     id : "29"  name : "jawThrust"
     id : "30L"  name : "jawSidewaysLeft"
     id : "30R"  name : "jawSidewaysRight"
     id : "31"  name : "jawClencher"
     id : "32"  name : "lipBite"
     id : "33"  name : "cheekBlow"
     id : "34"  name : "cheekPuff"
     id : "35"  name : "cheekSuck"
     id : "36"  name : "tongueBulge"
     id : "36L"  name : "tongueBulge L"
     id : "36R"  name : "tongueBulge R"
     id : "37"  name : "lipWipe"
     id : "38"  name : "nostrilDilator"
     id : "39"  name : "nostilCompressor"
     id : "41"  name : "glabellaLowerer"
     id : "42"  name : "innerEyebrowLowerer"
     id : "43"  name : "eyesClosed"
     id : "44"  name : "eyebrowGatherer"
     id : "45"  name : "blink"
     id : "46R" name : "winkR"
     id : "46L" name : "winkL"
     id : "51"  name : "headTurnLeft"                      //Head Movement Codes
     id : "52"  name : "headTurnRight"         
     id : "53"  name : "headUp"                
     id : "54"  name : "headDown"              
     id : "55"  name : "headTiltLeft"          
     id : "M55" name : "headTiltLeftBis"       
     id : "56"  name : "headTiltRight"         
     id : "M56" name : "headTiltRightBis"      
     id : "57"  name : "headForward"           
     id : "M57" name : "headForwardBis"        
     id : "58"  name : "headBack"              
     id : "M59" name : "headShakeUpAndDown"    
     id : "M60" name : "headShakeSideToSide"   
     id : "M83" name : "headUpwardAndTheSide"  
     id : "61"  name : "eyesTurnLeft"                         //Eye Movement Codes
     id : "M61" name : "eyesLeft"              
     id : "62"  name : "eyesTurnRight"         
     id : "M62" name : "eyesRight"             
     id : "63"  name : "eyesUp"                
     id : "64"  name : "eyesDown"              
     id : "65"  name : "walleye"               
     id : "66"  name : "crosseye"              
     id : "M68" name : "upwardRollingEyes"     
     id : "69"  name : "eyesPositionedOtherPerson"   
     id : "M69" name : "headEyesPositionedOtherPerson"}

Examples:

    "combination": "Sadness + Conscientiousness",
    "aus": [
      "au": "AU1""intensity": 0.4"duration": 5
      "au": "AU4""intensity": 0.5"duration": 5
      "au": "AU15""intensity": 0.6"duration": 5}
    ],
    "explanation": "This configuration represents a person who is experiencing sadnessas indicated by ACTION UNIT4 (brow lowerer) showing concernand ACTION UNIT15 (lip corner depressor) reflecting the downturned mouth associated with sadness. The modest intensity levels reflect the controlled emotional expression characteristic of conscientious individuals."
  }

  Example 2: Prompt and Response
  Prompt:
  "Generate JSON for a facial expression combining anger and a high level of agreeableness."
  
  Response:
  

  
    "combination": "Anger + Agreeableness",
    "aus": [
      "au": "AU4""intensity": 0.7"duration": 4
      "au": "AU7""intensity": 0.3"duration": 3
      "au": "AU23""intensity": 0.5"duration": 4}
    ],
    "explanation": "This JSON captures an expression of anger tempered by agreeableness. ACTION UNIT4 and ACTION UNIT23 are present to indicate frustration or angerbut at a moderated intensityreflecting the agreeable tendency to avoid full confrontation. ACTION UNIT7 (lid tightener) at a low intensity suggests a restrained emotional displayconsistent with an agreeable personality."
  }

  Prompt:
  "Create a JSON object showing the facial expression of surprise combined with high neuroticism."
  
  Response:
  
  
  
    "combination": "Surprise + High Neuroticism",
    "aus": [
      "au": "AU1""intensity": 0.9"duration": 5
      "au": "AU2""intensity": 0.9"duration": 5
      "au": "AU5""intensity": 1.0"duration": 5
      "au": "AU26""intensity": 0.4"duration": 3}
    ],
    "explanation": "The selected ACTION UNITs reflect a strong reaction to surprisewith ACTION UNIT1 and ACTION UNIT2 indicating raised browsand ACTION UNIT5 showing wide-open eyesall at high intensities for a pronounced surprise effect. The inclusion of ACTION UNIT26 at a lower intensity suggests a slightly open mouthindicative of the apprehensive and anxious response expected from someone with high neuroticism."
  }
`
export default faces