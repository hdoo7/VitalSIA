/*
** Main app configuration
** Author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

//------------------------------------------//
// Configuration
//------------------------------------------//

//current website url
location.origin = location.protocol + "//" + location.host;

//configuration file url
var config = {};
config.baseDirectory = location.origin;

config.appDirectory = config.baseDirectory+"/mainframe";

//config.mainAppConfig = config.baseDirectory+"/eEvaConfig.xml";

config.moduleDirectory = config.appDirectory+"/modules";

config.utilsDirectory = config.appDirectory+"/utils";
