
const user = require('./../model/user');
const country = require('./../model/countries');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const email = require('./../utils/email');
const employee = require('../model/employees');
const incident = require('../model/incidents');

exports.login = (req, res) => {
    res.render('login', {
        title: 'Report System' 
    })
}

exports.signout = (req, res) => {

    req.session.destroy((err) => {
        res.render('login', {
            title: 'Report System' 
        });
    });

};

exports.HomeRoutes = (req, res) => {
    res.render('index', {
        title: 'Dashboard'
    });
}

exports.allIncidents = (req, res) => {



    incident.find().then((result) => {
        res.render('incidents/index', {
            incidents: result,
            title: 'All Incidents'
        });
    }).catch((err) => {
        
    });

};

exports.addIncident = (req, res) => {

    employee.find().then((data) => {

        res.render('incidents/add', {
            title: 'Create Incident',
            employees: data,
        });

    }).catch((err) => {
        
        res.render('/incidents/add', {
            title: 'Create Incident',
            employees: `${err}`
        });

    });


};

exports.editIncident = (req, res) => {
    res.render('incidents/edit', {
        title: 'Edit Incident'
    });
};

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

    country.find().then((data) => {

        res.render('users/create', {
            title: 'Create User',
            countries: data
        });

    }).catch((err) => {
        
    });

};

exports.editUser = (req, res) => {

    if( !req.params.id ){

        res.redirect('users/edit', {
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

exports.resetUserPassword =  (req, res) => {

    
    user.findById(req.params.id).then((data) => {

        // send password reset
            let mailInfo =  email.transporter.sendMail({
                from: '"ReportMailer" reportdesk@gmail.com',
                to: data.email,
                subject: 'Password reset',
                html: ` <!doctype html>
                <html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Reset Password Email Template</title>
                    <meta name="description" content="Reset Password Email Template.">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>
        
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                        <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                                        </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                            requested to reset your password</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                            We cannot simply send you your old password. A unique link to reset your
                                                            password has been generated for you. To reset your password, click the
                                                            following link and follow the instructions.
                                                        </p>
                                                        <a href="http://localhost:4000/users/reset-password/${req.params.id}"
                                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                            Password</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.rakeshmandal.com</strong></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>
            </html>
            `
            }).then((result) => {

                req.session.message = {
                    type: 'success',
                    message: 'password reset request sent'
                }
                console.log(result);
                res.redirect('/users/');


            }).catch((err) => {
                console.log(err.message);

                req.session.message = {
                    type: 'danger',
                    message: `${err.message}`
                }

                res.redirect('/users/');
            });

    }).catch((err) => {
        console.log(err.message);
    });
}


exports.password_reset = (req, res) => {

        res.render('reset-password', {
            user_id: req.params.id
        });

};