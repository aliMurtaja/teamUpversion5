var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
const core = require('cors');
var bodyParser = require('body-parser');


var app = express();

// // CONTROLLERS REQUIRE HERE

// admin(this will for the all admin related task)
var Admin = require('./controllers/Adminc');
// this is only for testion
var usersRouter = require('./controllers/users');


// // THIS IS FOR HANDLING THE POST REQUEST

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(core())

// ADD HEADER WITH RESPONSE
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.use(core())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// configure the session
app.use(session({ secret: "ksjdfsajfd", resave: false, saveUninitialized: false }));


// THIS IS FOR INCLUDING THE STATIC FILE
// this is from node_modules
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/metismenu/dist'));
app.use(express.static(__dirname + '/node_modules/responsive'));
app.use(express.static(__dirname + '/node_modules/font-awesome/css'));
app.use(express.static(__dirname + '/node_modules/jquery-validation/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/node_modules/datatables-bootstrap/css'));
app.use(express.static(__dirname + '/node_modules/datatables-bootstrap/js'));
app.use(express.static(__dirname + '/node_modules/datatables-responsive/css'));
app.use(express.static(__dirname + '/node_modules/sweetalert2/dist'));
app.use(express.static(__dirname + '/node_modules/fastselect/dist'));
// this is from public folder(custome static file)
app.use(express.static(path.join(__dirname, 'public')));



// this is only for testing CONTROLLER
app.use('/users', usersRouter);

// ADMIN CONTROLLER 
app.use('/', Admin);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const error = new Error('Route Not Found');
    error.status = 404;
    next(error);
});

// error handler
app.use(function(error, req, res, next) {

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

});

module.exports = app;