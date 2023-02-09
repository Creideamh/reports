const bcrypt = require('bcryptjs');
const emailer = require('./../utils/email');
const randomString = require("randomized-string");
const mysql = require('./../utils/mysql-con');



exports.signin = (req, res, next) => {
    
    const email = req.body.email;
    const password = req.body.password; 

    // sql 
    let sql = `SELECT * FROM users WHERE email = '${email}'`;

    mysql.query(sql, ( (err, results, fields) => {

        // User account activation check
        if ( results[0].status == 1) {
            req.session.message = {
                type: 'danger',
                message: 'User account not activated. Contact System Admin'
            };
            res.status(401).redirect('/');
        }

        // invalid email address
        if (err) {
            req.session.message = {
                type: 'danger',
                message: 'Invalid credentials'
            };
            res.status(401).redirect('/');
        }

        // password check
        bcrypt.compare(password, results[0].password).then((result) => {

            if(!result){
                req.session.message = {
                    type: 'danger',
                    message: 'Invalid credentials'
                };
                res.status(401).redirect('/');
            }

            req.session.message = {
                type:'success',
                message: 'Welcome'
            };

            res.status(201).redirect('/users');

        }).catch((err) => {

            // bcrypt functionality error
            req.session.message = {
                type:'danger',
                message: 'System error encountered'+ err
            }
            res.status(401).redirect('/');
        });


    }));


}

exports.register = (req, res, next) => {

    const password = req.body.password; 
    const surname = req.body.surname;
    const firstname = req.body.firstname;
    const gender = req.body.gender;
    const birthdate = req.body.birthdate;
    const email = req.body.email;
    const mobile_number = req.body.mobile_number;
    const job_title = req.body.job_title;
    const nationality = req.body.nationality;
    const status  = req.body.status || 2;
    const verification_date = new Date();


    bcrypt.hash(password, 12, ( (err, hash) => {

        if (err) {
            req.session.message = {
                type: 'danger',
                message: 'Password input is needed'
            };
            res.end('');
        }

        let verification_token = randomString.generate({
            charset: 'number',
            length: 6
        });

        let sql = 'INSERT INTO users (`surname`, `firstname`, `birthdate`, `gender`, `nationality`, `email`, `mobile_number`, `job_title`, `status`, `password`, `email_verification`, `verification_date`) VALUE (?,?,?,?,?,?,?,?,?,?,?,?)';

        mysql.query(sql, [surname, firstname, birthdate, gender, nationality, email, mobile_number, job_title, status, hash, verification_token, verification_date], ( (err, results, fields) => {

            if(err){
                req.session.message = {
                    type: 'danger',
                    message: 'System error encountered, please try again'
                };

                res.write(JSON.stringify(err));
                res.end();            
            }

            // send verification mail


            let mailInfo =  emailer.trasporter.sendMail({
                from: '"ReportMailer" reportdesk@gmail.com',
                to: email,
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
                                                        <a href="http://localhost:5000/email-verification?email_address=${req.body.email}"
                                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${verification_token}</a>
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
                    message: 'User created successfully'
                };
                res.redirect('/email-verify');

            }).catch((err) => {

                req.session.message = {
                    type: 'danger',
                    message: 'System error encountered, please try again'
                };

                res.write(JSON.stringify(err));
                res.end(); 
            });



        }));



        
    })
    );
};

exports.emailVerify = (req, res, next) => {

    const email_code = req.body.email_code;
    const toDay = new Date().getMinutes();
    
    
    let sql =  `SELECT * FROM users WHERE email_verification = ${email_code}`;


    mysql.query(sql, ( (err, results, fields) => {

        if (results[0].getMinutes < toDay) {

            req.session.message = {
                type: 'danger',
                message: `User activation expired`,
            };
            
            res.send();
        }
        
        if (err) {
            
            req.session.message = {
                type: 'danger',
                message: `User with email ${email_address} does not exist`,
            };
            
            res.send();
        }

        // Update User table 
        sql = `UPDATE users SET status = 2 WHERE email_verification = ${email_code}`;

        mysql.query(sql, ( (error, results) => {

            req.session.message = {
                type: 'success',
                message: 'User account activated'
            };
            res.redirect('/');

        }))


    } ))


}