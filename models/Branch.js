const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({

    branchName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    branchCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    location: {
        type: String,
        required: true
    },

    address: {
        type: String,
        default: ''
    },

    phone: {
        type: String,
        default: ''
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);