
/**
 * Module dependencies.
 */
var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 80;


//Config

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
//app.use(express.urlencoded());

var router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/home');
});


router.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname, '/html', '/home.html'));
});

router.post('/home', function(req, res) {
    var username = req.body.username;
    console.log(username);
});


router.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, '/html', '/about.html'));
});

// Routes

app.use('/', router);

app.listen(port);
console.log('Port 80');

app.use(function(req, res){
    res.sendStatus(404);
});
