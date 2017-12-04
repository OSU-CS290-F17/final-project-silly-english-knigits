var fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


var config = new Object();
	config.CompanyName = "MyCompany";
	config.SiteTitle="My Employee Tracking";
	config.DBHost="localhost";
	config.DBUser="DBUserName";
	config.DBPass="DBPassword";
	config.DBName="MyDatabase";
	config.DefaultUser="root";
	config.DefaultPass="Roger";

var configfiletext = JSON.stringify(config, null, 2);


if(fs.existsSync("config.json")){
	rl.question("A config file already exists. Do you want to create a new one? All data will be lost! [no]", (answer) =>{
		if(answer.toLowerCase() != "yes") {
			console.log("Config init canceled. Using existing config");
			process.exit(0)
		}
		else {
			console.log("Config file overwritten");
			fs.writeFile("config.json", configfiletext, function(err){
				if(err) console.log(err);
				else console.log("Config File Successfully Created");
				process.exit(0);
			});
		}
	});

}

