/**
 * ConfigurationController
 *
 * Includes utitlities for exposing configuration data to routes.
 */

import { Configuration } from '../Types/types';
import { ConfigurationModel } from './ConfigurationModel';
export class ConfigurationController {
    public static async getConfiguration(userIdentifier: string): Promise<Configuration> {
        return ConfigurationModel.getConfiguration(userIdentifier);
    }
    public static async createConfiguration(
        userIdentifier: string,
        hubspotId: string,
        configuration: Configuration,
    ): Promise<void> {
        return ConfigurationModel.createConfiguration(userIdentifier, hubspotId, configuration);
    }

    public static async updateConfiguration(userId: string, configuration: Configuration): Promise<void> {
        return ConfigurationModel.updateConfiguration(userId, configuration);
    }
}
