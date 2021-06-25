import { Configuration } from '../Types/types'
import { ConfigurationModel } from './configuration-model'

export class ConfigurationController {
	static getConfiguration(): Configuration {
		return ConfigurationModel.getConfiguration()
	}
	static setConfiguration(configuration: Configuration) {
		ConfigurationModel.setConfiguration(configuration)
	}
}