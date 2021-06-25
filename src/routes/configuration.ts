import Ajv from 'ajv'
import ConfigurationPayloadSchema from '../Types/configuration-payload-schema.json'

import { Router } from 'express'
import { Configuration } from '../Types/types'
import { ConfigurationController } from '../integration/configuration-controller'

const router = Router()
const ajv = new Ajv()

const validate =  ajv.compile(ConfigurationPayloadSchema)

const API_CONFIGURATION_URL = '/api/configuration'

router.get(API_CONFIGURATION_URL, (req, res) => {
	const configuration = ConfigurationController.getConfiguration()
	res.json(configuration)
	res.end();
})
router.post(API_CONFIGURATION_URL, (req, res) => {
	if(validate(req.body)) {
		const configuration: Configuration = req.body as Configuration
		ConfigurationController.setConfiguration(configuration)
		res.sendStatus(200)
		res.end()
	} else {
		console.error(`POST ${API_CONFIGURATION_URL} -> Failed to validate response body`)
		res.sendStatus(400);
		res.end();
	}
})

export { router as configurationRoutes }