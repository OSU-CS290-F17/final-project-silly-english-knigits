//The main server process
//Authors: Multe Kedir, Zach Thompson
//
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');
var mysql = require('mysql');

if(!fs.existsSync("config.json")){
	console.log("Error! Config file does not exist! Has the system been inited?!");
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

var app = express();

var port = 3030;
var maxLevel = 2;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));


/* ABANDON SHIP!!!!
function getPerson(personID){
	var thePerson = null;
	//conn.connect(function(err) {
	//	if(err) {
	//		console.log("!!!!! Error getting person by id " + personID + ": " + err);
	//	}
	//	else {
			var query = "SELECT * FROM People WHERE ID = " + personID;
			console.log("***** Query: " + query);
			conn.query(query, function(err, result, fields){
				if(err){
					console.log("!!!!! Error getting person by id " + personID + ": " + err);
				}
				else{
					thePerson = result;
					console.log("-- Person data: " + JSON.stringify(result));
				}
				//return;
			});
	//	}
	//	return;
	//});	
	//return thePerson;
}*/


app.get('/test/:id', function(req, res){
	var pid = req.params.id;
	var query = "SELECT * FROM People WHERE ID = " + pid;
	
	conn.query(query, function(err, result, fields){
		if(err) {
			res.status(500);
			res.write("Something went wrong");
			res.end();
		}
		else {
			res.status(200);
			res.write(JSON.stringify(result));
			res.end();
		}	


	});
});

//Default view as level 0 - viewing only
app.get('/', function(req, res){
	

});

//Select which level to view as
app.get('/:level', function(req, res){
	var userLevel = req.params.level;

	if(userLevel > maxLevel){
		console.log("!!!!! User Level Not Found!");
		res.status(404);
		res.render('404');
	}
	else {
		console.log("--- Main view request for user level " + userLevel);
		res.status(200);
		res.write("Viewing users as level " + userLevel);
		res.end();	
	}
});

//Route to get a person from the DB
//Return a JSON Blob for AJAX
app.get('/:level/:person', function(req, res){
	var userLevel = req.params.level;
	var pid = req.params.person;

	if(userLevel > maxLevel){
		console.log("!!!!! User Level Not Found!");
		res.status(404);
		res.render('404');
	}
	else {
		console.log("--- Fetching User: " + pid);

	}
});

app.get('*', function(req, res){
	console.log("----- Got Request");
	res.status(404);
	res.render('404');
});

app.post('*', function(req, res){
	console.log("!!!!! Post Requests Not Allowed");
	res.status(404);
	res.render('404');
});

conn.connect(function(err){

	app.listen(port, function() {
		console.log("$$$$$ Server listening on port" + port + " $$$$$");
	});

});


