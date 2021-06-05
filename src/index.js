"use strict";
exports.__esModule = true;
var express_1 = require("express");
var path_1 = require("path");
var chalk_1 = require("chalk");
var routes_1 = require("./routes");
// constants
var PORT = process.env.PORT || 8000;
var _a = process.env, HAPIKEY = _a.HUBSPOT_API_KEY, SAPIKEY = _a.SAASQUATCH_API_KEY, STENANTALIAS = _a.SAASQUATCH_TENANT_ALIAS;
// configure
var app = express_1["default"]();
// dynamic routes
app.use(routes_1["default"]);
// static routes
app.use(express_1["default"].static(path_1["default"].join(__dirname, '../public')));
app.get('/', function (_, res) {
    res.sendFile(path_1["default"].join(__dirname, '../public', 'index.html'));
});
app.get('*', function (_, res) {
    res.redirect('/');
});
// launch
app.listen(PORT, function () { return console.log(chalk_1["default"].bold('SaaSquatch-HubSpot') +
    ' integration listening on port ' +
    chalk_1["default"].blue.bold(PORT)); });
