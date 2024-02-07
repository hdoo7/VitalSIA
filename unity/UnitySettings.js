var unityWebGLContentLoaded = false; //read by VirtualysCharacter module

var nb_slider = 3;
console.log('Character path:',character.path)
var gameInstance = UnityLoader.instantiate("gameContainer", character.path + "webgl.json");
// var gameInstance = UnityLoader.instantiate("gameContainer", "/Users/visser/Sources/eEva-HSR/public/unity/sources/001_FEMALE_CAU_2017_11_22/" + "webgl.js");

var engine = new EngineWebGL_u3d();
var facslib =  new FacsLib(engine);
engine.FacsLib = facslib;

function U3_sceneLoaded() {
    if(!unityWebGLContentLoaded) {
        engine.getLocalCameraPosition();
        engine.getLocalEyeTargetPosition();
        facslib.updateEngine();
    }
}
function U3_startSceneLoaded() {
    if(!unityWebGLContentLoaded) {

        //facslib.load('scene_environment_simple', 'scene_character_WhiteMan');
        facslib.load('scene_environment_simple', character.scene);
        //facslib.load('scene_no_environment', character.scene);
        unityWebGLContentLoaded = true;

        var scope = angular.element($("#content")).scope();

        scope.$apply(function() {
            scope.unityLoaded();
        });
    }
}
