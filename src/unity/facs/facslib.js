function FacsLib(engine) {
	this.defaultIntensity = 'C';
    if (engine instanceof  Engine3D) {
      this.engine = engine;  
    } else {
      throw Error("Bad engine");  
    }
    
    this.ActionUnitsList = [
		{ id : "0"   , name : "neutralFace"},          //Main Codes
		{ id : "1"   , name : "innerBrowRaiser"},
		{ id : "2"   , name : "outerBrowRaiser"},
		{ id : "2L"  , name : "outerBrowRaiserL"},
		{ id : "2R"  , name : "outerBrowRaiserR"},
		{ id : "4"   , name : "browLowerer"},
		{ id : "5"   , name : "upperLidRaiser"},
		{ id : "6"   , name : "cheekRaiser"},
		{ id : "7"   , name : "lidTightener"},
		{ id : "8"   , name : "lipsTowardEachOther"},
		{ id : "9"   , name : "noseWrinkler"},
		{ id : "10"  , name : "upperLipRaiser"},
		{ id : "11"  , name : "nasolabialDeepener"},
		{ id : "12"  , name : "lipCornerPuller"},
		{ id : "13"  , name : "sharpLipPuller"},
		{ id : "14"  , name : "dimpler"},
		{ id : "15"  , name : "lipCornerDepressor"},
		{ id : "16"  , name : "lowerLipDepressor"},
		{ id : "17"  , name : "chinRaiser"},
		{ id : "18"  , name : "lipPucker"},
		{ id : "19"  , name : "tongueShow"},
		{ id : "20"  , name : "lipStretcher"},
		{ id : "21"  , name : "neckTightener"},
		{ id : "22"  , name : "lipFunneler"},
		{ id : "23"  , name : "lipTightener"},
		{ id : "24"  , name : "lipPressor"},
		{ id : "25"  , name : "lipsPart"},
		{ id : "26"  , name : "jawDrop"},
		{ id : "27"  , name : "mouthStretch"},
		{ id : "28"  , name : "lipSuck"},
		{ id : "29"  , name : "jawThrust"},
		{ id : "30L"  , name : "jawSidewaysLeft"},
		{ id : "30R"  , name : "jawSidewaysRight"},
		{ id : "31"  , name : "jawClencher"},
		{ id : "32"  , name : "lipBite"},
		{ id : "33"  , name : "cheekBlow"},
		{ id : "34"  , name : "cheekPuff"},
		{ id : "35"  , name : "cheekSuck"},
		{ id : "36"  , name : "tongueBulge"},
		{ id : "36L"  , name : "tongueBulge L"},
		{ id : "36R"  , name : "tongueBulge R"},
		{ id : "37"  , name : "lipWipe"},
		{ id : "38"  , name : "nostrilDilator"},
		{ id : "39"  , name : "nostilCompressor"},
		{ id : "41"  , name : "glabellaLowerer"},
		{ id : "42"  , name : "innerEyebrowLowerer"},
        { id : "43"  , name : "eyesClosed"},
		{ id : "44"  , name : "eyebrowGatherer"},
		{ id : "45"  , name : "blink"},
		{ id : "46R" , name : "winkR"},
		{ id : "46L" , name : "winkL"},
		{ id : "51"  , name : "headTurnLeft"                 },            //Head Movement Codes
		{ id : "52"  , name : "headTurnRight"                },
		{ id : "53"  , name : "headUp"                       },
		{ id : "54"  , name : "headDown"                     },
		{ id : "55"  , name : "headTiltLeft"                 },
		{ id : "M55" , name : "headTiltLeftBis"              },
		{ id : "56"  , name : "headTiltRight"                },
		{ id : "M56" , name : "headTiltRightBis"             },
		{ id : "57"  , name : "headForward"                  },
		{ id : "M57" , name : "headForwardBis"               },
		{ id : "58"  , name : "headBack"                     },
		{ id : "M59" , name : "headShakeUpAndDown"           },
		{ id : "M60" , name : "headShakeSideToSide"          },
		{ id : "M83" , name : "headUpwardAndTheSide"         },
		{ id : "61"  , name : "eyesTurnLeft"                 },               //Eye Movement Codes
		{ id : "M61" , name : "eyesLeft"                     },
		{ id : "62"  , name : "eyesTurnRight"                },
		{ id : "M62" , name : "eyesRight"                    },
		{ id : "63"  , name : "eyesUp"                       },
		{ id : "64"  , name : "eyesDown"                     },
		{ id : "65"  , name : "walleye"                      },
		{ id : "66"  , name : "crosseye"                     },
		{ id : "M68" , name : "upwardRollingEyes"            },
		{ id : "69"  , name : "eyesPositionedOtherPerson"    },
		{ id : "M69" , name : "headEyesPositionedOtherPerson"}
    ];
    
    this.EmotionsList = [
        { name : "Neutral"    , code : ""               },
        { name : "Happiness" , code : "6+12"           },
        { name : "Sadness"   , code : "1+4+15"         },
        { name : "Surprise"  , code : "1+2+5B+26"      },
        { name : "Fear"      , code : "1+2+4+5+7+20+26"},
        { name : "Anger"     , code : "4+5+7+23"       },
        { name : "Disgust"   , code : "9+15+16"        },
        { name : "Contempt"  , code : "R12A+R14A"      }
    ]
    
    this.VisemesList = [ // id is useless, TODO remove
        { id : 0  , name : "ae ax ah"   },
        { id : 1  , name : "aa"         },
        { id : 2  , name : "ao"         },
        { id : 3  , name : "ey eh uh"   },
        { id : 4  , name : "er"         },
        { id : 5  , name : "y iy ih ix" },
        { id : 6  , name : "w uw"       },
        { id : 7  , name : "ow"         },
        { id : 8  , name : "aw"         },
        { id : 9  , name : "oy"         },
        { id : 10 , name : "ay"         },
        { id : 11 , name : "h"          },
        { id : 12 , name : "r"          },
        { id : 13 , name : "l"          },
        { id : 14 , name : "s z"        },
        { id : 15 , name : "sh ch jh zh"},
        { id : 16 , name : "th dh"      },
        { id : 17 , name : "f v"        },
        { id : 18 , name : "d t n"      },
        { id : 19 , name : "k g ng"     },
        { id : 20 , name : "p b m"      }
    ]

    this.nbActionUnits = Object.keys(this.ActionUnitsList).length;
    this.nbVisemes = Object.keys(this.VisemesList).length;
    var nbWeights = this.nbActionUnits + this.nbVisemes;
    this.currentWeightTargets = Array.apply(null, new Array(nbWeights)).map(Number.prototype.valueOf,0);
    this.currentWeightSmooth = Array.apply(null, new Array(nbWeights)).map(Number.prototype.valueOf,0);
    this.cameraPosition = Array.apply(null, new Array(3)).map(Number.prototype.valueOf,0);
    //console.log("From FacsLib function:"+this.cameraPosition);
};

FacsLib.prototype = {
	
		load : function(environmentSceneName, characterSceneName){
			this.engine.load(environmentSceneName, characterSceneName);
		},

        // All AU will move towards 0.0
        // Doesn't impact visemes.
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setNeutral : function (smoothTime){
            for (var i = 0; i < this.nbActionUnits; i++) {
                this.currentWeightTargets[i] = 0.0;
                this.currentWeightSmooth [i] = smoothTime;
                //console.log("In setNeutral Unity/facslib.js");
            }       
        },
        
        // All AU will move towards 0.0
        // Doesn't impact visemes.
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setNeutralWithoutHeadTurn : function (smoothTime){
            for (var i = 0; i < 50; i++) {
                this.currentWeightTargets[i] = 0.0;
                this.currentWeightSmooth [i] = smoothTime;
                //console.log("In setNeutral Unity/facslib.js");
            } 
            for (var i = 55; i < 60; i++) {
                this.currentWeightTargets[i] = 0.0;
                this.currentWeightSmooth [i] = smoothTime;
                //console.log("In setNeutral Unity/facslib.js");
            }  
            for (var i = 63; i < this.nbActionUnits; i++) {
                this.currentWeightTargets[i] = 0.0;
                this.currentWeightSmooth [i] = smoothTime;
                //console.log("In setNeutral Unity/facslib.js");
            }     
        },

        // HeadTurnLeft and HeadTurnDown
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setLookBottomLeft : function(smoothTime){
            this.currentWeightTargets[51] = 20;
            this.currentWeightTargets[54] = 40;
        },
        
        
        // HeadTurnRight and HeadTurnDown
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setLookBottomRight : function(smoothTime){
            this.currentWeightTargets[52] = 20;
            this.currentWeightTargets[54] = 40;
        },
        
        
        // HeadTurnLeft and HeadTurnUp 
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setLookUpLeft : function(smoothTime){
            this.currentWeightTargets[51] = 10;
            this.currentWeightTargets[53] = 10;
        },
        
        
        // HeadTurnRight and HeadTurnUp 
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setLookUpRight : function(smoothTime){
            this.currentWeightTargets[52] = 90;
            this.currentWeightTargets[53] = 90;
        },
        
        // emotion : one of the keys of this.EmotionsList (ex : "Happiness")
        // intensity : scales all the sub-AUs of the emotion (ex : 0.8)
        // smoothTime : the desired AU values will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setTargetEmotion : function ( emotionName, intensity, smoothTime ){
            this.setNeutralWithoutHeadTurn(smoothTime);
            var EmotionIndex = this.EmotionsList.findIndex( function(elem, index, array){return elem.name == emotionName;} );
            var AUS = this.EmotionsList[EmotionIndex].code;
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
            if(intensity == "A"){numericIntensity = 0.2;}
            if(intensity == "B"){numericIntensity = 0.4;}
            if(intensity == "C"){numericIntensity = 0.6;}
            if(intensity == "D"){numericIntensity = 0.8;}
            if(intensity == "E"){numericIntensity = 1.0;}
            
            if ( isNaN(parseInt(intensity) )  ) {
                this.setTargetAU(element.substring(0, element.length -1) , 100.0*numericIntensity*globalIntensity , lOrR, smoothTime ); 
            } else {
                this.setTargetAU(element, 100.0*globalIntensity, lOrR, smoothTime);
            }
            
        },
        
        // AU : The ID of a FACS ActionUnit (ex : "0" , "M55")
        // intensity : intensity of the AU (ex : 0.8)
        // smoothTime : the desired AU value will be reached in 'smoothTime' seconds. (ex : 0.0 or 0.1)
        // updateEngine() must be called after this function.
        setTargetAU : function(AU, intensity, lOrR, smoothTime){
            //AUIndex = Object.keys(this.ActionUnitsList).indexOf(AU);
            //console.log("In setTargetAU Unity/facslib.js");
            AUIndex = this.ActionUnitsList.findIndex( function(elem, index, array){return elem.id == AU;} );
            this.currentWeightTargets[AUIndex] = intensity;
            this.currentWeightSmooth [AUIndex] = smoothTime;
        },
        
        // AU : The ID of a FACS ActionUnit (ex : 0 , "M55")
        getTargetAU : function(AU){
            //AUIndex = Object.keys(this.ActionUnitsList).indexOf(AU);
            AUIndex = this.ActionUnitsList.findIndex( function(elem, index, array){return elem.id == AU;} );
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
		
		setEyeTarget : function(x,y,z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible){
			engine.setEyeTarget(x,y,z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible);
		},
		
        // setEyeTargetViewport : function(x,y) {
        //     engine.setEyeTargetViewport(x,y);
        // },

		setCameraPosition : function(x,y,z, rx, ry, rz){
			engine.setCameraPosition(x,y,z, rx, ry, rz);
		},

        // Sends the new AUs and Visemes to the 3D renderer.
        updateEngine : function(){
            engine.setTargets(this.currentWeightTargets, this.currentWeightSmooth);
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
