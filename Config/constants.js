/**
 * Created by harekam on 18/08/17.
 */
'use strict';
const DEVICES = {
    ANDROID: 'ANDROID',
    IOS: 'IOS',
    WEB_BROWSER: 'WEB_BROWSER'
};
const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    DO_NOT_PROCESS: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_FAILURE: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ALREADY_EXISTS_CONFLICT: 409,
    UNSUPPORTED_MEDIA_TYPE: 415,
    SERVER_ERROR: 500
};

const TIME_UNITS = {
    MONTHS: 'months',
    MILLI: 'milli',
    HOURS: 'hours',
    MINUTES: 'minutes',
    YEARS: 'years',
    SECONDS: 'seconds',
    WEEKS: 'weeks',
    DAYS: 'days'
};
const TOKEN_LIVE_TIME = {
    frequency: 24,
    unit: TIME_UNITS.HOURS
};
const SORT_ORDER = {
    ASC: 'ASC',
    DESC: 'DESC'
};
const DATE_FORMAT = 'DD-MM-YYYY';
const TIMESTAMP_FORMAT = 'YYYY-MM-DD HH:mm';
const READABLE_DATETIME_FORMAT = "dddd, MMMM Do YYYY, hh:mm A";
const TIMEZONE_INDIA = "Asia/Kolkata";
const JAVASCRIPT_TIMESTAMP_FORMAT = 'YYYY/MM/DD HH:mm';

const ONE_DAY_MILLI = 8.64e+7;
const ONE_HOUR_MILLI = 3.6e+6;
const DEFAULT_LIMIT = 100;
const REGEX = {
    SPECIAL_CHAR_REMOVAL: /[^A-Z0-9]/ig,
    OBJECT_ID: /^[0-9a-fA-F]{24}$/,
    ALPHA_SPACE_DOT: /^[a-zA-Z\s\.]+$/,
    ALPHA_NUM_UNDER: /^[a-z0-9_\.]*$/,
    PHONE_NUMBER: /^[1-9][0-9]*$/,
    NUMBER_ONLY: /^[0-9]+$/,
    YEAR_NUMBER_ONLY: /^[1-9][0-9]*$/,
    ALPHABET_ONLY: /^[a-zA-Z ]*$/
};
const MONTHS = {
    January: "January",
    February: "February",
    March: "March",
    April: "April",
    May: "May",
    June: "June",
    July: "July",
    August: "August",
    September: "September",
    October: "October",
    November: "November",
    December: "December"
};
const PASSWORD_MIN_LEN = 6;
const PASSWORD_MAX_LEN = 100;
const PHONE_NUM_LEN = 10;
const PROFILE_PICTURE_SUFFIX_URL = process.env.PROFILE_PICTURE_SUFFIX_URL || 'http://palmleaftest.mahindracomviva.com:8088/main/upload/users/';
const PALM_LEAF_SERVER_URL = {
    SESSION_TEST: `http://palmleaftest.mahindracomviva.com:8088/api/v1/validate/`,
    USERID_TEST: `http://palmleaftest.mahindracomviva.com:8088/api/v1/validateUserIds/`
};
const USER_ROLE = {
    ADMIN: 'ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN'
};
const CONTENT_BOUNDS = {
    password: {
        min: 6,
        max: 100
    },
    phone: {
        min: 10,
        max: 10
    },
    name: {
        min: 2,
        max: 140
    },
    description: {
        min: 10,
        max: 10000
    },
    email: {
        min: 4,
        max: 254
    },
    searchText: {
        min: 1,
        max: 50
    }
};
module.exports = {
    CONTENT_BOUNDS,
    PASSWORD_MAX_LEN,
    PHONE_NUM_LEN,
    PASSWORD_MIN_LEN,
    USER_ROLE,
    PROFILE_PICTURE_SUFFIX_URL,
    PALM_LEAF_SERVER_URL,
    MONTHS,
    REGEX,
    DEVICES,
    TIME_UNITS,
    DATE_FORMAT,
    TIMESTAMP_FORMAT,
    SORT_ORDER,
    STATUS_CODE,
    TIMEZONE_INDIA,
    DEFAULT_LIMIT,
    ONE_HOUR_MILLI,
    READABLE_DATETIME_FORMAT,
    JAVASCRIPT_TIMESTAMP_FORMAT,
    TOKEN_LIVE_TIME,
    ONE_DAY_MILLI
};