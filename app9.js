            progressObj.howMuchHowOften = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        if (!progressObj.familyHistory) {
            progressObj.familyHistory = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        if (!progressObj.myDrinking) {
            progressObj.myDrinking = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        if (!progressObj.otherDrugs) {
            progressObj.otherDrugs = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        if (!progressObj.ARP) {
            progressObj.ARP = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        if (!progressObj.depression) {
            progressObj.depression = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        if (!progressObj.MAST) {
            progressObj.MAST = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        if (!progressObj.dependence) {
            progressObj.dependence = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }
        /*if(!progressObj.likeDontLike){
            progressObj.likeDontLike = [{
                "timestamp": "",
                "responsesPtr": [],
                "percentageComplete": "0",
                "currentElement": ""
            }];
        }*/

        return {
            user: userObj,
            GTNSGT: progressObj.GTNSGT,
            audit: progressObj.audit,
            howMuchHowOften: progressObj.howMuchHowOften,
            familyHistory: progressObj.familyHistory,
            myDrinking: progressObj.myDrinking,
            otherDrugs: progressObj.otherDrugs,
            ARP: progressObj.ARP,
            depression: progressObj.depression,
            MAST: progressObj.MAST,
            dependence: progressObj.dependence
            //likeDontLike: progressObj.likeDontLike
        };
    };

    this.createProgress = function (userObj, progressObj) {
        var deferred = $q.defer();
        var object = new schema();

        var defaultProgress = _this2.prototype(userObj, progressObj);

        object.set('user', defaultProgress.user);
        object.set('GTNSGT', defaultProgress.GTNSGT);
        object.set('audit', defaultProgress.audit);
        object.set('howMuchHowOften', defaultProgress.howMuchHowOften);
        object.set('familyHistory', defaultProgress.familyHistory);
        object.set('myDrinking', defaultProgress.myDrinking);
        object.set('otherDrugs', defaultProgress.otherDrugs);
        object.set('ARP', defaultProgress.ARP);
        object.set('depression', defaultProgress.depression);
        object.set('MAST', defaultProgress.MAST);
        object.set('dependence', defaultProgress.dependence);
        //object.set('likeDontLike', defaultProgress.likeDontLike);

        object.save(null).then(function (progress) {
            return deferred.resolve(progress);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.getUserProgress = function (userObj) {
        var deferred = $q.defer();
        var query = new Parse.Query(schema);

        query.equalTo('user', userObj);

        query.first(function (progress) {

            deferred.resolve(progress);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.updateUserProgress = function (progress) {
        var deferred = $q.defer();
        var object = new schema();

        object.set('user', progress.user);
        object.set('GTNSGT', progress.GTNSGT);
        object.set('audit', progress.audit);
        object.set('howMuchHowOften', progress.howMuchHowOften);
        object.set('familyHistory', progress.familyHistory);
        object.set('myDrinking', progress.myDrinking);
        object.set('otherDrugs', progress.otherDrugs);
        object.set('ARP', progress.ARP);
        object.set('depression', progress.depression);
        object.set('MAST', progress.MAST);
        object.set('dependence', progress.dependence);
        //object.set('likeDontLike', progress.likeDontLike);

        object.save(null).then(function (response) {
            return deferred.resolve(response);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };
}
'use strict';

angular.module('app').factory('Response', Response);
angular.module('app').service('ResponseService', ResponseService);

Response.$inject = ['$q'];
ResponseService.$inject = ['$q', 'Response'];

function Response($q) {
    Response = function Response(object) {
        var _this = this;

        this.object = object;

        this.user = object.get('user'); //ptr to the user that response belongs to
        this.element = object.get('element'); //the element that the response belongs to
        this.answer = object.get('answer'); //the answer that the user has selected as their response

        this.save = function () {

            var deferred = $q.defer();

            _this.object.set('user', _this.user);
            _this.object.set('element', _this.element);
            _this.object.set('answer', _this.answer);

            _this.object.save(null).then(function (success) {
                return deferred.resolve(success);
            }, function (error) {
                return deferred.reject(error);
            });

            return deferred.promise;
        };
    };

    return Response;
}

function ResponseService($q, Response) {
    var _this2 = this;

    var schema = Parse.Object.extend('Response');

    this.prototype = function (response, form) {
        return {
            user: response.user,
            element: element,
            answer: response.answer
        };
    };

    this.getResponsesByUser = function (user) {
        var deferred = $q.defer();
        var query = new Parse.Query(schema);

        query.equalTo('user', user);

        query.find(function (response) {
            var results = [];
            response.forEach(function (res) {
                return results.push(new Response(res));
            });
            deferred.resolve(results);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.saveResponse = function (response, form) {

        var deferred = $q.defer();
        var object = new schema();

        var defaultResponse = _this2.prototype(response, form);

        object.set('user', defaultResponse.user);
        object.set('element', defaultResponse.element);
        object.set('answer', defaultResponse.answer);

        object.save(null).then(function (response) {
            return deferred.resolve(response);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };
}
'use strict';

angular.module('app').factory('User', User);
angular.module('app').service('UserService', UserService);
angular.module('app').service('AuthService', AuthService);
angular.module('app').service('AdminService', AdminService);

User.$inject = ['$q'];
UserService.$inject = ['$q', 'User'];
AuthService.$inject = ['$q', 'User'];
AdminService.$inject = ['$q', 'User'];

function User($q) {
    User = function User(object) {
        var _this = this;

        this.object = object;
        this.responses = object.get('responses');

        this.save = function () {
            var deferred = $q.defer();

            object.set('responses', _this.responses);

            _this.object.save(null).then(function (success) {
                return deferred.resolve(success);
            }, function (error) {
                return deferred.reject(error);
            });

            return deferred.promise;
        };
    };

    return User;
}
function UserService($q, User) {
    //Todo: need to see if the current user is admin first

    //query database for all active users
    this.getActiveUsers = function () {
        var deferred = $q.defer();
        var ActiveUser = Parse.Object.extend("User");
        var queryActiveUsrs = new Parse.Query(ActiveUser);

        //find active users and only return user name
        queryActiveUsrs.find(function (response) {
            var allUsers = [];
            response.forEach(function (res) {
                return allUsers.push(res.get('username'));
            });
            deferred.resolve(allUsers);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.validateUserbyEmail = function (usrEmail) {
        var deferred = $q.defer();
        var FindUser = Parse.Object.extend("User");
        var queryUsr = new Parse.Query(FindUser);
        var userIsValid = false;

        queryUsr.equalTo('email', usrEmail);
        queryUsr.equalTo('emailVerified', true);

        queryUsr.first(function (response) {
            userIsValid = true;
            deferred.resolve(userIsValid);
        }, function (error) {
            userIsValid = false;
            deferred.resolve(userIsValid);
        });

        return deferred.promise;
    };

    //query database and get user with usrname matching usrID
    this.getUsrByUsrName = function (usrID) {
        var deferred = $q.defer();
        var FindUser = Parse.Object.extend("User");
        var queryUsrs = new Parse.Query(FindUser);

        //find active users and only return user name
        queryUsrs.equalTo("username", usrID);
        queryUsrs.find(function (usr) {
            var newAdmin = usr[0];
            deferred.resolve(newAdmin);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.updatePW = function (enteredEmail, enteredDOB) {
        var deferred = $q.defer();
        var ActiveUser = Parse.Object.extend("User");
        var queryActiveUsrs = new Parse.Query(ActiveUser);

        /*console.log(enteredEmail);
        console.log(enteredDOB);*/
        queryActiveUsrs.equalTo('email', enteredEmail);
        queryActiveUsrs.equalTo('dateOfBirth', enteredDOB);

        queryActiveUsrs.first(function (res) {
            console.log("found user in userSrvc.updatePw");
            var fpUser = res;
            deferred.resolve(fpUser);
        }, function (error) {
            return deferred.reject(error);
        });
        return deferred.promise;
    };

    this.changePW = function (npw, usr) {
        var deferred = $q.defer();
        /*let ActiveUser = Parse.Object.extend("User");
        let queryActiveUsrs = new Parse.Query(ActiveUser);*/

        // console.log("start changePW");
        // console.log(usr.id);

        //queryActiveUsrs.equalTo('objectId', usr.id);

        /*queryActiveUsrs.first(
            res => {
                console.log("in User Service.............");
                console.log(res);
               res.set("password", newPW);
               res.save(null, {useMasterKey: true}).then(
                   success => {console.log("user credentials updated in DB")},
                   error => {
                       console.log(error);
                   }
               );
            },
            error => deferred.reject(error)
        );*/
        //Parse.Cloud.run('addResponse', { elemID: elemID, answer: [answer] });
        Parse.Cloud.run('updatePW', { updateUsr: usr.id, newPW: npw });

        return deferred.promise;
    };
}
function AuthService($q) {
    this.register = function (credentials) {
        var deferred = $q.defer();

        var user = new Parse.User();

        user.set("username", credentials.username);
        user.set("password", credentials.password);
        user.set("email", credentials.email);
        user.set("firstName", credentials.firstname);
        //user.set("lastName", credentials.lastname);
        user.set("ethnicity", credentials.ethnicity);
        user.set("education", credentials.education);
        user.set("gender", credentials.gender);
        user.set("race", credentials.race);
        user.set("dateOfBirth", credentials.dateOfBirth);
        user.set("age", credentials.age);
        user.set("maritalStatus", credentials.maritalstatus);
        user.set("weight", credentials.weight);
        user.set("heightTotal", credentials.height.total);
        user.set("programRequired", credentials.answers);
        user.set("tempUser", credentials.tempUser);

        user.set("responses", credentials.responses || []);

        user.signUp(null).then(function (success) {
            return deferred.resolve(success);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.logout = function () {
        var deferred = $q.defer();

        Parse.User.logOut().then(function (success) {
            return deferred.resolve(success);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.login = function (credentials) {
        var deferred = $q.defer();

        Parse.User.logIn(credentials.username, credentials.password).then(function (success) {
            return deferred.resolve(success);
        }, function (error) {
            return deferred.reject(error);
        });

        return deferred.promise;
    };

    this.currentUser = function () {
        return Parse.User.current() ? new User(Parse.User.current()) : null;
    };
}

function AdminService($q, User) {

    this.setUpRole = function () {
        var roleACL = new Parse.ACL();
        var role = new Parse.Role("Administrator", roleACL);
        roleACL.setPublicReadAccess(true);
        role.save();
    };

    this.addUserToAdminGroup = function (usr) {
        var deferred = $q.defer();

        Parse.Cloud.run('addToAdminGroup', { userToAdmin: usr }).then(function (success) {
            return deferred.resolve(success);
        }, function (error) {
            return deferred.reject(error);
        });
        return deferred.promise;
    };
}
//# sourceMappingURL=app.min.js.map
