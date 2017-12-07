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
//This only acts as a template. All routes should make a copy of this object before editing.
/*var renderInfo = new Object();
	renderInfo.title = config.SiteTitle;
	renderInfo.userLevel = 0;//Default to user level 0
	renderInfo.is404 = false;
	renderInfo.payload;// = new Object();//Payload data for specific section to render in JSON.
*/

class renderInfo {
	constructor(){
		this.title = config.SiteTitle;
		this.userLevel = -1;
		this.error = false;
		this.payload = new Object();
		this.showSearch = false;
		this.showFilter = false;
		this.showPeople = false;
		this.showLogin = false;
		this.canEdit = false;
	}
}

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/*
app.get('/test/:id', function(req, res){
	var pid = req.params.id;
	var query = "SELECT * FROM People WHERE ID = " + pid;
	var ri = new requestInfo();
		
	conn.query(query, function(err, result, fields){
		if(err) {
			res.status(500);
			res.write("Something went wrong");
			res.end();
		}
		else {
			//var payload = new Object();
				ri.payload.name = result[0].Name;
				ri.payload.email = result[0].Email;
				ri.payload.salary = result[0].Salary;
			//renderInfo.payload = payload;
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
*/





//Default view as level 0 - viewing only
app.get('/', function(req, res){
	var ri = new renderInfo();
	ri.doLogin = true;

	res.status(200);
	res.render('Main', ri);

});

//Select which level to view as
app.get('/:level', function(req, res){
	var userLevel = req.params.level;

	var ri = new renderInfo();
	ri.userLevel = userLevel;
	if(userLevel > maxLevel || isNaN(userLevel)){
		//console.log("!!!!! User Level Not Found!");
		res.status(404);
		ri.error = true;
		res.render('Main', ri);
	}
	else {
		console.log("--- Main view request for user level " + userLevel);

		query = "SELECT * FROM People";
		conn.query(query, function(err, result, fields){
			if(err){
				ri.error = true;
				res.render('Main', ri);	
			}
			else {
				
				if(result == undefined){
					res.status(404);
					ri.error = true;
					res.render('Main', ri);
				}
				else{

					//if(userLevel >= 1) ri.canEdit = true;	
					res.status(200);
					ri.showSearch = true;
					ri.showFilter = true;
					ri.showPeople = true;
					console.log("Got some results here");
					ri.payload.People = [];
					for(var i = 0; i < result.length; ++i){
						
						ri.payload.People[i] = new Object();
						ri.payload.People[i].payload = new Object();
						//ri.payload.People[i].payload.Test = "THIS IS A TEST!";
						ri.payload.People[i].payload.id = result[i].ID;
						ri.payload.People[i].payload.name = result[i].Name;
						ri.payload.People[i].payload.email = result[i].Email;
						ri.payload.People[i].payload.salary = result[i].Salary;
						ri.payload.People[i].payload.position = result[i].Position;
						ri.payload.People[i].payload.location = result[i].Location;	
						ri.payload.People[i].payload.photoURL = result[i].PhotoURL;
						if(userLevel >= 1){
							console.log("User can edit these people");
							ri.payload.People[i].payload.canEdit = true;
						}
					}
					res.render('Main', ri);
				}
			}
		});
	}

});

//Route to get a person from the DB
//Return a JSON Blob for AJAX
app.get('/person/:person', function(req, res){
	//var userLevel = req.params.level;
	var pid = req.params.person;

	/*if(userLevel > maxLevel){
		console.log("!!!!! User Level Not Found!");
		res.status(404);
		res.render('404');
	}
	else {
		console.log("--- Fetching User: " + pid);
	}*/
	var query = "SELECT * FROM People WHERE ID = " + pid;
	conn.query(query, function(err, result, fields){
		if(result == undefined){
			res.status(404);
			res.write("error");
			res.end();
		}
		else {
			res.status(200);
			res.write(JSON.stringify(result[0]));
			res.end();
		}


	});
	 
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
	var sal = req.body.salary;
	var pos = req.body.position;
	var dep = req.body.department;
	var pic = req.body.photourl;
	var query = "INSERT INTO People(Name, Email, Location, Salary, Position, Department, PhotoURL) VALUES('"+name+"','"+email+"','"+loc+"','"+sal+"','"+pos+"','"+dep+"','"+pic+"')";
	conn.query(query, function(err, result, fields){
		if(err){
			console.log(err);
			res.status(500);
			res.write("error");
			res.end();
		}
		else {
			res.status(200);
			res.write("ok");
			res.end();
		}
	});
});

app.post('*', function(req, res){
	res.status(404);
	res.render('404');
});

conn.connect(function(err){

	app.listen(port, function() {
		console.log("$$$$$ Server listening on port" + port + " $$$$$");
	});

});


