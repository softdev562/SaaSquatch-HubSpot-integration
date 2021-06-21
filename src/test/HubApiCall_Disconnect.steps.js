"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var jest_cucumber_1 = require("jest-cucumber");
var oath_1 = require("../routes/oath");
var axios = require("axios");
var Disconnect = jest_cucumber_1.loadFeature('features/Disconnect.feature');
var querystring = require('query-string');
axios.defaults.adapter = require('axios/lib/adapters/http');
var correctCall = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get('https://dog.ceo/api/breeds/list/all')];
            case 1:
                response = _a.sent();
                data = response.data;
                return [2 /*return*/, data];
            case 2:
                e_1 = _a.sent();
                console.error('  > Unable to retrieve contact');
                return [2 /*return*/, JSON.parse(e_1.response.body)];
            case 3: return [2 /*return*/];
        }
    });
}); };
var errorCall = function () { return __awaiter(void 0, void 0, void 0, function () {
    var options, response, data, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                options = {
                    method: 'GET',
                    url: 'https://api.hubapi.com/crm/v3/objects/contacts',
                    qs: { limit: '10', archived: 'false' },
                    headers: { accept: 'application/json', authorization: 'expired_refresh_token' }
                };
                return [4 /*yield*/, axios.get(querystring.stringify(options))];
            case 1:
                response = _a.sent();
                data = response.data;
                return [2 /*return*/, data];
            case 2:
                e_2 = _a.sent();
                console.log('  > Unable to retrieve contact');
                return [2 /*return*/, JSON.parse(e_2.response.body)];
            case 3: return [2 /*return*/];
        }
    });
}); };
jest_cucumber_1.defineFeature(Disconnect, function (test) {
    //#todo UPDATE LINE BELOW TO RECIEVE access and refresh token from DB
    var refresh_token, access_token;
    test('Disconnecting Hubspot from integration', function (_a) {
        var given = _a.given, and = _a.and, when = _a.when, then = _a.then;
        given('I have a SaaSquatch account', function () {
        });
        and('a Hubspot account', function () {
        });
        given('I have installed the integration in Hubspot', function () {
            // this can be verified by checking if the user has a refresh token.
        });
        when('I disconnect the integration from my Hubspot account', function () {
            // this implies that the refresh token has been invalidated
            // unable to get selenium working as of yet but for testing
            // purposes we can use an invalid refresh token (random string)
            refresh_token = 'invalid token example';
        });
        and('the current access token expires', function () {
            //
            access_token = "nowexpiredaccess_token";
        });
        then('requests from the integration to protected endpoints in Hubspot fail', function () {
            // the api call will happen in the final then
        });
        and('the integration attempts to get a new access token from Hubspot', function () {
            // this step is done in step a call to hubspotAPi function in the then below
        });
        then('a bad request error is returned', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oath_1.HubApiCall(errorCall, refresh_token)];
                    case 1:
                        res = _a.sent();
                        try {
                            expect(res.statusText).toBe('Bad Request');
                        }
                        catch (e) {
                            expect(true).toBe(false);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
    test('Disconnecting Hubspot from integration and access token is not expired yet', function (_a) {
        var given = _a.given, and = _a.and, when = _a.when, then = _a.then;
        given('I have a SaaSquatch account', function () {
        });
        and('a Hubspot account', function () {
        });
        given('I have installed the integration in Hubspot', function () {
            // this can be verified by checking if the user has a refresh token.
        });
        when('I disconnect the integration from my Hubspot account', function () {
            // this implies that the refresh token has been invalidated
            // unable to get selenium working as of yet but for testing
            // purposes we can use an invalid refresh token (random string)
            refresh_token = 'invalid token example';
        });
        and('the current access token has not expired', function () {
            //#todo perhaps consider getting the access token from DB
            //#todo although a mock api call that returns success is sufficient for this test
            access_token = "valid_access_token";
        });
        then('requests from the integration to protected endpoints in Hubspot pass', function () {
            // the api call will happen in the final then
        });
        and('a status 200 is returned', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, oath_1.HubApiCall(correctCall, refresh_token)];
                    case 1:
                        res = _a.sent();
                        expect(res.status).toBe('success');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
