/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../Config').CONSTANTS;

const admin = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true,
        enum: [
            constants.USER_ROLE.ADMIN,
            constants.USER_ROLE.SUPER_ADMIN
        ]
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    lastLogin: {
        type: Date,
        required: false
    },
    loginCount: {
        type: Number,
        default: 0
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    createdByAdmin: {
        type: Schema.ObjectId,
        ref: 'admin'
    }
}, {
    timestamps: true
});

admin.index({
    accessToken: 1
}, {
    unique: true, partialFilterExpression: {
        accessToken: {$exists: true}
    }
});

module.exports = mongoose.model('admin', admin);