import { Configuration } from '../Types/types'
import { ReturnedConfiguration } from '../Types/types'
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

	static configurationReturn: ReturnedConfiguration = {
		hubspot: {
			AddShareLinks: true,
			AssosiatedCompany: true,
			ConnectShareLinks: true,
			ConnectToSaasquach: true,
			ContactField: true,
			ContactOwner: true,
			CreateDate: true,
			CreateInHubspot: true,
			DeleteConnected: true,
			HEmail: true,
			LastActivityDate: true,
			Name: true
			},
		saasquach: {
			ConnectToHubspot: true,
			CreateParticipant: true,
			DeleteWhenDeleted: true,
			Field: true,
			First: true,
			Last: true,
			Refferable: true,
			SEmail: true
			},
		userinfo: { emailCredential: "" }
	}

	static getConfiguration(): any {
		// TODO: Fix return type of data
		return PollDatabase("testUser@example.com") || this.configurationReturn;
	}

	static setConfiguration(configuration: Configuration) {
		AddToDatabase("testUser@example.com", configuration);
	}
}