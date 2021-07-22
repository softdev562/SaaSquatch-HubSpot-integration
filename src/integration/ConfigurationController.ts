/**
 * ConfigurationController
 *
 * Includes utitlities for exposing configuration data to routes.
 */

import { Configuration } from '../Types/types';
import { ConfigurationModel } from './ConfigurationModel';
export class ConfigurationController {
	public static async getConfiguration(tenantAlias: string): Promise<Configuration> {
		return ConfigurationModel.getConfiguration(tenantAlias)
	}
	public static async setConfiguration(hubspotId: string, configuration: Configuration): Promise<void> {
		return ConfigurationModel.setConfiguration(hubspotId, configuration)
	}

	public static async updateConfiguration(configuration: Configuration): Promise<void> {
		return ConfigurationModel.updateConfiguration(configuration)
	}
}
