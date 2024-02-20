var unityWebGLContentLoaded = false; //read by VirtualysCharacter module
character = {
    id: "001_FEMALE_CAU",
    name: "Amy",
    //description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque felis ex, cursus a " + "turpis ac, laoreet sollicitudin ipsum. Cras hendrerit eget elit ut pretium. Proin vel diam consectetur, " + "pharetra magna et, placerat tellus. Donec dignissim tempus dolor, ac interdum dui sagittis in. In maximus " + "diam sed lacus mollis maximus. Nunc gravida varius lorem vitae bibendum. Nunc sit amet mattis ipsum, eu " + "pellentesque ex. Cras porta condimentum neque, nec mattis eros suscipit eu. Curabitur ac elementum sem. ",
    img: "unity/img/001_FEMALE_CAU.PNG",
    type: "virtualys",
    // path: "unity/sources/001_FEMALE_CAU_2017_11_22/",
    path: "https://evalibre.blob.core.windows.net/evalibre/001_FEMALE_CAU_2019_05_06/",
    scene: "scene_001_FEMALE_CAU",
    voiceIndex: 5
}
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
