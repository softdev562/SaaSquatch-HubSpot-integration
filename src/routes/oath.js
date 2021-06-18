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
exports.HubApiCall = exports.getSaasquatchToken = exports.getHubspotAccessToken = exports.tokenStore = void 0;
var express_1 = require("express");
require('dotenv').config();
var axios_1 = require("axios");
var querystring = require('query-string');
//import querystring from 'querystring';
var router = express_1.Router();
var current_user = 'VALUE_ASSIGNED_IN_HUBSPOT_ENDPOINT'; // current_user = req.SessionID
// Constants
// Hubspot
var HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
var HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
var HUBSPOT_REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;
var HUBSPOT_AUTH_URL;
if (HUBSPOT_CLIENT_ID && HUBSPOT_REDIRECT_URI) {
    HUBSPOT_AUTH_URL = "https://app.hubspot.com/oauth/authorize?client_id=" + encodeURIComponent(HUBSPOT_CLIENT_ID) + "&redirect_uri=" + encodeURIComponent(HUBSPOT_REDIRECT_URI) + "&scope=contacts";
}
else {
    console.error("HUBSPOT_CLIENT_ID:" + HUBSPOT_CLIENT_ID + " or HUBSPOT_REDIRECT_URI:" + HUBSPOT_REDIRECT_URI + " not defined in environment variables.");
}
// Saasquatch
var SAASQUATCH_CLIENT_ID = process.env.SAASQUATCH_CLIENT_ID;
var SAASQUATCH_CLIENT_SECRET = process.env.SAASQUATCH_CLIENT_SECRET;
// Temp token store, 
// TODO: move to Firebase DB
exports.tokenStore = {};
var isAuthorized = function (userId) {
    return exports.tokenStore[userId] ? true : false;
};
// Gets a new access token from Hubspot
// Input: Hubspot account refresh token.
// Return: {"refresh_token", "access_token", "expires_in"}, else if error {"status", "statusText"}
var getHubspotAccessToken = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var url, refreshTokenProof, resp, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                url = 'https://api.hubapi.com/oauth/v1/token';
                refreshTokenProof = {
                    grant_type: 'refresh_token',
                    client_id: HUBSPOT_CLIENT_ID,
                    client_secret: HUBSPOT_CLIENT_SECRET,
                    refresh_token: refreshToken
                };
                return [4 /*yield*/, axios_1["default"].post(url, querystring.stringify(refreshTokenProof))];
            case 1:
                resp = _a.sent();
                return [2 /*return*/, resp.data];
            case 2:
                e_1 = _a.sent();
                console.error("Request to '" + e_1.config.url + "' resulted in error " + e_1.response.status + " " + e_1.response.statusText + ".");
                return [2 /*return*/, { status: e_1.response.status, statusText: e_1.response.statusText }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getHubspotAccessToken = getHubspotAccessToken;
// Gets a new JWT from saasquatch
// Input: None.
// Return: {"access_token", "expires_in", "token_type"}, else if error {"status", "statusText"}
var getSaasquatchToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, tokenProof, resp, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                url = "https://squatch-dev.auth0.com/oauth/token";
                tokenProof = {
                    "grant_type": "client_credentials",
                    "client_id": SAASQUATCH_CLIENT_ID,
                    "client_secret": SAASQUATCH_CLIENT_SECRET,
                    "audience": "https://staging.referralsaasquatch.com"
                };
                return [4 /*yield*/, axios_1["default"].post(url, querystring.stringify(tokenProof))];
            case 1:
                resp = _a.sent();
                return [2 /*return*/, resp.data];
            case 2:
                e_2 = _a.sent();
                console.error("Request to '" + e_2.config.url + "' resulted in error " + e_2.response.status + " " + e_2.response.statusText + ".");
                return [2 /*return*/, { status: e_2.response.status, statusText: e_2.response.statusText }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSaasquatchToken = getSaasquatchToken;
// Start HubSpot OAuth flow
// 1. Send user to authorization page
router.get('/hubspot', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (isAuthorized(req.sessionID)) {
            try {
                res.status(200).send("<script>window.opener.location = 'http://localhost:3000/configuration'; window.close();</script>");
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            // If not authorized, send to auth url
            if (HUBSPOT_AUTH_URL) {
                res.redirect(HUBSPOT_AUTH_URL);
            }
            else {
                console.error("env AUTH_URL is undefined.");
            }
        }
        return [2 /*return*/];
    });
}); });
// 2. Get temporary authorization code from OAuth server
// 3. Combine temporary auth code with app credentials and send back to OAuth server
router.get('/oauth-callback', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, authCodeProof, resp, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.code) return [3 /*break*/, 5];
                code = req.query.code;
                authCodeProof = {
                    grant_type: 'authorization_code',
                    client_id: HUBSPOT_CLIENT_ID,
                    client_secret: HUBSPOT_CLIENT_SECRET,
                    redirect_uri: HUBSPOT_REDIRECT_URI,
                    code: code
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1["default"].post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(authCodeProof))];
            case 2:
                resp = _a.sent();
                if (resp.status != 200) {
                    throw Error("POST to get access and refresh tokens from HubSpot failed. Error:" + resp.data["error"]);
                }
                current_user = req.sessionID;
                exports.tokenStore[req.sessionID] = { "access_token": resp.data.access_token, "refresh_token": resp.data.refresh_token };
                res.redirect('/hubspot');
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.error(e_3);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                console.error("HubSpot OAuth callback did not receive temp access code.");
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
// Test route, delete later
router.get("/saasquatch_token", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, exports.getSaasquatchToken()];
            case 1:
                token = _a.sent();
                res.send(token);
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                console.log(e_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Test route, delete later
router.get("/hubspot_refresh_token", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, exports.getHubspotAccessToken(exports.tokenStore[req.sessionID]["refresh_token"])];
            case 1:
                token = _a.sent();
                res.send(token);
                return [3 /*break*/, 3];
            case 2:
                e_5 = _a.sent();
                console.log(e_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var HubApiCall = function (myapifunc, refresh_token) {
    return __awaiter(this, void 0, void 0, function () {
        var result, e_6, result, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 10]);
                    return [4 /*yield*/, myapifunc()
                        // api call went through everything is fine
                    ];
                case 1:
                    result = _a.sent();
                    // api call went through everything is fine
                    return [2 /*return*/, result];
                case 2:
                    e_6 = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 8, , 9]);
                    return [4 /*yield*/, exports.getHubspotAccessToken(refresh_token)];
                case 4:
                    result = _a.sent();
                    if (!(result.status == 400)) return [3 /*break*/, 5];
                    if (process.env.NODE_ENV == 'test') {
                        // return error result for the testing purpose
                        return [2 /*return*/, result];
                    }
                    else {
                        //below is equivalent to rejecting promise return Promise.reject(400 /*or Error*/ );
                        return [2 /*return*/, JSON.parse(result)];
                    }
                    return [3 /*break*/, 7];
                case 5:
                    // #todo: Update the line below configure with DB
                    exports.tokenStore[current_user] = { "access_token": result };
                    return [4 /*yield*/, exports.HubApiCall(myapifunc, refresh_token)];
                case 6: return [2 /*return*/, _a.sent()];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_7 = _a.sent();
                    //something went wrong?
                    return [2 /*return*/, Promise.reject(400 /*or Error*/)];
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
};
exports.HubApiCall = HubApiCall;
exports["default"] = router;
