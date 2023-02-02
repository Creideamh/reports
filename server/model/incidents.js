const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    employee_id:{
        type: String,
        required: true,
    },
    short_description: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    incident_date: Date,
    user_id: {
        type: String,
        required: true
    }
});

const incident = new mongoose.model('incident', schema);

module.exports = incident;