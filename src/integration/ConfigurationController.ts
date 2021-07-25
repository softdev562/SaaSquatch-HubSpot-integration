/**
 * ConfigurationController
 *
 * Includes utilities for exposing configuration data to routes.
 */

import { IntegrationTokens } from '../Types/types';
import { Configuration } from '../Types/types';
import { ConfigurationModel } from './ConfigurationModel';
export class ConfigurationController {
    public static async getTempUser(hubspotID: string): Promise<IntegrationTokens> {
        return ConfigurationModel.getTempUser(hubspotID);
    }
    public static async deleteTempUser(hubspotID: string): Promise<void> {
        return ConfigurationModel.deleteTempUser(hubspotID);
    }
    public static async getConfiguration(tenantAlias: string): Promise<Configuration> {
        return ConfigurationModel.getConfiguration(tenantAlias);
    }
    public static async setConfiguration(hubspotId: string, configuration: Configuration): Promise<void> {
        return ConfigurationModel.setConfiguration(hubspotId, configuration);
    }

    public static async updateConfiguration(configuration: Configuration): Promise<void> {
        return ConfigurationModel.updateConfiguration(configuration);
    }
}
