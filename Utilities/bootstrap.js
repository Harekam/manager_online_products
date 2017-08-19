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
    const adminData = [{
        email: 'harekamsingh@gmail.com',
        password: "qwerty",
        phoneNumber: "7503040410",
        firstName: 'Harekam',
        lastName: 'Singh',
        userRole: Config.CONSTANTS.USER_ROLE.SUPER_ADMIN
    }];
    async.each(adminData, insertData, callbackParent);
};

function insertData(adminData, callbackParent) {
    async.waterfall([
        function (callback) {
            util.cryptData(adminData.password, callback);
        },
        function (result, callback) {
            adminData.password = result;
            Services.adminService.getAdminDataByEmail(adminData, callback);
        },
        function (result, callback) {
            if (!util.isEmpty(result))
                return callback(null);
            Services.adminService.addNewAdmin(adminData, function (error) {
                if (error)
                    logger.error("Bootstrapping error for " + adminData.phoneNumber);
                else
                    logger.warn('Bootstrapping finished for ' + adminData.phoneNumber);
                return callback(null);
            });
        }
    ], callbackParent);
}