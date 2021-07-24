import Ajv from 'ajv';
import ConfigurationPayloadSchema from '../Types/configuration-payload-schema.json';

import { Router } from 'express';
import { Configuration } from '../Types/types';
import { ConfigurationController } from '../integration/ConfigurationController';
import { authenticateToken } from './oath';

const router = Router();
const ajv = new Ajv();

const validate = ajv.compile(ConfigurationPayloadSchema);

const API_CONFIGURATION_URL = '/api/configuration';
const API_TEMP_CONFIGURATION_URL = '/api/configuration/temp';
const API_DELETE_TEMP_CONFIGURATION_URL = '/api/configuration/tempDelete';

router.get(API_TEMP_CONFIGURATION_URL, async (req, res) => {
    let decoded = undefined;
    if (req.cookies.frontendToken) {
        decoded = authenticateToken(req.cookies.frontendToken as string);
    }
    if (decoded != undefined) {
        const integrationTokens = await ConfigurationController.getTempUser(req.query.hubspotID as string);
        res.json(integrationTokens);
        res.end();
    } else {
        console.error(`GET ${API_TEMP_CONFIGURATION_URL} -> Failed to validate OAuth token`);
        res.sendStatus(400);
        res.end();
    }
});
router.delete(API_DELETE_TEMP_CONFIGURATION_URL, async (req, res) => {
    let decoded = undefined;
    if (req.cookies.frontendToken) {
        decoded = authenticateToken(req.cookies.frontendToken as string);
    }
    if (decoded != undefined) {
        await ConfigurationController.deleteTempUser(req.query.hubspotID as string);
        res.sendStatus(202);
        res.end();
    } else {
        console.error(`DELETE ${API_DELETE_TEMP_CONFIGURATION_URL} -> Failed to validate OAuth token`);
        res.sendStatus(400);
        res.end();
    }
});
router.get(API_CONFIGURATION_URL, async (req, res) => {
    let decoded = undefined;
    if (req.cookies.frontendToken) {
        decoded = authenticateToken(req.cookies.frontendToken as string);
    }
    if (decoded != undefined) {
        const configuration = await ConfigurationController.getConfiguration(req.query.SaaSquatchTenantAlias as string);
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
        ConfigurationController.setConfiguration(configuration.hubspotID, configuration);
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
        ConfigurationController.updateConfiguration(configuration);
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
