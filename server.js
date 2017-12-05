//The main server process
//Authors: Multe Kedir, Zach Thompson
//
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();

var port = 3030;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

//Default view as level 0 - viewing only
app.get('/', function(req, res){
	

});

//Select which level to view as
app.get('/:level', function(req, res){
	var userLevel = req.params.level;

	if(userLevl > 2){
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

app.listen(port, function() {
	console.log("$$$$$ Server listening on port" + port + " $$$$$");
});


