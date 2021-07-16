import Ajv from 'ajv'
import ConfigurationPayloadSchema from '../Types/configuration-payload-schema.json'

import { Router } from 'express'
import { Configuration } from '../Types/types'
import { ConfigurationController } from '../integration/ConfigurationController'

import {
	MOCK_SESSION_USER_ID,
	MOCK_SESSION_HUBSPOT_ID,
} from '../mock'

const router = Router()
const ajv = new Ajv()

const validate =  ajv.compile(ConfigurationPayloadSchema)

const API_CONFIGURATION_URL = '/api/configuration'

router.get(API_CONFIGURATION_URL, async (req, res) => {
	const configuration = await ConfigurationController.getConfiguration(MOCK_SESSION_USER_ID)
	res.json(configuration)
	res.end();
})
router.post(API_CONFIGURATION_URL, async (req, res) => {
	if(validate(req.body)) {
		const configuration: Configuration = req.body as Configuration
		ConfigurationController.createConfiguration(MOCK_SESSION_USER_ID, MOCK_SESSION_HUBSPOT_ID, configuration)
		res.sendStatus(200)
		res.end()
	} else {
		console.error(`POST ${API_CONFIGURATION_URL} -> Failed to validate response body`)
		res.sendStatus(400);
		res.end();
	}
})
router.put(API_CONFIGURATION_URL, async (req, res) => {
	if(validate(req.body)) {
		const configuration: Configuration = req.body as Configuration
		ConfigurationController.updateConfiguration(MOCK_SESSION_USER_ID, configuration)
		res.sendStatus(200)
		res.end()
	} else {
		console.error(`POST ${API_CONFIGURATION_URL} -> Failed to validate response body`)
		res.sendStatus(400);
		res.end();
	}
})

export { router as configurationRoutes }