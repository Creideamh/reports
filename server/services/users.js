const user = require('./../model/user');


exports.manageUsers = (req, res) => {

    user.find().then((data) => {
        res.render('users/index', {
            users: data,
            title: 'All Users'
        });
    }).catch((err) => {
        
    });


};

exports.addUser = (req, res) => {
    res.render('users/create', {
        title: 'Create User'
    });
};

exports.editUser = (req, res) => {

    if( !req.params.id ){

        res.render('users/edit', {
            title: 'Edit User',
            message: 'User not found',
            user: []
        });   

    }else{

        const id = req.params.id;

        user.findById(id).then((data) => {
            if(!data){

                res.render('users/edit', {
                    title: 'Edit User',
                    message: `User with id ${id} not found`,
                    user: []
                })  

            }else{

                res.render('users/edit', {
                    title: 'Edit User',
                    user: data
                });

            }

        }).catch((err) => {
            res.status(500).send({ message: err.message || 'System error occurred, contact sysadmin'});
        });
    }

}

exports.deleteUser = (req, res) => {

    // userid
    const id = req.params.id; 
    user.findByIdAndDelete(id).then((result) => {
        res.redirect('/users')
    }).catch((err) => {
        res.redirect('/users');
        console.log(err.message);
    });

}
