var fs = require('fs');
var mysql = require('mysql');
var bcrypt = require('bcrypt');

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
var errorState = false;
var departmentTable = "CREATE TABLE Departments (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Name varchar(255) NOT NULL, Location varchar(255) NOT NULL, Positions varchar(255) NOT NULL)";

var positionTable = "CREATE TABLE Positions (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Name varchar(255) NOT NULL, DefaultSalary int(255) NOT NULL)";

var peopleTable = "CREATE TABLE People (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Name varchar(255) NOT NULL, Department int(255) NOT NULL, Salary int(255) NOT NULL, Email varchar(255) NOT NULL, Position int(255) NOT NULL, LocationOverride varchar(255) NOT NULL, PhotoURL varchar(255))";

var userTable = "CREATE TABLE Users (ID int(255) NOT NULL PRIMARY KEY AUTO_INCREMENT, Username varchar(255) NOT NULL UNIQUE, Password varchar(255) NOT NULL, Email varchar(255) NOT NULL, Picture varchar(255) NOT NULL)";

var defUser = config.DefaultUser;
var defPass = config.DefaultPass;
var defEmail = config.DefaultEmail;
var defPic = config.DefaultPicture;

var hash = bcrypt.hashSync(defPass, 15);
//Debug option. DO NOT USE
//console.log("hash is: " + hash); 



var insertDefUser = "INSERT INTO Users (Username, Password, Email, Picture) VALUES('" + defUser + "', '"+ hash + "', '" + defEmail + "', '" + defPic + "')";

conn.connect(function(err) {
	if(err) throw err;
	console.log("DB Connection Success");
	//Do queries to setup DB here
	conn.query(departmentTable, function(err, result){
		if(err) {
			if(err.code == "ER_TABLE_EXISTS_ERROR"){
				console.log("Department Table Already Exists");
				++tablesCreated;
			}
			else {
				console.log("Error creating department table: " + err.code);
				errorState = true;
			}
		}
		else { 
			console.log("Created department table");
			++tablesCreated;
		}
		statusCheckCallback();
	});

	conn.query(positionTable, function(err, result){
		if(err) {
			if(err.code == "ER_TABLE_EXISTS_ERROR"){
				console.log("Positions Table Already Exists");
				++tablesCreated;
			}
			else{
				console.log("Error creating position table: " + err.code);
				errorState = true;
			}
		}
		else {
			console.log("Created position table");
			++tablesCreated;
		}
		statusCheckCallback();
	});

	conn.query(peopleTable, function(err, result){
		if(err) {
			if(err.code == "ER_TABLE_EXISTS_ERROR"){
				console.log("People Table Already Exists");
				++tablesCreated;
			}
			else{
				console.log("Error creating people table: " + err.code);
				errorState = true;
			}
		}
		else {
			console.log("Created people table");
			++tablesCreated;
		}
		statusCheckCallback();
	});

	conn.query(userTable, function(err, result){
		if(err) {
			if(err.code == "ER_TABLE_EXISTS_ERROR"){
				console.log("User Table Already Exists");
				++tablesCreated;
			}
			else {
				console.log("Error creatin user table: " + err.code);
				errorState = true;
			}
		}
		else {
			console.log("Created user table");
			++tablesCreated;
		}
		statusCheckCallback();
	});
	
});

function statusCheckCallback(){
	if(tablesCreated >= 4){
		console.log("All tables created");
		console.log("Creating default user");
		conn.query(insertDefUser, function(err, result){
			if(err) {
				if(err.code == "ER_DUP_ENTRY"){
					console.log("The default user already exists");
					process.exit(0);

				}
				else {
					console.log("Error inserting default user into database: " + err.code);
					errorState = true;
					statusCheckCallback();
				}
			}
			else {
				console.log("Database setup successful! You're site is now ready to use!");
				process.exit(0);
			}

		});
	}
	else{
		if(errorState) {
			console.log("An error has occured. Please correct the error and try again.");
			process.exit(1);
		}

	}
}

