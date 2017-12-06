var express = require('express');
var router = express.Router();
var path = require('path');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',{title:"Hello",
  error: true,
  code: '404',
  message: 'go help ur self'
  });
});




module.exports = router;
