var VoiceCommandPattern = Class.create
({
	initialize: function(cmd, triggers)
	{
		var self = this;

		self.cmd = cmd; //look for UserCommands in mainframe.classes.js
		self.triggers = triggers; //array of arrays of strings (sets of words that trigger the command)
	},

	match: function(input)
	{
		var self = this;

		var found = false;
		for (var i=0; i<self.triggers.length; ++i)
		{
			var valid = true;
			for (var j=0; j<self.triggers[i].length; ++j)
			{
				//console.log(self.triggers[i][j]+" in "+input+" ??");
				if (input.indexOf(self.triggers[i][j]) < 0)
				{
					valid = false; //trigger did not match completely
					break;
				}
			}
			if (valid)
			{
				found = true; //at least one trigger matched
				break;
			}
		}

		return found;
	} 
});