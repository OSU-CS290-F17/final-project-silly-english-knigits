var fs = require('fs');
var mysql = require('mysql');


if(!fs.existsSync("config.json")){
	console.log("Error! Config file does not exist! Please run npm init first!");
	process.exit(1);
}

var configraw = fs.readFileSync("config.json");
var config = JSON.parse(configraw);

var conn = mysql.createConnection({
	host: config.DBHost,
	user: config.DBUser,
	password: config.DBPass
});

conn.connect(function(err) {
	if(err) throw err;
	console.log("DB Connection Success");
	//Do queries to setup DB here

	
});
