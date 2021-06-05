"use strict";
exports.__esModule = true;
var express_1 = require("express");
var router = express_1.Router();
router.get('/api/', function (_, res) {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({
        apiVersion: 1,
        documentation: 'https://github.com/SENG499-team-2/SaaSquatch-HubSpot-integration'
    }));
});
exports["default"] = router;
