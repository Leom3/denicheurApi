var express = require('express');
var router = express.Router();
const request = require("request");

/* GET home page. */
router.get('/', function(req, res, next) {
  request({ 
    url: 'https://postman-echo.com/get',
    method: 'GET',
    proxy: 'https://103.251.225.13:34052'
  }, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
      console.log(response.statusCode, body);
    }
    res.json({ 
      data: { body: body } 
    })
});
});

module.exports = router;
