function FacsLib(engine) {
	this.defaultIntensity = 'C';
    if (engine instanceof  Engine3D) {
      this.engine = engine;  
    } else {
      throw Error("Bad engine");  
    }
    
    this.ActionUnitsList = {
		1   : "neutralFace",          //Main Codes
		2   : "innerBrowRaiser",
		3   : "outerBrowRaiser",
		4   : "browLowerer",
		5   : "upperLidRaiser",
		6   : "cheekRaiser",
		7   : "lidTightener",
		8   : "lipsTowardEachOther",
		9   : "noseWrinkler",
		10  : "upperLipRaiser",
		11  : "nasolabialDeepener",
		12  : "lipCornerPuller",
		13  : "sharpLipPuller",
		14  : "dimpler",
		15  : "lipCornerDepressor",
		16  : "lowerLipDepressor",
		17  : "chinRaiser",
		18  : "lipPucker",
		19  : "tongueShow",
		20  : "lipStretcher",
		21  : "neckTightener",
		22  : "lipFunneler",
		23  : "lipTightener",
		24  : "lipPressor",
		25  : "lipsPart",
		26  : "jawDrop",
		27  : "mouthStretch",
		28  : "lipSuck",
		29  : "jawThrust",
		30  : "jawSideways",
		31  : "jawClencher",
		32  : "lipBite",
		33  : "cheekBlow",
		34  : "cheekPuff",
		35  : "cheekSuck",
		36  : "tongueBulge",
		37  : "lipWipe",
		38  : "nostrilDilator",
		39  : "nostilCompressor",
		41  : "glabellaLowerer",
		42  : "innerEyebrowLowerer",
		44  : "eyebrowGatherer",
		45  : "blink",
		46  : "wink",
		51  : "headTurnLeft",            //Head Movement Codes
		52  : "headTurnRight",
		53  : "headUp",
		54  : "headDown",
		55  : "headTiltLeft",
		M55 : "headTiltLeftBis",
		56  : "headTiltRight",
		M56 : "headTiltRightBis",
		57  : "headForward",
		M57 : "headForwardBis",
		58  : "headBack",
		M59 : "headShakeUpAndDown",
		M60 : "headShakeSideToSide",
		M83 : "headUpwardAndTheSide",
		61  : "eyesTurnLeft",               //Eye Movement Codes
		M61 : "eyesLeft",
		62  : "eyesTurnRight",
		M62 : "eyesRight",
		63  : "eyesUp",
		64  : "eyesDown",
		65  : "walleye",
		66  : "crosseye",
		M68 : "upwardRollingEyes",
		69  : "eyesPositionedOtherPerson",
		M69 : "headEyesPositionedOtherPerson"
    };
    
    this.EmotionsList = {
        "Neutral"    : ""  ,
        "Happiness" : "6+12"  ,
        "Sadness"   : "1+4+15",
        "Surprise"  : "1+2+5B+26",
        "Fear"      : "1+2+4+5+7+20+26",
        "Anger"     : "4+5+7+23",
        "Disgust"   : "9+15+16",
        "Contempt"  : "R12A+R14A"
    };
    
    this.VisemesList = {
        0  : "ae ax ah",
        1  : "aa",
        2  : "ao",
        3  : "ey eh uh",
        4  : "er",
        5  : "y iy ih ix",
        6  : "w uw",
        7  : "ow",
        8  : "aw",
        9  : "oy",
        10 : "ay",
        11 : "h",
        12 : "r",
        13 : "l",
        14 : "s z",
        15 : "sh ch jh zh",
        16 : "th dh",
        17 : "f v",
        18 : "d t n",
        19 : "k g ng",
        20 : "p b m"
    };

    this.nbActionUnits = Object.keys(this.ActionUnitsList).length;
    this.nbVisemes = Object.keys(this.VisemesList).length;
    var nbWeights = this.nbActionUnits + this.nbVisemes;
    this.currentWeightTargets = Array.apply(null, new Array(nbWeights)).map(Number.prototype.valueOf,0);
    this.currentWeightSmooth = Array.apply(null, new Array(nbWeights)).map(Number.prototype.valueOf,0);
};

FacsLib.prototype = {

        // All AU will move towards 0.0
        // Doesn't impact visemes.
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setNeutral : function (smoothTime){
            for (var i = 0; i < this.nbActionUnits; i++) {
                this.currentWeightTargets[i] = 0.0;
                this.currentWeightSmooth [i] = smoothTime;
                console.log("in setNeutral mainframe/modules");
            }       
        },

        // emotion : one of the keys of this.EmotionsList (ex : "Happiness")
        // intensity : scales all the sub-AUs of the emotion (ex : 0.8)
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setTargetEmotion : function ( emotionName, intensity, smoothTime ){
            this.setNeutral(smoothTime);
            var AUS = this.EmotionsList[emotionName];
            this.setTargetEmotionString(AUS, intensity, smoothTime);
        },
        
        // emotionString : An emotion string, in FACS format (ex : "1+2+5B+26")
        // intensity : scales all the sub-AUs of the emotion (ex : 0.8)
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setTargetEmotionString : function ( emotionString, intensity, smoothTime ) {
            //décryptage AUs
            var arrayAU = [];
            if (typeof emotionString == "string") {
                arrayAU = emotionString.split("+");
            }
            var length = arrayAU.length;
            for(var i = 0; i < length; i++) {
                this.setTargetEmotionSubstring(arrayAU[i], intensity, smoothTime );
            }
        },
        
        // element : A part of the FACS string (ex : "1", "5B")
        // globalIntensity : scales the sub-AU of the emotion (ex : 0.8)
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setTargetEmotionSubstring : function (element, globalIntensity, smoothTime) {
			
			var lOrR = element.substring(0, 1);
			if (lOrR == 'R' || lOrR == 'L') {
				element =  element.substring(1);
			} else {
				lOrR = null;
			}
			
            var intensity = element.slice(-1);
            var numericIntensity = 1.0;
            if(intensity == "A"){numericIntensity = 1.0;}
            if(intensity == "B"){numericIntensity = 0.8;}
            if(intensity == "C"){numericIntensity = 0.6;}
            if(intensity == "D"){numericIntensity = 0.4;}
            if(intensity == "E"){numericIntensity = 0.2;}
            
            if ( isNaN(parseInt(intensity) )  ) {
                this.setTargetAU(element.substring(0, element.length -1) , 100.0*numericIntensity*globalIntensity , lOrR, smoothTime ); 
            } else {
                this.setTargetAU(element, 100.0*globalIntensity, lOrR, smoothTime);
            }
            
        },
        
        // AU : The ID of a FACS ActionUnit (ex : 0 , "M55")
        // intensity : intensity of the AU (ex : 0.8)
        // smoothTime : the desired AU value will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setTargetAU : function(AU, intensity, lOrR, smoothTime){
            AUIndex = Object.keys(this.ActionUnitsList).indexOf(AU);
            this.currentWeightTargets[AUIndex] = intensity;
            this.currentWeightSmooth [AUIndex] = smoothTime;
            console.log("in setTargetAU mainframe/modules")
        },
        
        // AU : The ID of a FACS ActionUnit (ex : 0 , "M55")
        getTargetAU : function(AU){
            AUIndex = Object.keys(this.ActionUnitsList).indexOf(AU);
            return this.currentWeightTargets[AUIndex];
        },
        
        // Sets all the visemes weights to 0.
        // smoothTime : the desired viseme weights will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // Doesn't impact AUs.
        setNeutralViseme : function (smoothTime){
            for (var i = 0; i <this.nbVisemes ; i++){
                this.currentWeightTargets[this.nbActionUnits+i] = 0.0;
                this.currentWeightSmooth [this.nbActionUnits+i] = smoothTime;
            }
        },
        
        // Set the target viseme. Only one viseme can be set : all others will be cleared.
        // VisemeIndex : index of the viseme in VisemesList (ex : 0 for "bpm") 
        // smoothTime : the desired viseme weight will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // Doesn't impact AUs.
        setTargetViseme : function(VisemeIndex, intensity, smoothTime){
            this.setNeutralViseme(smoothTime);
            this.currentWeightTargets[this.nbActionUnits+VisemeIndex] = intensity;
            this.currentWeightSmooth [this.nbActionUnits+VisemeIndex] = smoothTime;
        },
        getTargetViseme : function(VisemeIndex){
            return this.currentWeightTargets[this.nbActionUnits+VisemeIndex];
        },
        
        // Sends the new AUs and Visemes to the 3D renderer.
        updateEngine : function(){
            this.engine.setTargets(this.currentWeightTargets, this.currentWeightSmooth);
        },
        
        _setAU : function ( AU, intensity ) {
			this.engine.setAU(stringAU , intensity); 
		},
        _setAUS : function ( stringsAU ) {
            //décryptage AUs
            var arrayAU = [];
            if (typeof stringsAU == "string") {
                arrayAU = stringsAU.split("+");
            }
            this.engine.initFace();
            var length = arrayAU.length;
            for(var i = 0; i < length; i++) {
                this.execAU(arrayAU[i]);
            }
        },

        _execAU : function (element) {
			
			var lOrR = element.substring(0, 1);
			if (lOrR == 'R' || lOrR == 'L') {
				element =  element.substring(1);
			} else {
				lOrR = null;
			}
			
            var intensity = element.slice(-1);
            if ( isNaN(parseInt(intensity) )  ) {
                this.engine.setAU(element.substring(0, element.length -1) , intensity , lOrR ); 
            } else {
                this.engine.setAU(element, this.defaultIntensity, lOrR);
            }
        },
		_setDefaultIntensity : function (intensity) {
			this.defaultIntensity = intensity;
		},
		_getAUintensity( AU ) {
			return this.engine.getAUintensity(stringAU); 
		}
}; 
