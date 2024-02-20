/*****************************************************************\
 ** VisFACSSchererFearFields Module
 ** This module animates a character's facial expression to
 ** demonstrate fear according to Scherer's findings, with
 ** specific attention to the timing and intensity of Action Units.
\*****************************************************************/

var VisFACSSchererFearFields = Class.create(AbstractModule, {
    initialize: function($super, params) {
        var self = this;

        $super(params);

        self.name = "VisFACSSchererFearFields";
        self.type = ModuleType.Processor;
        self.mandatory = false;

        // Initialize an array to keep track of timeout IDs for cleanup
        self.timeouts = [];
    },

    // Helper function to apply an AU change and ensure rendering
    applyAUChange: function(AU, intensity, side, smoothTime) {
        facslib.setTargetAU(AU, intensity, side, smoothTime);
        facslib.updateEngine(); // Call render function here to apply changes
    },

    // Main run function for the module
    run: function() {
        var self = this;

        // Immediate mouth opening at the start to indicate shock
        self.applyAUChange("26", 100, "", 0.1); // Quick mouth opening with high intensity

        // Close mouth after 0.8 seconds
        self.timeouts.push(setTimeout(() => {
            self.applyAUChange("26", 0, "", 0.1); // Quick mouth closing
        }, 800));

        // Eyebrow raise to indicate start of fear response
        self.timeouts.push(setTimeout(() => {
            self.applyAUChange("1", 100, "", 0.5); // Moderate intensity for AU1
            self.applyAUChange("2", 100, "", 0.5); // Moderate intensity for AU2
        }, 800)); // Start raising eyebrows after mouth starts to close

        // Eyebrow bounce cycles
        var bounceDelay = 800; // Start after mouth starts to close
        for (let i = 1; i <= 3; i++) {
            // Increase intensity for bounce
            self.timeouts.push(setTimeout(() => {
                self.applyAUChange("1", 150, "", 0.2); // Increase intensity for AU1
                self.applyAUChange("2", 150, "", 0.2); // Increase intensity for AU2
            }, bounceDelay + i * 400));

            // Return to moderate intensity
            self.timeouts.push(setTimeout(() => {
                self.applyAUChange("1", 100, "", 0.2); // Decrease intensity for AU1
                self.applyAUChange("2", 100, "", 0.2); // Decrease intensity for AU2
            }, bounceDelay + i * 400 + 200));
        }

        // Return face to normal after the last bounce
        self.timeouts.push(setTimeout(() => {
            self.applyAUChange("1", 0, "", 0.5); // Reset AU1
            self.applyAUChange("2", 0, "", 0.5); // Reset AU2
            self.applyAUChange("26", 0, "", 0.5); // Ensure mouth is closed
        }, bounceDelay + 3 * 400 + 200));
    },

    // Cleanup function to clear all timeouts
    clearAllTimeouts: function() {
        var self = this;
        self.timeouts.forEach(clearTimeout);
        self.timeouts = []; // Reset the timeouts array
    }
});

// Ensure to instantiate and register the module where appropriate in your system
