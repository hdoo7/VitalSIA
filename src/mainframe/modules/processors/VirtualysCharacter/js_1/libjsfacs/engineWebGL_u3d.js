function EngineWebGL_u3d() {
	//appel au constructeur de la class parent
	Engine3D.call(this);

    this.weights = Array.apply(null, new Array(69)).map(Number.prototype.valueOf,0);
    this.smoothTimes = Array.apply(null, new Array(69)).map(Number.prototype.valueOf,0);
};


EngineWebGL_u3d.prototype = Object.create(Engine3D.prototype, {

    
    setAU : {
        value : function (auNumber, intensity, lorR) {
            SendMessage('FAC_controller', 'change', auNumber + ':' + intensity);
        }
    },
    
    
    setTargets : {
        value : function (targetWeights, smoothTimes) {	
            for(var i=1; i<=29; i=i+1){ // innerBrowRaiser - Jaw Thrust
                this.weights[i] = targetWeights[i]; this.smoothTimes[i] = smoothTimes[i];
            }
            
            // Jaw Sideways. FBX has separate R and L blendshapes; R is currently unused.
            this.weights[29] = targetWeights[29]; this.smoothTimes[29] = smoothTimes[29];
            
            for(var i=31; i<=36; i=i+1){ // Jaw Clencher - Tongue Bulge
                this.weights[i] = targetWeights[i-1]; this.smoothTimes[i] = smoothTimes[i-1];
            }
           
            // 37 (Lip wipe) doesn't exist in FBX
            this.weights[37] = targetWeights[37]; this.smoothTimes[37] = smoothTimes[37]; // Nostril Dilator
            this.weights[38] = targetWeights[38]; this.smoothTimes[38] = smoothTimes[38]; // Nostril Compressor
            // 40 doesn't exist in FACS                                                 
            this.weights[39] = targetWeights[40]; this.smoothTimes[39] = smoothTimes[40]; // 
            this.weights[40] = targetWeights[41]; this.smoothTimes[40] = smoothTimes[41]; // 
            this.weights[41] = targetWeights[42]; this.smoothTimes[41] = smoothTimes[42]; // 
            this.weights[42] = targetWeights[43]; this.smoothTimes[42] = smoothTimes[43]; // 
            this.weights[43] = targetWeights[44]; this.smoothTimes[43] = smoothTimes[44]; // 
            this.weights[44] = targetWeights[45]; this.smoothTimes[44] = smoothTimes[45]; // Separate R and L blendshapes too
            // Head movement codes not implemented yet                               
            this.weights[46] = targetWeights[65]; this.smoothTimes[46] = smoothTimes[65]; // Walleye
            
            for(var i=0; i<=21; i=i+1){ // Visemes
                this.weights[i+48] = targetWeights[i+69]; this.smoothTimes[i+48] = smoothTimes[i+69];
            }
            
            var param = "";
            for(var i=0; i<69; i=i+1){
                param = param + this.weights[i].toFixed(1) + ";" + this.smoothTimes[i].toFixed(1) + ";";
            }
            
            SendMessage('FACcontroler', 'SetAllTargetWeights', param);
            
        }
    }
    
    
    
    
    
    
});
EngineWebGL_u3d.prototype.constructor = EngineWebGL_u3d;


