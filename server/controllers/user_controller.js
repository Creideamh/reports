const user = require('./../model/user');
const user_model = require('./../model/user');

const bcrypt = require('bcryptjs');

exports.signin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password; 

    
    // Compare passwords
    user.findOne({email: email}).then((result) => {
        
        // Compare hashed passwords
        bcrypt.compare(password, result.password).then((status) => {

            // hashed passwords do not match
             if(status === false){
                req.session.message = {
                    type: 'danger',
                    message: 'Invalid credentials'
                }
                res.redirect('/');
             }

            // When correct details are supplied by user
             req.session.regenerate( err => {

                // store user information in session
                req.session.user = result;
                
                /**
                 * save the session before redirection to ensure page
                 * load does not happen before session is saved
                 */
                req.session.save( (err) => {
                    if (err) return next(err);
                    res.redirect('/users')
                });

             });

                    // hashed passwords do not match
        }).catch((err) => {

                req.session.message = {
                    type: 'danger',
                    message: 'Invalid credentials'
                }
                res.redirect('/');
        });

    // When supplies wrong email address
    }).catch((err) => {

            req.session.message = {
                type: 'danger',
                message: `System failed to find User`
            }
            res.redirect('/');
    });

}


exports.create = (req, res) => {


    bcrypt.hash('P@$$w0rd', 12, ( (err, hash) => {

        const user = new user_model({
            surname : req.body.surname,
            firstname : req.body.firstname,
            gender : req.body.gender,
            birthdate : req.body.birthdate,
            email: req.body.email,
            job_title : req.body.job_title,
            country : req.body.country,
            status : req.body.status, 
            password: hash,
        });
    
        user.save(user).then((data) => {
            console.log(data);
            if (!data) {
                req.session.message = {
                    type: 'danger',
                    message: 'one or more fields are required'
                }
                res.redirect('users/add')
            }

            req.session.message = {
                type:'success',
                message:'User Added Successfully'
            }
            res.redirect('/users/');

        }).catch((err) => {
            req.session.message = {
                type:'danger',
                message: err.message
            }
            res.redirect('/users/add');
        });    

    }));



};

exports.find = (req, res) => {

    if(req.query.id){

        const id = req.query.id;

        user.findById(id).then((data) => {
            if(!data){
                res.redire(404).send({ message: `User with id ${id} not found`});
            }else{
                res.send(data);
            }
        }).catch((err) => {
            res.status(500).send({ message: err.message || 'System error occurred, contact sysadmin'});
        });

    }else{

        user_model.find().then((data) => {
            res.send(data, {
                users: data,
            });
        }).catch( err => {
            res.status(500).send({ message: err.message || "Error occured while retrieving user"});
        });
        
    }


};

exports.update = (req, res) => {

    // validate 
    if(!req.body){
       res.redirect('/users/');
    }

    const id = req.body.user_id; 

    user.findByIdAndUpdate(id, req.body, { useFindAndModify:false }).then((data) => {
        if(!data){
            req.session.message = {
                type:'danger',
                message: `User with id ${id} has failed to updated`
            }
            res.redirect(`users/edit/${id}`);
        }else{
            req.session.message = {
                type:'success',
                message: `User with id ${id} has updated`
            }
            res.redirect('/users/');        }
    }).catch((err) => {
        req.session.message = {
            type:'info',
            message: `System error, contact sysadmin`
        }
        res.redirect(`users/edit/${id}`);
    });


};

exports.delete = (req, res) => {

    // userid
    const id = req.params.id; 
    user.findByIdAndDelete(id).then((result) => {
        if(!result){
            res.send(404).send({message: `User with id ${id} does not exist` });
        }else{
            res.send({
                message: "User was deleted successfully"
            });
        }

    }).catch((err) => {
        res.status(500).send({message: err.message || 'System error encountered'});
    });

}


exports.reset = (req, res) => {

    // user_id 
    const id = req.body.user_id 

    // Strictly verify samelike
    if( req.body.password === req.body.confirm_password ){

        // Hash password
        bcrypt.hash(req.body.password, 12, (err, data) => {

            user.findByIdAndUpdate(id, { password: data }).then((result) => {
                console.log(data);
                // if update fails
                if(!result){
                    req.session.message = {
                        type: 'danger',
                        message: `Unable to update user with ID ${id}`
                    }
                    res.redirect('reset-password')
                }

                res.redirect('/');
                
            }).catch((err) => {

                // server not able to process request
                req.session.message = {
                    type: 'danger',
                    message: `System error, try again or contact system admin`
                }
                res.redirect('reset-password');

            });




        })

    }
}
