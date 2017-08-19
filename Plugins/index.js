/**
 * Created by harekam on 12/7/15.
 */
'use strict';
const Inert = require('inert'),
    Vision = require('vision');
const modules = [
    {register: require('./auth-token')},
    Inert,
    Vision,
    {register: require('./swagger')}
];
if (process.env.NODE_ENV !== "test") modules.push({register: require('./good-console')});
module.exports = modules;