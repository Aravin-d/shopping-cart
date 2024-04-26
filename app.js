var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const { connect } = require("./config/connection");
const dotenv = require('dotenv').config();
const session = require('express-session');
const sessionSecret = process.env.SECRET_KEY;

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs.engine({extname : 'hbs',
                              defaultLayout : 'layout', 
                              layoutsDir : path.join(__dirname, 'views/layout'), 
                              partialsDir : path.join(__dirname, 'views/partials'),
                            }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({secret: sessionSecret, cookie: {maxAge : 60000}}))

connect();
app.use('/', indexRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
