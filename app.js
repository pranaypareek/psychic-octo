var express = require('express');
var hash = require('./pass').hash;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//Mongo Stuff
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/logstuff1');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(session({ secret: 'keyboard cat', cookie: {maxAge: 60000}}));

//Making the App use Session
app.use(session({
    resave: false, //don't save session if unmodified
    saveUninitialized: false, //don't create session until something stored
    secret: 'shhhh, very secret'
}));

//Session-persisted message middleware

app.use(function(req, res, next){
    var err = req.session.error;
    var msg = req.session.success;

    delete req.session.error;
    delete req.session.success;

    res.locals.message = '';

    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});


app.use(express.static(path.join(__dirname, 'public')));

//Making the DB accessible to the router
app.use(function(req, res, next){
    req.db = db;
    next();
});


app.use('/', routes);
app.use('/users', users);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
