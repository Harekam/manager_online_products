/**
 * Created by harekamsingh on 18/08/17.
 */
'use strict';
const DaoManager = require('./DaoManager');
const MODEL = require('../Models').admin;

function addNewAdmin(data, callback) {
    DaoManager.setData(MODEL, data, callback);
}

function fetchAdminDetails(data, callback) {
    let query = {};
    const projection = {
        isBlocked: 1,
        userRole: 1,
        _id: 1
    };
    if (data.loginId) {
        query = {
            $or: [{
                email: data.loginId
            }, {
                phoneNumber: data.loginId
            }],
            isDeleted: false
        };
        projection.password = 1;
    } else {
        query = {
            accessToken: data.accessToken
        };
    }
    DaoManager.getData(MODEL, query, projection, {
        limit: 1,
        lean: true
    }, callback);
}

function getAdminDataByEmail(data, callback) {
    const query = {
        email: data.email
    };
    DaoManager.getData(MODEL, query, {
        _id: 1
    }, {
        limit: 1,
        lean: true
    }, callback);
}

function updateLoginDetails(data, callback) {
    const query = {
        _id: data._id
    };
    DaoManager.update(MODEL, query, {
        accessToken: data.accessToken,
        $inc: {
            loginCount: 1
        },
        lastLogin: new Date()
    }, {
        limit: 1,
        lean: true
    }, callback);
}

module.exports = {
    addNewAdmin,
    fetchAdminDetails,
    updateLoginDetails,
    getAdminDataByEmail
};