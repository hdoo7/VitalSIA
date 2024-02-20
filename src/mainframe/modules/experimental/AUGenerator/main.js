/*
** AUGenerator
** Author: Mihai Polceanu
** E-mail: mpolcean@cs.fiu.edu
*/

/*****************************************************************\
** AUGenerator
\*****************************************************************/

var AUGenerator = Class.create(AbstractModule,
{
    initialize: function($super, params)
    {
        var self = this;
        
        $super(params);
        
        self.name = "AUGenerator"; //unknown name, to be overriden by subclasses
        self.type = ModuleType.Sensor; //unknown type, to be overriden
        self.mandatory = false; //is this model mandatory ? to be overriden

        self.resourceNames = {
            P_CHARAUS: 0
        };
        
        self.providedResources[self.resourceNames.P_CHARAUS] = new CharacterAUValues();

        self.auData = null;

        Papa.parse("http://localhost:3000/app/modules/experimental/AUGenerator/csv/00000-counselor.csv", {
            download: true,
            complete: function(results)
            {
                console.log(results);
                self.auData = results;
            }
        });

        self.dataIndex = 1; //ignore first row

        self.firstRun = -1;
    },
    
    run: function()
    {
        var self = this;

        if (self.auData != null)
        {
        	if (self.firstRun < 0) self.firstRun = Date.now();

            if (self.auData.data[self.dataIndex][3] == 1) //success
            {
            	console.log(self.auData.data[self.dataIndex][1]);
            	console.log(Date.now());

            	var data = self.providedResources[self.resourceNames.P_CHARAUS].container.data;
                data[AUNames.AU1] = self.auData.data[self.dataIndex][16] / 5.0;
                data[AUNames.AU2] = self.auData.data[self.dataIndex][17] / 5.0;
                data[AUNames.AU4] = self.auData.data[self.dataIndex][18] / 5.0;
                data[AUNames.AU5] = self.auData.data[self.dataIndex][19] / 5.0;
                data[AUNames.AU6] = self.auData.data[self.dataIndex][20] / 5.0;
                data[AUNames.AU9] = self.auData.data[self.dataIndex][21] / 5.0;
                data[AUNames.AU10] = self.auData.data[self.dataIndex][22] / 5.0;
                data[AUNames.AU12] = self.auData.data[self.dataIndex][23] / 5.0;
                data[AUNames.AU14] = self.auData.data[self.dataIndex][24] / 5.0;
                data[AUNames.AU15] = self.auData.data[self.dataIndex][25] / 5.0;
                data[AUNames.AU17] = self.auData.data[self.dataIndex][26] / 5.0;
                data[AUNames.AU20] = self.auData.data[self.dataIndex][27] / 5.0;
                data[AUNames.AU25] = self.auData.data[self.dataIndex][28] / 5.0;
                data[AUNames.AU26] = self.auData.data[self.dataIndex][29] / 5.0;
            }

            if ((1.0*Date.now()-self.firstRun)/1000.0 > self.auData.data[self.dataIndex][1])
            {
            	self.dataIndex++;
            	if (self.dataIndex >= self.auData.data.length)
        		{
        			self.dataIndex = 1;
        			self.firstRun = Date.now();
        		}
            }
            
        }
    }
});
