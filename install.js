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
	password: config.DBPass,
	database: config.DBName
});

var tablesCreated = 0;

var departmentTable = "CREATE TABLE Departments (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Name varchar(255) NOT NULL, Location varchar(255) NOT NULL, Positions varchar(255) NOT NULL)";

var positionTable = "CREATE TABLE Positions (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Name varchar(255) NOT NULL, DefaultSalary int(255) NOT NULL)";

var peopleTable = "CREATE TABLE People (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Name varchar(255) NOT NULL, Department int(255) NOT NULL, Salary int(255) NOT NULL, Email varchar(255) NOT NULL, Position int(255) NOT NULL, LocationOverride varchar(255) NOT NULL)";

var userTable = "CREATE TABLE Users (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Username varchar(255) NOT NULL UNIQUE, Password varchar(255) NOT NULL, Email varchar(255) NOT NULL, Picture varchar(255) NOT NULL)";

conn.connect(function(err) {
	if(err) throw err;
	console.log("DB Connection Success");
	//Do queries to setup DB here
	conn.query(departmentTable, function(err, result){
		if(err) console.log("Error creating department table: " + err);
		else { 
			console.log("Created department table");
			++tablesCreated;
		}
	});

	conn.query(positionTable, function(err, result){
		if(err) console.log("Error creating position table: " + err);
		else {
			console.log("Created position table");
			++tablesCreated;
		}
	});

	conn.query(peopleTable, function(err, result){
		if(err) console.log("Error creating people table: " + err);
		else {
			console.log("Created people table");
			++tablesCreated;
		}
	});

	conn.query(userTable, function(err, result){
		if(err) console.log("Error creatin user table: " + err);
		else {
			console.log("Created user table");
			++tablesCreated;
		}
	});
});

