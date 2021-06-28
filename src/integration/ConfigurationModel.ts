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

	public async getConfiguration() {
		return PollDatabase("testUser@example.com");
	}

	public async setConfiguration(configuration: Configuration) {
		AddToDatabase("testUser@example.com", configuration);
	}
}