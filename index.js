'use strict';
var assign = require('lodash.assign');
var isArray = require('lodash.isarray');
var isEmpty = require('lodash.isempty');
var qs = require('qs');
module.exports = function (options) {
    var endpoint = [];
    options = assign({
        versions: undefined, // required. use require('dibs-endpoints')
        prefix: '/soa',
        service: undefined,
        latestService: undefined,
        apiVersion: undefined,
        end: undefined,
        params: {}
    }, options);
    if (!options.versions) {
        throw new Error('dibs-service-url requires options.versions');
    }
    if (!options.versions.latestServices) { // latest version tag per service
        throw new Error('dibs-service-url requires options.versions.latestServices');
    }
    if (!options.versions.latest) { // latest base endpoint per service
        throw new Error('dibs-service-url requires options.versions.latest');
    }

    if (isArray(options.end)) {
        options.end = options.end.join('/');
    }
    endpoint.push(options.prefix);
    if (options.latestService) {
        if (!options.apiVersion) {
            throw new Error('options.apiVersion required if options.latestService set');
        }
        endpoint.push(options.versions.latestServices[options.latestService]);
        endpoint.push(options.apiVersion);
    } else {
        endpoint.push(options.versions.latest[options.service]);
    }
    if (options.end) {
        endpoint.push(options.end);
    }
    endpoint = endpoint.join('/');
    if (!isEmpty(options.params)) {
        endpoint += "?" + qs.stringify(options.params);
    }
    return endpoint;
};
