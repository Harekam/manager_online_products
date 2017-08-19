'use strict';
/**
 * Created by harekam on 18/08/17.
 */
const async = require('async');
const Services = require('../Services');
const Config = require('../Config');
const util = require('./util');
const log4js = require('log4js');
const logger = log4js.getLogger('[BOOTSTRAP]');

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
            if (!util.isEmpty(result))
                return callback(null);
            Services.adminService.addNewAdmin(Object.assign({}, adminData, {password}), function (error) {
                if (error)
                    logger.error("Bootstrapping error for " + adminData.phoneNumber);
                else
                    logger.warn('Bootstrapping finished for ' + adminData.phoneNumber);
                return callback(null);
            });
        }
    ], callbackParent);
}