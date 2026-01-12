# Additional JS Modules for Espruino

This collection of Espruino modules allow for faster prototyping of Espruino-based projects.

## Table of Contents

| file | description |
| ---- | ----------- |
| AbortController.js | A Basic Implementation of AbortController, compatible with fetch.js or any other spec that supports Abortcontrollers |
| fetch.js | A Simple Implementation of the Fetch API for Espruino |
| promise-reduce.js | A utility function for reducing an array of functions (which may or may not return promises, and may optionally accept the result of the previous function as a parameter). Especially useful when the array of functions is generated dynamically |
| server.js | A server module for rapidly deploying web apps on Espruino, based on the [serverjs](serverjs.io) npm package |
| TaskManager.js | A priority-queue for scheduling tasks |
| tracer.js | A simple logging utility that prefixes log messages with timestamps and log levels. Inspired by https://github.com/baryon/tracer. |
