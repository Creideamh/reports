const express = require('express');

const route = express.Router();

// display HTML
const render = require('./../utils/render');


// GET Routes 
route.get('/', render.login);

module.exports = route;