const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nodeGeocoder = require('node-geocoder');

const routes = require('./routes');

const PersistentService = require('./utils/PersistentServices');

const persistentServices = new PersistentService();

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes(
    persistentServices,
));

module.exports = app;