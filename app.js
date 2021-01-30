const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const image  = require('./controllers/image');
const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const myAccount = require('./controllers/myaccount');
const updateUserInfo = require('./controllers/updateUserInfo');
const updateAddress = require('./controllers/updateAddress');
const updatePassword = require('./controllers/updatePassword');

const db = knex({
  client: 'pg',
  connection:{
    host:'foodsite-backend.postgres.database.azure.com',
    user:"psqladmin@foodsite-backend",
    database:'foodsite', 
    password:"hjQwxFjRxdBw*MJ8",
    port:'5432',
    ssl :true 
  }  
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);


// signin request
app.post('/signin', (req, res) => {signIn.handleSignIn(req, res, db, bcrypt)})

// image
app.put('/image',(req,res) => {image.handleImage(req, res, db)})

//api
app.post('/imageurl', (req, res) => {image.handleApiCall(req,res)})

// register request
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, saltRounds)})

// My account request
app.post('/myaccount', (req, res) => {myAccount.requestinfo(req, res, db, bcrypt, saltRounds)})

// update user info
app.post('/updateuserinfo', (req, res) => {updateUserInfo.updateUserInfo(req, res, db)})

// update user address
app.post('/updateaddress', (req, res) => {updateAddress.updateAddress(req, res, db)})

//update password
app.post('/updatepassword', (req, res) => {updatePassword.updatePassword(req, res, db, bcrypt, saltRounds)})




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
