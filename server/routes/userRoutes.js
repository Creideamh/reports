
const users = require('./../services/users');


routes.get('/users', services.manageUsers);
routes.get('/users/add', services.addUser);
routes.get('/users/edit/:id', services.editUser);
routes.get('/users/delete/:id', services.deleteUser);

// Post Requests 
routes.post('/create-user', users.create);
routes.get('/all-users', users.find);
routes.put('/update-user/:id', users.update);
routes.delete('/delete-user/', users.delete);

