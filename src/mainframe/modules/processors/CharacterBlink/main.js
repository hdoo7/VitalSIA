/*****************************************************************\
 ** Blink module
 \*****************************************************************/


var CharacterBlink = Class.create(AbstractModule,
    {
        initialize: function($super, params)
        {
            var self = this;

            $super(params);

            self.name = "CharacterBlink";
            self.type = ModuleType.Processor;
            self.mandatory = false;

            //blinking
            self.blinkIntensity = 1;
            self.blinkInterval = 5000;
            self.blinkDelay = 100;
            self.lastBlink = Date.now();
        },

        run: function()
        {
            var self = this;

            var now = Date.now();
            self.blinkElapsed = now - self.lastBlink;

            if(self.blinkElapsed > self.blinkInterval) {
                self.blinkUp = self.blinkElapsed - self.blinkInterval > self.blinkDelay;

                if (self.blinkUp) { // happens once the delay has been reached
                    self.lastBlink = now;
                    facslib.setTargetAU("45", 0, "", 0.05);
                    self.blinkInterval = (Math.random() * 1000) + 3000; //allows 15-20 blinks per minute - avg for human
                    self.stop = false;
                } else { // happens if the delay has not been reached yet
                    if(!self.stop) { // so that this only runs once, we use a boolean
                        facslib.setTargetAU("45", 100, "", 0.05);
                    }
                    self.stop = true;
                }

                facslib.updateEngine();
            }
        }
    });
