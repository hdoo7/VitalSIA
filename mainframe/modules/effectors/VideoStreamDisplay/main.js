/*
** Test module
** Author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

/*****************************************************************\
** VideoStreamDisplay
\*****************************************************************/

var VideoStreamDisplay = Class.create(AbstractModule,
{
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "VideoStreamDisplay"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Effector; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden
        
        self.requiredResourceNames = {
            VIDEOSTREAM: 0
        };
        
        self.requiredResources[self.requiredResourceNames.VIDEOSTREAM] = new VideoStream();
    },
    
    run: function()
    {
        var self = this;
        
        if (self.active)
        {
            var video = document.querySelector('#videoel');

            if(video != null){
                if ((video.paused || video.srcObject === undefined || video.srcObject === null) && self.requiredResources[self.requiredResourceNames.VIDEOSTREAM].container.videoStream != null)
                {
                    video.srcObject = self.requiredResources[self.requiredResourceNames.VIDEOSTREAM].container.videoStream;

                    video.play();
                }
            }
        }
        else
        {
            var video = document.querySelector('#videoel');
            video.pause();
        }
    }
});