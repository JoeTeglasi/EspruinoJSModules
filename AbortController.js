/* Copyright (c) 2022 Joe Teglasi. License: MIT */

/**
 * @file AbortController.js
 * @description A Basic Implementation of AbortController, compatible with fetch.js or any other spec that supports Abortcontrollers
 * @module AbortController
 * @example
 * const fetch = require('fetch.js');
 * const AbortController = require('AbortController.js');
 * const abortController = new AbortController();
 * setTimeout(abortController.abort,200); //timeout until request aborts, in ms
 * fetch('https://google.com',{signal:abortController.signal}).then(r=>r.text()).then(console.log).catch(e=>console.log('Error:',e));
*/

function AbortSignal(){}

function AbortController() {
    const signal = new AbortSignal();
    this.abort = function () {
        signal.emit('abort')
    }
    this.signal = signal;
}

exports = AbortController;
