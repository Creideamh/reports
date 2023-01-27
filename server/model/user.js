const mongoose = require('mongoose');


var schema =  new mongoose.Schema({
    surname: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    job_title: {
        type: String,
        required: true
    },
    country: String,
    status: Number,
    password: String
});

const user = mongoose.model('user', schema);

module.exports = user;