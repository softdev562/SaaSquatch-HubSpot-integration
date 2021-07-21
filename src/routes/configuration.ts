import Ajv from 'ajv';
import ConfigurationPayloadSchema from '../Types/configuration-payload-schema.json';

import { Router } from 'express';
import { Configuration } from '../Types/types';
import { ConfigurationController } from '../integration/ConfigurationController';
import { authenticateToken } from './oath';

import { MOCK_SESSION_USER_ID, MOCK_SESSION_HUBSPOT_ID } from '../mock';

const router = Router();
const ajv = new Ajv();

const validate = ajv.compile(ConfigurationPayloadSchema);

const API_CONFIGURATION_URL = '/api/configuration';

router.get(API_CONFIGURATION_URL, async (req, res) => {
    let decoded = undefined;
    if (req.cookies.frontendToken) {
        decoded = authenticateToken(req.cookies.frontendToken as string);
    }
    if (decoded != undefined) {
        const configuration = await ConfigurationController.getConfiguration(MOCK_SESSION_USER_ID);
        res.json(configuration);
        res.end();
    } else {
        console.error(`GET ${API_CONFIGURATION_URL} -> Failed to validate OAuth token`);
        res.sendStatus(400);
        res.end();
    }
});
router.post(API_CONFIGURATION_URL, async (req, res) => {
    let decoded = undefined;
    if (req.cookies.frontendToken) {
        decoded = authenticateToken(req.cookies.frontendToken as string);
    }
    if (validate(req.body) && decoded != undefined) {
        const configuration: Configuration = req.body as Configuration;
        ConfigurationController.createConfiguration(MOCK_SESSION_USER_ID, MOCK_SESSION_HUBSPOT_ID, configuration);
        res.sendStatus(200);
        res.end();
    } else if (!validate(req.body)) {
        console.error(`POST ${API_CONFIGURATION_URL} -> Failed to validate response body`);
        res.sendStatus(400);
        res.end();
    } else if (decoded === undefined) {
        console.error(`POST ${API_CONFIGURATION_URL} -> Failed to validate OAuth token`);
        res.sendStatus(400);
        res.end();
    }
});
router.put(API_CONFIGURATION_URL, async (req, res) => {
    let decoded = undefined;
    if (req.cookies.frontendToken) {
        decoded = authenticateToken(req.cookies.frontendToken as string);
    }
    if (validate(req.body) && decoded != undefined) {
        const configuration: Configuration = req.body as Configuration;
        ConfigurationController.updateConfiguration(MOCK_SESSION_USER_ID, configuration);
        res.sendStatus(200);
        res.end();
    } else if (!validate(req.body)) {
        console.error(`PUT ${API_CONFIGURATION_URL} -> Failed to validate response body`);
        res.sendStatus(400);
        res.end();
    } else if (decoded === undefined) {
        console.error(`PUT ${API_CONFIGURATION_URL} -> Failed to validate OAuth token`);
        res.sendStatus(400);
        res.end();
    }
});

export { router as configurationRoutes };
