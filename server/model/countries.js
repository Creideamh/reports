const mongoose = require('mongoose');


var schema =  new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    alpha2: {
        type: String,
        required: true,
    },
    alpha3:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status:String
});

const country = mongoose.model('country', schema);

module.exports = country;