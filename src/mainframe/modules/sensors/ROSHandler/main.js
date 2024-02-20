/*
** Module for eEva framework to communicate with ROS framework
** Author: Zishi Wu, Joseph Masterjohn, Ubbo Visser
** E-mail: zishi@cs.miami.edu
*/

/*****************************************************************\
 ** ROS Handler module - publish and subscribe to ROS topics
 \*****************************************************************/

var ROSHandler = Class.create(AbstractModule,
    {
        initialize: function($super, params)
        {
            var self = this;

            $super(params);

            self.name = "ROSHandler"; //unknown name, to be overriden by subclasses
            self.type = ModuleType.Sensor; //unknown type, to be overriden
            self.mandatory = false; //is this model mandatory ? to be overriden

            self.providedResources.push(new UserText()); //dummy

            // Example of JS anonymous async function and promise handler
            // Courtesy of Joseph Masterjohn
            // Create connection between eEva and ROS using roslib.js
            (async function() {
                const ros = await new ROSLIB.Ros({
                    url: 'ws://hsrb.local:9090'
                });
                return ros;
            })().then(function(ros_connection) {
                self.ros = ros_connection;
                console.log('set self.ros to ros')
                console.log(self.ros);

                self.ros.on('connection', function() {
                    console.log('Connected to websocket server.');
                });

                self.ros.on('error', function(error) {
                    console.log('Error connecting to websocket server: ', error);
                });

                self.ros.on('close', function() {
                    console.log('Connection to websocket server closed.');
                });

                // listen to topic look_point (type: geometry_msgs/Point) and store the most recent value
                self.eyeTargetViewportListener = new ROSLIB.Topic({
                    ros : self.ros,
                    name : '/hsrb/EyeTargetViewport',
                    messageType : 'geometry_msgs/Point'
                });

                // function viewportLookPoint: get and set the most recent lookPoint
                self.eyeTargetViewportListener.subscribe(function(message) {
                    console.log('Received message on ' + self.eyeTargetViewportListener.name + ': ' + message.x + " " + message.y + " " + message.z);
                    engine.setEyeTargetViewport(message.x, message.y, message.z);
                });
            });

            // Getting camera positions from Unity scene, might be 0 in initialize
            self.centerHeadPositionX = engine.centerHeadPosition[0];
            self.centerHeadPositionY = engine.centerHeadPosition[1];
            self.centerHeadPositionZ = engine.centerHeadPosition[2];
            self.centerHeadPositionUpdated = false;
        },

        run: function()
        {   
            var self = this;

            // // Only runs this once
            // // We might not have position values yet.
            // if (!self.centerHeadPositionUpdated || self.centerHeadPositionX == 0){

            //     self.centerHeadPositionX = engine.centerHeadPosition[0];
            //     self.centerHeadPositionY = engine.centerHeadPosition[1];
            //     self.centerHeadPositionZ = engine.centerHeadPosition[2];

            //     console.log(self.centerHeadPositionX);
            //     console.log(self.centerHeadPositionY);
            //     console.log(self.centerHeadPositionZ);

            //     self.centerHeadPositionUpdated = true;
            // }

            // We might not have position values yet.

            self.centerHeadPositionX = engine.centerHeadPosition[0];
            self.centerHeadPositionY = engine.centerHeadPosition[1];
            self.centerHeadPositionZ = engine.centerHeadPosition[2];

            if (self.centerHeadPositionX != 0) {
                //console.log("CenterHeadPos: "+self.centerHeadPositionX+" "+self.centerHeadPositionY+" "+self.centerHeadPositionZ);
            }
        }
    });
