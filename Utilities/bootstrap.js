'use strict';
/**
 * Created by harekam on 18/08/17.
 */
const async = require('async');
const Services = require('../Services');
const Config = require('../Config');
const util = require('./util');

exports.bootstrapAdmin = function (callbackParent) {
    const adminData = Config.bootstrapAdmin;
    async.each(adminData, insertData, callbackParent);
};

function insertData(adminData, callbackParent) {
    let password = adminData.password;
    async.waterfall([
        function (callback) {
            util.cryptData(password, callback);
        },
        function (result, callback) {
            password = result;
            Services.adminService.getAdminDataByEmail(adminData, callback);
        },
        function (result, callback) {
            if (!util.isEmpty(result)) {
                console.log("Bootstrap success");
                return callback(null);
            }
            Services.adminService.addNewAdmin(Object.assign({}, adminData, {password}), function (error) {
                if (error)
                    console.error("Bootstrapping error for " + adminData.phoneNumber);
                else
                    console.log('Bootstrapping finished for ' + adminData.phoneNumber);
                return callback(null);
            });
        }
    ], callbackParent);
}