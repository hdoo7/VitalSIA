var TonyMM = Class.create(AbstractModule,{
    initialize: function($super, params){
        var self = this

        $super(params)

        self.name = "TonyMM";
        self.type = ModuleType.Processor;
        self.mandatory = false;

        self.resourceNames = {
            R_USERFACIALEXPRESSION: 0, 
        };

        self.requiredResources[self.resourceNames.R_USERFACIALEXPRESSION] = new UserFacialExpression();
        self.optionalResources[self.resourceNames.R_USERFACIALEXPRESSION] = new UserFacialExpression();

        //AU variables
        self.currentAU = "0";
        self.currentIntensity = 100;
        self.auDateTime = Date.now();

        self.faceResetTrigger = false;
        self.prevAU = 0
        self.prevAUs = []

        self.lastFaceTime = Date.now();

        self.index = 0
        self.numfaces = 0

        self.tony_aus = "";
        self.parsedAUs = []
        self.currentIndex = 0
        self.auStartIteratorTime = Date.now()
        self.firstAUIter = true
        self.tony_aus_parsed = false;

        self.file_name = '24hz_aus.txt'

        fetch(self.file_name)
            .then(response => response.text())
            .then(text => {
                self.tony_aus = text
                // console.log('Tony AUs - 1: ' + self.tony_aus)
            })
            .catch((e) => console.error(e))
    },

    faceReset: function(){
        var self = this;

        //Reset Face
        facslib.setNeutral(1.0);
        facslib.setNeutralViseme(0.0);
    },

    setAUSample: function(currentAU) {
        var self = this;

        var timeDiff = Date.now() - self.auDateTime;

        if (self.faceResetTrigger && timeDiff > 4000){
            // DEBUG
            // console.log('Face Reset - Neutral')
            
            self.faceReset()
            self.faceResetTrigger = false;
        }

        if (self.prevAU != currentAU && timeDiff > 8000){
            // DEBUG
            // console.log('Current AU: ' + currentAU);

            //Set target AU and time
            facslib.setTargetAU(currentAU, self.currentIntensity, "", 1);
            self.auDateTime = Date.now()
            
            self.prevAU = currentAU;

            //Increment for next elem in auList
            self.index += 1;
            self.faceResetTrigger = true;
        }
    },
    testAUCycle: function(auList) {
        var self = this;

        if (unityWebGLContentLoaded){
            if (self.index < auList.length)
                self.setAUSample(auList[self.index]);
            else
                self.faceReset()
        }
    },
    resetPrevAUs: function() {
        var self = this;

        if (self.prevAUs){
            console.log('prevAUs: ' + self.prevAUs);
            self.prevAUs.forEach((element) => facslib.setTargetAU(element, 0, "", 1));
        }
    },
    setAUs: function(auList) {
        var self = this;

        auList.forEach(element => {
            facslib.setTargetAU(element, 100, "", 1);
        });

        self.prevAUs = auList;
    },
    setFace: function(auList) {
        var self = this;

        //DEBUG
        // console.log('Current AU List: ' + auList);

        if(unityWebGLContentLoaded){
            self.setAUs(auList); 
            self.lastFaceTime = Date.now()
        }
    },    
    testSequentialFaces: function(testAUList) {
        var self = this;

        if (unityWebGLContentLoaded && self.numfaces <= 3){
            timeDiff = Date.now() - self.lastFaceTime
            if (self.faceResetTrigger && timeDiff > 4000){
                // console.log('Resetting prev AUs: ' + self.prevAUs)
                self.resetPrevAUs()
                self.faceResetTrigger = false
            }
            else if (timeDiff > 8000){
                //DEBUG
                // console.log('Current numface: ' + self.numfaces);
                
                self.setFace(testAUList);
                self.faceResetTrigger = true;
                self.numfaces += 1
            }
        }
        else{
            self.resetPrevAUs()
        }
    },
    parseAUs: function() {
        var self = this;

        lines = self.tony_aus.trim().split('\n')

        parsedData = lines.map(line => {
            [time, valuesStr] = line.split(';')

            timeValue = parseFloat(time)

            aus = {}

            valuePairs = valuesStr.split(',').reduce((acc, pairStr) => {
                [key, value] = pairStr.split(':')
                acc[key] = parseInt(value)
                return acc
            }, {})

            return { time: timeValue, AUs: valuePairs }
        })

        // DEBUG
        console.log('Parsed Data: ' + JSON.stringify(parsedData))

        return parsedData
    },
    AUIterator: function() {
        var self = this

        /*
        AUs used example

        1:53,2:43,10:49,12:60,13:43,18:55,22:56,51:0,52:72,53:25,54:0        
        */


        // Filtering with only one accepted key.
        // validKeyValues = ["12"]

        // Filtering with multiple accepted keys.
        // validKeyValues = ["10", "12", "13", "18", "22"]

        // validKeyValues = ["1", "2", "12", "13", "18", "22"]

        validKeyValues = ["1", "2", "10", "12", "13", "18", "51", "52", "53", "54"]
        eyeAUs = ["1", "2"]
        lipAUs = ["10", "12", "13", "18"]
        headAUs = ["51","52","53", "54"]


        if (self.firstAUIter){
            self.auStartIteratorTime = Date.now()
            self.firstAUIter = false
        } 
        
        timeDiff = (Date.now() - self.auStartIteratorTime) / 1000

        // console.log('TimeDiff: ' + timeDiff)

        if (self.currentIndex < self.parsedAUs.length){
            currentData = self.parsedAUs[self.currentIndex]

            time = currentData.time

            timeCheck = (timeDiff >= time)

            // console.log('TimeCheck: ' + Number.isInteger(time*24%5))

            // With timeCheck
            if (timeCheck){
                aus = currentData.AUs

                // Default no filtering
                // validKeyValues = Object.keys(aus)

                Object.entries(aus).forEach(([key, value]) => {
                    if (headAUs.includes(key) && Number.isInteger(time*3)){
                        value = Math.round(value*0.7)
                        console.log(`Time: ${time}, Key: ${key}, Value: ${value}`)
                        // facslib.setTargetAU(key, value, '', 0)
                        // facslib.setTargetAU(key, value, '', 0.1)
                        // facslib.setTargetAU(key, value, '', 5.0)
                        // facslib.setTargetAU(key, value, '', 1.0)
                        // facslib.setTargetAU(key, value, '', 2.0)
                        facslib.setTargetAU(key, value, '', 6.)
                        // facslib.updateEngine()
                        // facslib.setNeutral(0.0)
                    }
                    if (lipAUs.includes(key)){
                        value = Math.round(value*0.6)
                        console.log(`Time: ${time}, Key: ${key}, Value: ${value}`)

                        facslib.setTargetAU(key, value, '', 3.5)
                        facslib.setTargetAU(6, value*1.4, '', 3.5)
                        
                        // facslib.updateEngine()
                        // facslib.updateEngine()
                        // facslib.setNeutral(0.0)
                    }
                    if (eyeAUs.includes(key)){
                        value = Math.round(value*0.6)
                        console.log(`Time: ${time}, Key: ${key}, Value: ${value}`)

                        facslib.setTargetAU(key, value, '', 3.5)
                        // facslib.updateEngine()
                        // facslib.setNeutral(0.0)
                    }
                })
                facslib.updateEngine()
                self.currentIndex += 1
            }

            // Without timeCheck
            // aus = currentData.AUs
            // Object.entries(aus).forEach(([key, value]) => {
            //     if (validKeyValues.includes(key)){
            //         value = Math.round(value/2)
            //         console.log(`Time: ${time}, Key: ${key}, Value: ${value}`)
            //         facslib.setTargetAU(key, value, '', 0)
            //     }
            // })
            // console.log('Current Iter: ' + self.currentIndex)
            // self.currentIndex += 1
            
        }
        else{
            facslib.setNeutral()
        }
    },
    run: function() {
        var self = this;

        // console.log('aus parsed trigger: ' + self.tony_aus_parsed)

        timeDiffFromInit = Date.now() - self.auDateTime
        // console.log('timeDiffFromInit: ' + typeof self.tony_aus)

        // For actual data AU Demo.
        if (unityWebGLContentLoaded){
            if (self.tony_aus && !self.tony_aus_parsed){
                // console.log('Tony AUs Type: ' + typeof self.tony_aus)
                // console.log('Tony AUs - 2: ' + self.tony_aus)
                self.parsedAUs = self.parseAUs()
                // console.log('Tony AUs Parse: ' + parsedData)
                self.tony_aus_parsed = true        
            }

            // Some Delay time to visibily see faces cycle...
            if (timeDiffFromInit > 2000){
                // console.log("Started AU Iterator...")
                self.AUIterator()
            }
        }
        
        // For chosen AU Demo.
        // var testAUList = ["1", "2", "5", "12", "13", "15", "20", "23", "28"];


        // For testing...
        // self.testAUCycle(testAUList);

        // For list AU expression..
        // self.setFace(testAUList);

        // For sequential list AU expression (Sequential Faces)...
        // self.testSequentialFaces(testAUList)

        //Let's try going through the chosen AUs...
        // facslib.setTargetAU("1", 100, "", 1); //Inner brow raiser
        // facslib.setTargetAU("2", 100, "", 1); //Outer brow raiser
        // facslib.setTargetAU("5", 100, "", 1); //Upper lid raiser
        // facslib.setTargetAU("12", 100, "", 1); //Lip corner puller
        // facslib.setTargetAU("13", 100, "", 1); //Sharp lip puller
        // facslib.setTargetAU("15", 100, "", 1); //Lip corner depressor
        // facslib.setTargetAU("20", 100, "", 1); //Lip stretcher
        // facslib.setTargetAU("23", 100, "", 1); //Lip tightener
        // facslib.setTargetAU("28", 100, "", 1); //Lip suck

    }
})