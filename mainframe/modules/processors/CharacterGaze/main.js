/*
** Module containing clmtrackr by Audun Mathias Øygard - https://github.com/auduno/clmtrackr
** Module author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

/*****************************************************************\
 ** Character Gaze module
 \*****************************************************************/

/**
 * Module that allows for the character's gaze to follow the user on the screen
 * @class
 * @augments AbstractModule
 */
var CharacterGaze = Class.create(AbstractModule,
    {

        initialize: function($super, params)
        {
            var self = this;

            $super(params);

            self.name = "CharacterGaze";
            self.type = ModuleType.Processor;
            self.mandatory = false;

            self.resourceNames = {
                R_CHARGAZE: 0,
                R_CHARNOD: 1
            };

            self.requiredResources[self.resourceNames.R_CHARGAZE] = new CharacterEyeGaze();
            self.optionalResources[self.resourceNames.R_CHARGAZE] = new CharacterEyeGaze(); //make optional
            self.requiredResources[self.resourceNames.R_CHARNOD] = new IsNodding();
            self.optionalResources[self.resourceNames.R_CHARNOD] = new IsNodding(); //make optional


        },

        run: function() {
            var self = this;

            var normalX = self.requiredResources[self.resourceNames.R_CHARGAZE].container.normalX;
            var normalY = self.requiredResources[self.resourceNames.R_CHARGAZE].container.normalY;

            //Beginning char gaze by ehenl001@fiu.edu

            if (!self.requiredResources[self.resourceNames.R_CHARNOD].container.isNodding){
                if (!isNaN(normalX) && !isNaN(normalY)) {
                    //var intensity = Math.floor((normalX * 100));
                    var intensityHorizontal = Math.round((normalX * 100)) / 4;
                    var intensityVertical = Math.round((normalY * 100)) / 4;
                    //console.log("Eye Gaze intensityHorizontal: " + intensityHorizontal + " Eye Gaze intensityVertical: " + intensityVertical);
                    if (intensityHorizontal < 0) {
                        //facslib.setTargetAU("62", 0, "", 0);
                        facslib.setTargetAU("51", Math.abs(intensityHorizontal) / 2, "", 0.0001); //head turn right
                        facslib.setTargetAU("61", Math.abs(intensityHorizontal), "", 0);

                    }
                    if (intensityHorizontal > 0) {

                        //facslib.setTargetAU("61", 0, "", 0);
                        facslib.setTargetAU("52", Math.abs(intensityHorizontal) / 2, "", 0.0001); //head turn left
                        facslib.setTargetAU("62", intensityHorizontal, "", 0);

                    }
                    if (intensityVertical < 0) {
                        //facslib.setTargetAU("62", 0, "", 0);
                        facslib.setTargetAU("63", Math.abs(intensityVertical), "", 0);
                        facslib.setTargetAU("53", Math.abs(intensityVertical), "", 0);

                    }
                    if (intensityVertical > 0) {

                        //facslib.setTargetAU("61", 0, "", 0);
                        facslib.setTargetAU("64", intensityVertical, "", 0);
                        facslib.setTargetAU("54", intensityVertical, "", 0);

                    }
                    facslib.updateEngine();
                }
            }
        }
    });