const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    customerType: {
        type: String,
        enum: ['Individual', 'Business', 'Organization'],
        required: true,
        default: 'Individual'
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        default: ''
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    wasteSource: {
        type: String,
        default: ''
    },

    notes: {
        type: String,
        default: ''
    },

    // Branch this customer belongs to
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },

    // User who registered the customer
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

// Improve branch-specific customer searches
customerSchema.index({ branch: 1, createdAt: -1 });

// Export model
module.exports = mongoose.model('Customer', customerSchema);