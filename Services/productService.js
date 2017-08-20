/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const DaoManager = require('./DaoManager');
const MODEL = require('../Models').product;

function addProduct(data, callback) {
    DaoManager.setData(MODEL, data, callback);
}

function updateProduct(data, callback) {
    const query = {
        _id: data.productId,
        isDeleted: false
    };
    delete data.productId;
    DaoManager.update(MODEL, query, data, {
        limit: 1,
        lean: true
    }, callback);
}

function deleteProduct(data, callback) {
    const query = {
        _id: data.productId,
        isDeleted: false
    };
    DaoManager.update(MODEL, query, {
        isDeleted: true,
        deletedAt: new Date()
    }, {
        limit: 1,
        lean: true
    }, callback);
}

function getProduct(data, callback) {
    const query = {};
    const options = {
        limit: data.limit,
        skip: data.skip,
        sort: {
            createdAt: data.orderBy
        },
        lean: true
    };
    if (data.productId) {
        query._id = data.productId;
        options.limit = 1;
        options.skip = 0;
    }
    if (!data.includeDeleted)
        query.isDeleted = false;

    if (data.searchText)
        query.sanitizedProductName = new RegExp(data.searchText);

    DaoManager.getData(MODEL, query, {
        __v: 0,
        createdByAdmin: 0
    }, options, callback);
}

function getProductCount(data, callback) {
    const query = {};
    if (data.productId)
        query._id = data.productId;

    if (!data.includeDeleted)
        query.isDeleted = false;
    if (data.searchText)
        query.sanitizedProductName = new RegExp(data.searchText);

    DaoManager.getCount(MODEL, query, callback);
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductCount
};