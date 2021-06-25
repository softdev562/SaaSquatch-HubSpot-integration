import { Configuration } from '../Types/types'

export class ConfigurationModel {
	static configuration: Configuration = {
		hubspotToSaasquatch: true,
		saasquatchToHubspot: true
	}

	static getConfiguration(): Configuration {
		return this.configuration
	}

	static setConfiguration(configuration: Configuration) {
		this.configuration = configuration
	}
}