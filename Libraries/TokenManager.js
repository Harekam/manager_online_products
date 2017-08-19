/**
 * Created by harekam on 18/08/17.
 */
'use strict';
const Jwt = require('jsonwebtoken');
const config = require('../Config');
const {
    util
} = require('../Utilities');

const {
    ERROR_MESSAGES
} = config.RESPONSE_MESSAGES;

function cipherToken(tokenData, callback) {
    return Jwt.sign(tokenData, config.serverConfig.JWT_SECRET_KEY, {
        algorithm: 'HS256'
    }, callback);
}

function decipherToken(token, callback) {
    Jwt.verify(token, config.serverConfig.JWT_SECRET_KEY, (err, decodedData) => {
        if (err)
            return callback(util.createErrorResponse(ERROR_MESSAGES.ACCESS_DENIED, config.CONSTANTS.STATUS_CODE.UNAUTHORIZED));
        return callback(null, decodedData);
    })
}

module.exports = {
    cipherToken: cipherToken,
    decipherToken: decipherToken
};