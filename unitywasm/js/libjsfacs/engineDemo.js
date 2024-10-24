function EngineDemo() {
	//appel au constructeur de la class parent
	Engine3D.call(this);
	//exemple redifinition de function
	this.arrayFunction["4"] = "browLowererBis";
};

EngineDemo.prototype = Object.create(Engine3D.prototype, {
	neutralFace : {
		value: function() {
			console.log("neutral face implemented in engine demo");
		}
	},
	innerBrowRaiser : {
		value : function(intencity,lorR) {
			console.log("innerBrowRaiser  implemented in engine demo");
		}
	},
	outerBrowRaiser : {
		value : function(intencity,lorR) {
			console.log("outerBrowRaiser  implemented in engine demo");
		}
	},
	browLowererBis : {
		value : function(intencity,lorR) {
			console.log("browLowererBis  implemented in engine demo");
		}
	}
	
	
});
EngineDemo.prototype.constructor = EngineDemo;


