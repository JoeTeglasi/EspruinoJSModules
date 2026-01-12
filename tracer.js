/* Copyright (c) 2022 Joe Teglasi. License: MIT */

/**
 * 
 * @file tracer.js
 * @description A simple logging utility that prefixes log messages with timestamps and log levels. Inspired by https://github.com/baryon/tracer. 
 * @module tracer
 * @example
 * const logger = require('tracer.js')('myfile.js');
 * logger.info('This is an info message');
 * // output: YYYY-MM-DDTHH:mm:ss.sss <INFO> myfile.js: This is an info message
 */

function getDateTime() {
    return new Date().toLocalISOString();
}

const tracer = function (file_name) {
    return ["log", "info", "debug", "warn", "error"].reduce(function (logger, method) {
        logger[method] = function () {
            const log_text = `${getDateTime()} <${method.toUpperCase()}> ${file_name}: ` + Object.values(arguments).map(function (x) { return (typeof x === "object") ? JSON.stringify(x) : x }).join(" ");
            console.log(log_text);
            LoopbackB.inject(log_text+'\n');
        };
        return logger;
    }, {});
};
module.exports = tracer;

