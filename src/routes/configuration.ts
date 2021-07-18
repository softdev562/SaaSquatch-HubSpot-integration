import Ajv from 'ajv'
import ConfigurationPayloadSchema from '../Types/configuration-payload-schema.json'

import { Router } from 'express'
import { Configuration } from '../Types/types'
import { ConfigurationController } from '../integration/ConfigurationController'
import { authenticateToken } from './oath'

const router = Router()
const ajv = new Ajv()

const validate =  ajv.compile(ConfigurationPayloadSchema)

const API_CONFIGURATION_URL = '/api/configuration'

const configurationController = new ConfigurationController();

router.get(API_CONFIGURATION_URL, async (req, res) => {
	let decoded = undefined
	if(req.query.token) {
		decoded = authenticateToken(req.query.token as string)
	}
	if (decoded != undefined) {
		const configuration = await configurationController.getConfiguration()
		res.json(configuration)
		res.end();
	} else {
		console.error(`GET ${API_CONFIGURATION_URL} -> Failed to validate OAuth token`)
		res.sendStatus(400);
		res.end();
	}
})
router.post(API_CONFIGURATION_URL, async (req, res) => {
	let decoded = undefined
	if(req.query.token) {
		decoded = authenticateToken(req.query.token as string)
	}
	if(validate(req.body) && decoded != undefined) {
		const configuration: Configuration = req.body as Configuration
		configurationController.setConfiguration(configuration)
		res.sendStatus(200)
		res.end()
	} else if (!validate(req.body)) {
		console.error(`POST ${API_CONFIGURATION_URL} -> Failed to validate response body`)
		res.sendStatus(400);
		res.end();
	} else if (decoded === undefined) {
		console.error(`POST ${API_CONFIGURATION_URL} -> Failed to validate OAuth token`)
		res.sendStatus(400);
		res.end();
	}
})
router.put(API_CONFIGURATION_URL, async (req, res) => {
	let decoded = undefined
	if(req.query.token) {
		decoded = authenticateToken(req.query.token as string)
	}
	if(validate(req.body) && decoded != undefined) {
		const configuration: Configuration = req.body as Configuration
		configurationController.updateConfiguration(configuration)
		res.sendStatus(200)
		res.end()
	} else if (!validate(req.body)) {
		console.error(`PUT ${API_CONFIGURATION_URL} -> Failed to validate response body`)
		res.sendStatus(400);
		res.end();
	} else if (decoded === undefined){
		console.error(`PUT ${API_CONFIGURATION_URL} -> Failed to validate OAuth token`)
		res.sendStatus(400);
		res.end();
	}
})

export { router as configurationRoutes }