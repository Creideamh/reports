const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    surname: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    employee_number: {
        type: Number,
        required: true
    },
    gender: String,
    employment_date: Date,
    band: String,
    company_id: String
});

const employee = new mongoose.model('employee', schema);

module.exports = employee;
