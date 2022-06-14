var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("./db");
const session = require('express-session');
//public
var indexRouter = require('./routes/public/index');
var registerRouter = require('./routes/public/register');
var loginRouter = require('./routes/public/login');
var forgotRouter = require('./routes/public/forgotPassword');
var resetCodeRouter = require('./routes/public/resetCode');
var emailVerificationRouter = require('./routes/public/emailVerification');
//user
var homeRouter = require('./routes/user/home');
var myAccountsRouter = require('./routes/user/myAccounts');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "Mas27um59",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 8 * 60 * 60 * 1000 },
}));
app.use(express.static(__dirname + '/public'));
app.locals.baseURL = "http://localhost:3000"

app.use('/', indexRouter);
app.use('/kayit-ol', registerRouter);
app.use('/giris-yap', loginRouter);
app.use('/sifremi-unuttum', forgotRouter);
app.use('/email-dogrulama', emailVerificationRouter);
app.use('/sifre-sifirlama', resetCodeRouter);

app.use('/anasayfa', homeRouter);
app.use('/hesaplarim', myAccountsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
