/**
 * Created by harekam on 12/7/15.
 */
'use strict';
const Inert = require('inert'),
    Vision = require('vision');
module.exports = [
    {register: require('./auth-token')},
    Inert,
    Vision,
    {register: require('./swagger')},
    {register: require('./good-console')}
];