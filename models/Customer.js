const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

customerSchema.plugin(timestamp);

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
