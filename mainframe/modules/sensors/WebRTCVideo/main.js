/*
** Test module
** Author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

/*****************************************************************\
** WebRTCVideo provider
\*****************************************************************/

/**
 * Module that displays video on HTML 
 * @class
 * @augments AbstractModule
 */
var WebRTCVideo = Class.create(AbstractModule,
{
    /**
     * Initialize Video Display in browswer.  
     * @return {void}
     *
     * @memberof WebRTCVideo#
     */
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "WebRTCVideo"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Sensor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden
        
        self.vid = new VideoStream();
        
        self.providedResources.push(self.vid);
        
        var constraints = window.constraints = { audio: false, video: true };

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream)
        {
            var videoTracks = stream.getVideoTracks();
            console.log('Using video device: ' + videoTracks[0].label);
            stream.onended = function()
            {
                console.log('Stream ended');
            };
            self.vid.container.videoStream = stream;
        })
        .catch(function(error)
        {
            if (error.name === 'ConstraintNotSatisfiedError')
            {
                self.errorMsg('The resolution ' + constraints.video.width.exact + 'x' + constraints.video.width.exact + ' px is not supported by your device.');
            }
            else if (error.name === 'PermissionDeniedError')
            {
                self.errorMsg('Permissions have not been granted to use your camera and ' + 'microphone, you need to allow the page access to your devices in ' + 'order for the demo to work.');
            }
            self.errorMsg('getUserMedia error: ' + error.name, error);
        });
    },
    
    /**
     * Helper function for printing out error messages.
     * @param  {String} msg   Message to be displayed
     * @param  {Object} error Error Code printed to console
     * @return {void}
     *
     * @memberof WebRTCVideo#
     */
    errorMsg: function(msg, error)
    {
        console.log(msg);
        if (typeof error !== 'undefined')
        {
            console.error(error);
        }
    },
    
    /**
     * WebRTCVideo step function; called by the mainframe.
     * @return {void}
     *
     * @memberof WebRTCVideo#
     */
    run: function()
    {
        //nothing to do for now
    }
});