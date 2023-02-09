const express = require('express');

const route = express.Router();

const users = require('./../controllers/users');

// display HTML
const render = require('./../utils/render');


// GET Routes 
route.get('/', render.login);
route.get('/register', render.register);
route.get('/email-verify/', render.verify);
route.get('/email-verification', render.verify)


// POST Routes 
route.post('/register', users.register);
route.post('/email-verify', users.emailVerify);
route.post('/signin', users.signin);

module.exports = route;