//The main server process
//Authors: Multe Kedir, Zach Thompson


var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var routes = require('./routes');
var port = process.env.PORT ||3001;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, function () {
        console.log("== Server is listening on port", port);
});
