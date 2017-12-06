//The main server process
//Authors: Multe Kedir, Zach Thompson
//
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');


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

var port = process.env.PORT || 3030;
var maxLevel = 2;


//This object will be passed to the rendering function to determine
//how the page should render
var renderInfo = new Object();
	renderInfo.title = config.SiteTitle;
	renderInfo.userLevel = 0;//Default to user level 0
	renderInfo.is404 = false;
	renderInfo.payload = new Object();//Payload data for specific section to render in JSON.
	renderInfo.singleUser = true;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



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
			/*res.status(200);
			res.write(JSON.stringify(result));
			res.end();*/
			var payload = new Object();
				payload.name = result[0].Name;
				payload.email = result[0].Email;
				payload.salary = result[0].Salary;
			renderInfo.payload = payload;
			var tempDat = JSON.stringify(renderInfo);
			console.log(tempDat);
			res.status(200);
			res.render('test1', {
				name: result[0].Name,
				position: result[0].Position,
				date: "12/6/2017"
});
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

app.post('/update', function(req, res){
	res.status(501);
	res.write("<h1>501</h1><p>Not Implemented</p>");
	res.end();
});

app.post('/create', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var loc = req.body.location;
	res.status(200);
	res.write("Creating user " + name + " with email " + email + " in " + loc);
	res.end();
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


