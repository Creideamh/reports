const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({
    path: '.env'
});

exports.trasporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

