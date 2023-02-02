const express = require('express');
const users = require('./../controllers/user_controller');
const incidents = require('./../controllers/incident_controller');

const routes =  express.Router();
const services = require('./../services/render.js');

routes.get('/', services.login);


routes.get('/dashboard', services.HomeRoutes);

routes.get('/incidents', services.allIncidents);

routes.get('/incidents/add', services.addIncident);

routes.get('/incidents/edit/{id}', services.editIncident);

routes.get('/users', services.manageUsers);
routes.get('/users/add', services.addUser);
routes.get('/users/edit/:id', services.editUser);
routes.get('/users/delete/:id', services.deleteUser);
routes.get('/users/reset/:id', services.resetUserPassword);
routes.get('/users/reset-password/:id', services.password_reset);
routes.get('/signout', services.signout);


// Post Requests 
routes.post('/create-user', users.create);
routes.get('/all-users', users.find);
routes.post('/update-user', users.update);
routes.post('/reset-complete', users.reset);
routes.post('/signin', users.signin);

// Incident Post Requests
routes.post('/add-incident', incidents.create);

module.exports = routes;