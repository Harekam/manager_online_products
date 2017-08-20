/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new Schema({
    productName: {
        type: String,
        required: true
    },
    sanitizedProductName: {
        type: String,
        required: true,
        index: true,
        select: false
    },
    description: {
        type: String,
        required: false
    },
    totalStock: {
        type: Number,
        required: true
    },
    totalSold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: false
    },
    salePrice: {
        type: Number,
        required: false
    },
    brand: {
        type: String,
        required: true
    },
    totalRating: {
        type: Number,
        default: 0
    },
    totalUsersRated: {
        type: Number,
        default: 0
    },
    createdByAdmin: {
        type: Schema.ObjectId,
        ref: 'admin',
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('product', product);