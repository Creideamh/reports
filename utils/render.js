const mysql = require('./mysql-con');

exports.login = (req, res) => {
    res.render('login', {
        title: 'ReportDesk System'
    });
};

exports.register = (req, res) => {

    // get all countries
    mysql.query('SELECT * FROM apps_nationality', ( (err, results, field) => {
        res.render('register', {
            title: 'Create Account',
            countries: results
        });

    }));


}

exports.verify = (req, res, next) => {
    res.render('email-verify', {
        title: 'Verify Email address'
    });
};

