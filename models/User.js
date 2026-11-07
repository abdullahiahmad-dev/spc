const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    // Personal information
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // Login password
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    // User role
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'user'],
        required: true,
        default: 'user'
    },

    // Assigned branch
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        default: null
    },

    // Account status
    isActive: {
        type: Boolean,
        default: true
    },

    // Force password change on first login
    mustChangePassword: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});


// Hash password before saving
userSchema.pre('save', async function() {

    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);

});


// Compare login password
userSchema.methods.comparePassword = async function(password) {

    return await bcrypt.compare(password, this.password);

};


module.exports = mongoose.model('User', userSchema);