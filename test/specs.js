'use strict';
var serviceUrl = require('..');
var endpoints = require('dibs-endpoints');
var assert = require('assert');
describe('service url', function () {
    var origLatest;
    var origServicesLatest;
    beforeEach(function () {
        origLatest = endpoints.latest;
        origServicesLatest = endpoints.latestServices;
        endpoints.latest = {
            testService: "foobarfoo"
        };
        endpoints.latestServices = {
            testService: 'foo'
        };
    });
    afterEach(function () {
        endpoints.latest = origLatest;
        endpoints.latestServices = origServicesLatest;
    });

    it('should build a url with endpoints from latest', function () {
        assert.equal(serviceUrl({
            versions: endpoints,
            service: 'testService'
        }), "/soa/foobarfoo");
    });
    it('should append query params when provided', function () {
        assert(serviceUrl({
            versions: endpoints,
            service: 'testService', params: {baz: 5, bak: 9}
        }), "/soa/foobarfoo?baz=5&bak=9");
    });
    it('should use msoa instead of soa when mock is provided as an option', function () {
        assert(serviceUrl({
            versions: endpoints,
            mock: true, service: 'testService'
        }), "/msoa/foobarfoo");
    });
    it('should /-concat multiple parts to an endpoint when specified as an array', function () {
        assert(serviceUrl({
            versions: endpoints,
            mock:    true,
            service: 'testService',
            end:     ['hello', 'world']
        }), "/msoa/foobarfoo/hello/world");
    });
    it('should build service using latestService plus api version', function () {
        assert(serviceUrl({
            versions: endpoints,
            latestService: 'testService',
            apiVersion:    1
        }), '/soa/foo/1');
    });
    it('should use mock service with latestService and apiVersion', function () {
        assert(serviceUrl({
            versions: endpoints,
            mock: true,
            latestService: 'testService',
            apiVersion:    1
        }), '/msoa/foo/1');
    });
    it('should use lastestService && apiVersion && /-concat multiple parts to an endpoint when specified as an array', function () {
        assert(serviceUrl({
            versions: endpoints,
            mock:    true,
            latestService: 'testService',
            apiVersion: 1,
            end:     ['hello', 'world']
        }), "/msoa/foo/1/hello/world");
    });
    it('should use lastestService && apiVersion && append query params when provided', function () {
        assert(serviceUrl({
            versions: endpoints,
            latestService: 'testService',
            apiVersion: 1,
            params: {baz: 5, bak: 'test'}
        }), "/soa/foo/1?baz=5&bak=test");
    });
    it('should error if the latestServices is set with no apiVersion', function () {
        assert.throws(function () {
            serviceUrl({
                versions: endpoints,
                latestService: 'testService'
            });
        });
    });

});
