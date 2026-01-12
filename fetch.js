/* Copyright (c) 2022 Joe Teglasi. License: MIT */

/**
 * @file fetch.js
 * @description A Simple Implementation of the Fetch API for Espruino
 * @module fetch
 * @example
 * const fetch = require('fetch.js');
 * const AbortController = require('AbortController.js');
 * const abortController = new AbortController();
 * setTimeout(abortController.abort,200); //timeout until request aborts, in ms
 * fetch('https://google.com',{signal:abortController.signal}).then(r=>r.text()).then(console.log).catch(e=>console.log('Error:',e));
*/
/*
 * 
 * Built on-top of the native 'http' espruino module.
 *
 * For information about using the fetch spec, see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 * Currently, FetchResponse only implements .text() and .json() (not .arrayBuffer()/.blob()/.formData());
 *
 * Fetch params accepts 'signal' field for use with AbortController.js

Usage:

fetch('https://google.com').then(function (fetchResponse){
    console.log(fetchResponse);
    return fetchResponse.text();
}).then(console.log);


 */

//fetch(...) resolves to FetchResponse, so we can do fetch(...).then(function(fetchResponse){/* do stuff with fetchResponse */})
//deps: 'http'

/**
 * Change Log (MM/DD/YYYY):
 * 
 * 4/3/2023 
 * - Added automatic Content-Type header for text/plain and application/json (depending on if the body exists and can be parsed as JSON). This is an occasionally hidden requirement for some server implementations to detect the body of a POST request.
 * - Explicitly coerces body to a string by calling .toString() on body explicitly (if body exists).
 * 
 */

const http = require('http');

class FetchResponse {
    constructor(res) {
        this.res = res;
    }
    text() {
        const _this = this;
        return new Promise(function (r, j) {
            let timeout;
            let data = "";
            function handleClose() {
                clearTimeout(timeout);
                r(data);
            };
            _this.res.on('data', function (chunk) {
                data += chunk;
            });

            _this.res.on('close', handleClose);

            timeout = setTimeout(function () {
                _this.res.removeListener('close', handleClose);
                j('FetchRequest Timed-Out!');
            }, 5e3);
        });
    }
    json() {
        return this.text().then(JSON.parse);
    }
}

function isJSON(str) {
    try {
        return typeof JSON.parse(str) === 'object';
    } catch (e) {
        return false;
    }
}

function fetch(address, params) {
    const _params = params || {};

    if (!_params.headers) _params.headers = {};

    const content = (_params.body || _params.data) && (_params.body || _params.data).toString();

    if (content) {
        _params.headers["Content-Length"] = content.length;
        if (!_params.headers["Content-Type"]) _params.headers["Content-Type"] = isJSON(content) ? "application/json" : "text/plain";
    }

    delete _params.body;
    delete _params.data;

    const signal = _params.signal; //if using an AbortController
    if (signal) delete _params.signal;

    if (_params.method) _params.method = _params.method.toUpperCase();

    const options = Object.assign(url.parse(address), _params);

    let aborted = false;

    return new Promise(function (r, j) {

        if (signal) {  //if using an AbortController
            function abortFetch() {
                aborted = true;
                j('Fetch Error: REQUEST ABORTED.')
            }
            signal.on('abort', abortFetch);
        }

        const req = http.request(options, function (res) {
            try {
                if (signal) signal.removeAllListeners('abort');
                if (aborted) throw new Error('Request Aborted.');

                r(new FetchResponse(res))
            } catch (e) {
                j("Could Not Create FetchResponse Object: " + e)
            }
        });
        req.on('error', function (e) {
            j('HTTP Error: ' + e);
        });
        req.end(content);
    }).catch(e => {
        console.log(e, { options, content });
        throw e;
    });
}

module.exports = fetch;