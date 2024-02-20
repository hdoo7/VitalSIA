function EngineWebGL_u3d() {
	//appel au constructeur de la class parent
	Engine3D.call(this);

    this.unityBlendshapes = 
	[
        { index : 0, name : 'Face_[01]'   , AUid : "1" },
        { index : 1, name : 'Face_[02]'   , AUid : "2" },
        { index : 2, name : 'Face_[02R]'  , AUid : "2R" },
        { index : 3, name : 'Face_[02L]'  , AUid : "2L" },
        { index : 4, name : 'Face_[04]'   , AUid : "4" },
        { index : 5, name : 'Face_[05]'   , AUid : "5" },
        { index : 6, name : 'Face_[06]'   , AUid : "6" },
        { index : 7, name : 'Face_[07]'   , AUid : "7" },
        { index : 8, name : 'Face_[08]'   , AUid : "8" },
        { index : 9, name : 'Face_[09]'   , AUid : "9" },
        { index : 10, name : 'Face_[10]'  , AUid : "10" },
        { index : 11, name : 'Face_[11]'  , AUid : "11" },
        { index : 12, name : 'Face_[12]'  , AUid : "12" },
        { index : 13, name : 'Face_[13]'  , AUid : "13" },
        { index : 14, name : 'Face_[14]'  , AUid : "14" },
        { index : 15, name : 'Face_[15]'  , AUid : "15" },
        { index : 16, name : 'Face_[16]'  , AUid : "16" },
        { index : 17, name : 'Face_[17]'  , AUid : "17" },
        { index : 18, name : 'Face_[18]'  , AUid : "18" },
        { index : 19, name : 'Face_[19]'  , AUid : "19" },
        { index : 20, name : 'Face_[20]'  , AUid : "20" },
        { index : 21, name : 'Face_[21]'  , AUid : "21" },
        { index : 22, name : 'Face_[22]'  , AUid : "22" },
        { index : 23, name : 'Face_[23]'  , AUid : "23" },
        { index : 24, name : 'Face_[24]'  , AUid : "24" },
        { index : 25, name : 'Face_[25]'  , AUid : "25" },
        { index : 26, name : 'Face_[26]'  , AUid : "26" },
        { index : 27, name : 'Face_[27]'  , AUid : "27" },
        { index : 28, name : 'Face_[28]'  , AUid : "28" },
        { index : 29, name : 'Face_[29]'  , AUid : "29" },
        { index : 30, name : 'Face_[30R]' , AUid : "30R" },
        { index : 31, name : 'Face_[30L]' , AUid : "30L" },
        { index : 32, name : 'Face_[31]'  , AUid : "31" },
        { index : 33, name : 'Face_[32]'  , AUid : "32" },
        { index : 34, name : 'Face_[33]'  , AUid : "33" },
        { index : 35, name : 'Face_[34]'  , AUid : "34" },
        { index : 36, name : 'Face_[35]'  , AUid : "35" },
        { index : 37, name : 'Face_[36L]' , AUid : "36L" },
        { index : 38, name : 'Face_[36R]' , AUid : "36R" },
        { index : 39, name : 'Face_[37]'  , AUid : "37" },
        { index : 40, name : 'Face_[38]'  , AUid : "38" },
        { index : 41, name : 'Face_[39]'  , AUid : "39" },
        { index : 42, name : 'Face_[41]'  , AUid : "41" },
        { index : 43, name : 'Face_[42]'  , AUid : "42" },
        { index : 44, name : 'Face_[43]'  , AUid : "43" },
        { index : 45, name : 'Face_[44]'  , AUid : "44" },
        { index : 46, name : 'Face_[45]'  , AUid : "45" },
        { index : 47, name : 'Face_[46R]' , AUid : "46R" },
        { index : 48, name : 'Face_[46L]' , AUid : "46L" },
        { index : 49, name : 'Face_[65]'  , AUid : "65" },
        { index : 50, name : 'Face_[neutral_viseme]' },
        { index : 51, name : 'Face_[ae_ax_ah]'       , VisemeName : "ae ax ah"   },
        { index : 52, name : 'Face_[aa]'             , VisemeName : "aa"         },
        { index : 53, name : 'Face_[ao]'             , VisemeName : "ao"         },
        { index : 54, name : 'Face_[ey_eh_uh]'       , VisemeName : "ey eh uh"   },
        { index : 55, name : 'Face_[er]'             , VisemeName : "er"         },
        { index : 56, name : 'Face_[y_iy_ih_ix]'     , VisemeName : "y iy ih ix" },
        { index : 57, name : 'Face_[w_uw]'           , VisemeName : "w uw"       },
        { index : 58, name : 'Face_[ow]'             , VisemeName : "ow"         },
        { index : 59, name : 'Face_[aw]'             , VisemeName : "aw"         },
        { index : 60, name : 'Face_[oy]'             , VisemeName : "oy"         },
        { index : 61, name : 'Face_[ay]'             , VisemeName : "ay"         },
        { index : 62, name : 'Face_[h]'              , VisemeName : "h"          },
        { index : 63, name : 'Face_[r]'              , VisemeName : "r"          },
        { index : 64, name : 'Face_[l]'              , VisemeName : "l"          },
        { index : 65, name : 'Face_[s_z]'            , VisemeName : "s z"        },
        { index : 66, name : 'Face_[sh_ch_jh_zh]001' , VisemeName : "sh ch jh zh"},
        { index : 67, name : 'Face_[th_dh]'          , VisemeName : "th dh"      },
        { index : 68, name : 'Face_[f_v]'            , VisemeName : "f v"        },
        { index : 69, name : 'Face_[d_t_n]'          , VisemeName : "d t n"      },
        { index : 70, name : 'Face_[f_v]001'         , VisemeName : "k g ng"     },
        { index : 71, name : 'Face_[p_b_m]'          , VisemeName : "p b m"      }
    ];
	
	this.unityBoneshapes = [
        { index :  0, name : 'Face_51'  , AUid : "51" },
        { index :  1, name : 'Face_52'  , AUid : "52" },
        { index :  2, name : 'Face_53'  , AUid : "53" },
        { index :  3, name : 'Face_54'  , AUid : "54" },
        { index :  4, name : 'Face_55'  , AUid : "55" },
        { index :  5, name : 'Face_56'  , AUid : "56" },
        { index :  6, name : 'Face_57'  , AUid : "57" },
        { index :  7, name : 'Face_58'  , AUid : "58" },
        { index :  8, name : 'Face_61'  , AUid : "61" },
        { index : 11, name : 'Face_62'  , AUid : "62" },
        { index : 13, name : 'Face_63'  , AUid : "63" },
        { index : 14, name : 'Face_64'  , AUid : "64" },
        { index : 17, name : 'Face_66'  , AUid : "66" }
		
	]
	/* Currently missing
		{ id : "M55" , name : "headTiltLeftBis"              },
		{ id : "M56" , name : "headTiltRightBis"             },
		{ id : "M57" , name : "headForwardBis"               },
		{ id : "M59" , name : "headShakeUpAndDown"           },
		{ id : "M60" , name : "headShakeSideToSide"          },
		{ id : "M61" , name : "eyesLeft"                     },
		{ id : "M62" , name : "eyesRight"                    },
		{ id : "65"  , name : "walleye"                      },
		{ id : "M68" , name : "upwardRollingEyes"            },
		{ id : "69"  , name : "eyesPositionedOtherPerson"    },
		{ id : "M69" , name : "headEyesPositionedOtherPerson"}
		{ id : "M83" , name : "headUpwardAndTheSide"         },

	*/
	

	
    this.weights     = Array.apply(null, new Array(this.unityBlendshapes.length)).map(Number.prototype.valueOf,0);
    this.smoothTimes = Array.apply(null, new Array(this.unityBlendshapes.length)).map(Number.prototype.valueOf,0);

    this.boneWeights     = Array.apply(null, new Array(this.unityBoneshapes.length)).map(Number.prototype.valueOf,0);
    this.boneSmoothTimes = Array.apply(null, new Array(this.unityBoneshapes.length)).map(Number.prototype.valueOf,0);

    this.cameraPosition = Array.apply(null, new Array(3)).map(Number.prototype.valueOf,0);
	this.centerHeadPosition = Array.apply(null, new Array(3)).map(Number.prototype.valueOf,0);
	this.viewportLookPoint = Array.apply(null, new Array(2)).map(Number.prototype.valueOf,0);
        //console.log("From EngineWebGL_u3d function:"+this.cameraPosition);
    this.FacsLib = null;

	
};


EngineWebGL_u3d.prototype = Object.create(Engine3D.prototype, {

	load : {
        value : function (environmentSceneName, characterSceneName) {	
            gameInstance.SendMessage('SceneLoader', 'Load', environmentSceneName + ";" + characterSceneName);
        }
	},

    setAU : {
        value : function (auNumber, intensity, lorR) {	
            gameInstance.SendMessage('FAC_controller', 'change', auNumber + ':' + intensity);
        }
    },
    
    
    setTargets : {
        value : function (targetWeights, smoothTimes) {	

			// Blendshapes
            
            for(var i=0; i<this.unityBlendshapes.length; i=i+1){
                blendshape = this.unityBlendshapes[i];
                if ('AUid' in blendshape){
                    var AUid = blendshape.AUid;
                    AUIndex = this.FacsLib.ActionUnitsList.findIndex( function(elem, index, array){return elem.id == AUid;} );
                    this.weights[i] = targetWeights[AUIndex]; this.smoothTimes[i] = smoothTimes[AUIndex];
                }
                else if ('VisemeName' in blendshape){
                    var VisemeName = blendshape.VisemeName;
                    var offset = this.FacsLib.ActionUnitsList.length;
                    VisemeIndex = this.FacsLib.VisemesList.findIndex( function(elem, index, array){return elem.name == VisemeName;} );
                    this.weights[i] = targetWeights[VisemeIndex+offset]; this.smoothTimes[i] = smoothTimes[VisemeIndex+offset];
                }
            }
            

            var param = "";
            for(var i=0; i<this.unityBlendshapes.length; i=i+1){
                //console.log(i);
                param = param + this.weights[i].toFixed(1) + ";" + this.smoothTimes[i].toFixed(1) + ";";
            }
            
            gameInstance.SendMessage('FACcontroler', 'SetAllTargetWeights', param);
            
			
			
			
			
			// Boneshapes
			
			
            for(var i=0; i<this.unityBoneshapes.length; i=i+1){
                boneshape = this.unityBoneshapes[i];
                if ('AUid' in boneshape){
                    var AUid = boneshape.AUid;
                    AUIndex = this.FacsLib.ActionUnitsList.findIndex( function(elem, index, array){return elem.id == AUid;} );
                    this.boneWeights[i] = targetWeights[AUIndex]; this.boneSmoothTimes[i] = smoothTimes[AUIndex];
                }
            }			
			
            var param = "";
            for(var i=0; i<this.unityBoneshapes.length; i=i+1){
                param = param + this.boneWeights[i].toFixed(1) + ";" + this.boneSmoothTimes[i].toFixed(1) + ";";
            }			
			
			gameInstance.SendMessage('FACcontroler', 'SetAllTargetBoneWeights', param);
		
        }
    },

    setEyeTargetViewport : {
	    value : function(x, y, z){
	        var param = "";
            param = param + x.toFixed(2) + ";";
            param = param + y.toFixed(2) + ";";
            param = param + z.toFixed(2) + ";";

            gameInstance.SendMessage('FACcontroler', 'SetEyeTargetViewport', param);
        }
    },

	setEyeTarget : {
		value : function(x,y,z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible){
			var param = "";
			param = param + x.toFixed(2) + ";";
			param = param + y.toFixed(2) + ";";
			param = param + z.toFixed(2) + ";";
			param = param + eyesWeight.toFixed(2) + ";";
			param = param + eyesSmoothTime.toFixed(2) + ";";
			param = param + headWeight.toFixed(2) + ";";
			param = param + headSmoothTime.toFixed(2) + ";";
			param = param + debugVisible.toFixed(2) + ";";
			
			gameInstance.SendMessage('FACcontroler', 'SetEyeTarget', param);
		}
	},
	
	getEyeTargetPosition : {
		value : function(){
			gameInstance.SendMessage('FACcontroler', 'GetEyeTargetPosition', '');
		}
	},
	
	setLocalEyeTarget : {
		value : function(x,y,z, eyesWeight, eyesSmoothTime, headWeight, headSmoothTime, debugVisible){
			var param = "";
			param = param + x.toFixed(2) + ";";
			param = param + y.toFixed(2) + ";";
			param = param + z.toFixed(2) + ";";
			param = param + eyesWeight.toFixed(2) + ";";
			param = param + eyesSmoothTime.toFixed(2) + ";";
			param = param + headWeight.toFixed(2) + ";";
			param = param + headSmoothTime.toFixed(2) + ";";
			param = param + debugVisible.toFixed(2) + ";";
			
			gameInstance.SendMessage('FACcontroler', 'SetLocalEyeTarget', param);
		}
	},
	
	setEyeTargetViewport : {
		value : function(x,y,z) {
			var param = "";
			param = param + x.toFixed(2) + ";";
			param = param + y.toFixed(2) + ";";
			param = param + z.toFixed(2) + ";";
			engine.viewportLookPoint[0] = x;
			engine.viewportLookPoint[1] = y;
			engine.viewportLookPoint[2] = z;
			//console.log(x,y,z);
			gameInstance.SendMessage('FACcontroler', 'SetEyeTargetViewport', param);
		}
	},

	getLocalEyeTargetPosition : {
		value : function(){
			gameInstance.SendMessage('FACcontroler', 'GetLocalEyeTargetPosition', '');
		}
	},
	
	getEyeTargetPosition : {
		value : function(){
			gameInstance.SendMessage('FACcontroler', 'GetEyeTargetPosition', '');
		}
	},
	
	setCameraPosition : {
		value : function(x,y,z, rx, ry, rz){
			var param = "";
			param = param + x.toFixed(2) + ";";
			param = param + y.toFixed(2) + ";";
			param = param + z.toFixed(2) + ";";
			param = param + rx.toFixed(2) + ";";
			param = param + ry.toFixed(2) + ";";
			param = param + rz.toFixed(2) + ";";
			
			gameInstance.SendMessage('FACcontroler', 'SetCameraPosition', param);	
		}
	},
	
	setLocalCameraPosition : {
		value : function(x,y,z, rx, ry, rz){
			var param = "";
			param = param + x.toFixed(2) + ";";
			param = param + y.toFixed(2) + ";";
			param = param + z.toFixed(2) + ";";
			param = param + rx.toFixed(2) + ";";
			param = param + ry.toFixed(2) + ";";
			param = param + rz.toFixed(2) + ";";
			
			gameInstance.SendMessage('FACcontroler', 'SetLocalCameraPosition', param);	
		}
	},
	
	getLocalCameraPosition : {
		value : function(){
			gameInstance.SendMessage('FACcontroler', 'GetLocalCameraPosition', '');	
		}
	}
	
});
EngineWebGL_u3d.prototype.constructor = EngineWebGL_u3d;

cameraPositionX = 0;
cameraPositionY = 0;
cameraPositionZ = 0;
localCameraPositionX = 0;
localCameraPositionY = 0;
localCameraPositionZ = 0;

function cameraPosition(x,y,z) {
	cameraPositionX = x;
	cameraPositionY = y;
	cameraPositionZ = z;
	// This is to access the camera position from within modules
	engine.cameraPosition[0] = x;
	engine.cameraPosition[1] = y;
	engine.cameraPosition[2] = z;
	//console.log("Call from Unity:"+x+", "+y+", "+z);
}

function centerHeadPosition(x,y,z) {
	// This is to access the center of the head position of the character
	engine.centerHeadPosition[0] = x;
	engine.centerHeadPosition[1] = y;
	engine.centerHeadPosition[2] = z;
	//console.log("Call from Unity:"+x+", "+y+", "+z);
}

function localCameraPosition(x,y,z) {
	localCameraPositionX = x;
	localCameraPositionY = y;
	localCameraPositionZ = z;
}

eyeTargetPositionX = 0;
eyeTargetPositionY = 0;
eyeTargetPositionZ = 0;
localEyeTargetPositionX = 0;
localEyeTargetPositionY = 0;
localEyeTargetPositionZ = 0;

function eyeTargetPosition(x,y,z) {
	eyeTargetPositionX = x;
	eyeTargetPositionY = y;
	eyeTargetPositionZ = z;
}

function localEyeTargetPosition(x,y,z) {
	localEyeTargetPositionX = x;
	localEyeTargetPositionY = y;
	localEyeTargetPositionZ = z;
}