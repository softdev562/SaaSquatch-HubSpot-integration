import { Configuration } from '../Types/types'
import { ConfigurationModel } from './ConfigurationModel'

export class ConfigurationController {
	static getConfiguration(): Configuration {
		return ConfigurationModel.getConfiguration()
	}
	static setConfiguration(configuration: Configuration) {
		ConfigurationModel.setConfiguration(configuration)
	}
}