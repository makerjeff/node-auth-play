// server.js

//setup all ======================================================================
//grab all the tools

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// configuration =================================================================
mongoose.connect(configDB.url); //connect to the database

require('./config/passport')(passport);   //pass passport for config

//setup express app
app.use(morgan('dev')); //log every-zang.
app.use(cookieParser());    //read cookies
app.use(bodyParser());  //get information from html forms (post)

app.set('view engine', 'ejs');  //learn a little EJS templating

// required for passport setup
app.use(session({secret: 'ilovejeffyjeffyjeffyjeffyjeffy'}));   //session secret
app.use(passport.initialize()); //autobots, rollout!
app.use(passport.session());    //persistent login sessions
app.use(flash());   //use connect-flash for flash messages stored in session

// routes ========================================================================
require('./app/routes.js')(app, passport);  //load routes, pass in passport.

// launch ========================================================================
app.listen(port);
console.log('Screw in the hose to port ' + port);