const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },

    dateOfBirth: {
        type: Date,
        required: true,
    },

    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    points: {
        type: Number,
        default: 10,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    lastLogin: {
        type: Date,
    },
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);