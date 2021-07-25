/**
 * ConfigurationModel
 *
 * Stores/manages information about a specific integration's configuration.
 * The current implementation only exposes a configuration for a single user.
 * This should be changed when session-management is implemented.
 *
 * See also: ConfigurationController (for network-based interaction with a user's configuration)
 */

import { IntegrationTokens } from '../Types/types';
import { Configuration } from '../Types/types';
import { LookupAlias, PollTempUser } from '../database';
import { DeleteTempUser } from '../database';
import { PollDatabase } from '../database';
import { AddToDatabase } from '../database';
import { EditDatabase } from '../database';

export class ConfigurationModel {
    public static async getConfigurationWithSaaSquatchTenantAlias(tenantAlias: string): Promise<Configuration> {
        return PollDatabase(tenantAlias);
    }

    public static async getConfigurationWithHubspotId(hubspotId: number): Promise<Configuration> {
        const tenantAlias = await LookupAlias(String(hubspotId));
        if (tenantAlias) return PollDatabase(tenantAlias);
        else throw Error(`Failed to find tenant alias for hubspotId: ${hubspotId}`);
    }

    public static async getTempUser(hubspotID: string): Promise<IntegrationTokens> {
        return PollTempUser(hubspotID);
    }

    public static async deleteTempUser(hubspotID: string): Promise<void> {
        return DeleteTempUser(hubspotID);
    }

    public static async getConfiguration(tenantAlias: string): Promise<Configuration> {
        return PollDatabase(tenantAlias);
    }

    public static async setConfiguration(hubspotId: string, configuration: Configuration): Promise<void> {
        return AddToDatabase(configuration.SaaSquatchTenantAlias, hubspotId, configuration);
    }

    public static async updateConfiguration(configuration: Configuration): Promise<void> {
        return EditDatabase(configuration.SaaSquatchTenantAlias, configuration);
    }
}
