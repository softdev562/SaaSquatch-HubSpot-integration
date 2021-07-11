/**
 * ConfigurationModel
 * 
 * Stores/manages information about a specific integration's configuration.
 * The current implementation only exposes a configuration for a single user.
 * This should be changed when session-management is implemented.
 * 
 * See also: ConfigurationController (for network-based interaction with a user's configuration)
 */

import { Configuration } from '../Types/types'
import { AddToDatabase } from '../database'
import { PollDatabase } from '../database'
export class ConfigurationModel {
	static configuration: Configuration = {
		ConnectToHubspot: true,
		CreateParticipant: true,
		Field: true,
		First: true,
		Last: true,
		SEmail: true,
		Refferable: true,
		DeleteWhenDeleted: true,
		ConnectToSaasquach: true,
		CreateInHubspot: true,
		ContactField: true,
		Name: true,
		HEmail: true,
		ContactOwner: true,
		AssosiatedCompany: true,
		LastActivityDate: true,
		CreateDate: true,
		DeleteConnected: true,
		ConnectShareLinks: true,
		AddShareLinks: true
	}

	public static async getConfiguration(userIdentifier: string) {
		return PollDatabase(userIdentifier);
	}

	public static async setConfiguration(userIdentifier: string, configuration: Configuration) {
		AddToDatabase(userIdentifier, configuration);
	}
}