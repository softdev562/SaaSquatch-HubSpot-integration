/**
 * ConfigurationController
 * 
 * Includes utitlities for exposing configuration data to routes.
 */

import { Configuration } from '../Types/types'
import { ConfigurationModel } from './ConfigurationModel'
export class ConfigurationController {
	public static async getConfiguration(userIdentifier: string) {
		return ConfigurationModel.getConfiguration(userIdentifier)
	}
	public static async setConfiguration(userIdentifier: string, configuration: Configuration) {
		return ConfigurationModel.setConfiguration(userIdentifier, configuration)
	}
}