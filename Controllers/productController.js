/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const {
    util
} = require('../Utilities');
const async = require('async');
const Services = require('../Services');
const config = require('../Config');
const {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES
} = config.RESPONSE_MESSAGES;
const constants = config.CONSTANTS;
const STATUS_CODE = constants.STATUS_CODE;

function addProduct(userDetails, payload, callbackRoute) {
    payload.createdByAdmin = userDetails.userData._id;
    payload.sanitizedProductName = payload.productName.toLowerCase();
    async.auto({
        add: (callback) => {
            Services.productService.addProduct(payload, callback);
        }
    }, (err, results) => {
        if (err) return callbackRoute(util.createErrorResponse(err));
        return callbackRoute(null, util.createSuccessResponse(SUCCESS_MESSAGES.SUCCESSFULLY_ADDED, STATUS_CODE.CREATED, {
            _id: results.add._id
        }));
    })
}

function updateProduct(userDetails, payload, callbackRoute) {
    if (payload.productName) payload.sanitizedProductName = payload.productName.toLowerCase();
    async.auto({
        update: (callback) => {
            Services.productService.updateProduct(payload, (err, res) => {
                if (err) return callback(err);
                if (res.n === 0) return callback(ERROR_MESSAGES.INVALID_ID);
                return callback(null);
            });
        }
    }, (err) => {
        if (err) return callbackRoute(util.createErrorResponse(err));
        return callbackRoute(null, util.createSuccessResponse());
    })
}

function deleteProduct(userDetails, payload, callbackRoute) {
    async.auto({
        delete: (callback) => {
            Services.productService.deleteProduct(payload, (err, res) => {
                if (err) return callback(err);
                if (res.n === 0) return callback(ERROR_MESSAGES.INVALID_ID);
                return callback(null);
            });
        }
    }, (err) => {
        if (err) return callbackRoute(util.createErrorResponse(err));
        return callbackRoute(null, util.createSuccessResponse());
    })
}

function getProduct(userDetails, queryParams, callbackRoute) {
    queryParams.orderBy = queryParams.orderBy === constants.SORT_ORDER.DESC ? -1 : 1;
    async.auto({
        products: (callback) => {
            Services.productService.getProduct(queryParams, callback);
        },
        totalCount: (callback) => {
            Services.productService.getProductCount(queryParams, callback);
        }
    }, (err, res) => {
        if (err) return callbackRoute(util.createErrorResponse(err));
        return callbackRoute(null, util.createSuccessResponse(null, null, res));
    })
}
module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct
};