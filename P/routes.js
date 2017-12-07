var express = require('express');
var router = express.Router();
var path = require('path');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',{title:"This is a Title",
  login: true,
  error: false,
  code: '404',
  message: 'go help ur self'
  });
});




module.exports = router;
