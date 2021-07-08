import { Configuration } from '../Types/types'
import { PollDatabase } from '../database'
import { AddToDatabase } from '../database'
import { EditDatabase } from '../database'

export class ConfigurationModel {
	static configuration: Configuration = {
		PushPartixipantsAsContacts: false, 
		PullParticipantsIntoContacts: false,
		DeleteContactwhenParticipantDeleted: false,
		PushContactsAsParticipants: false,
		PullContactsIntoParticipants: false, 
		DeleteParticipantWhenContactDeleted: false,
		accessToken: "", 
		refreshToken: ""
	}

	public async getConfiguration() {
		return PollDatabase("testTenantAlias");
	}

	public async setConfiguration(configuration: Configuration) {
		AddToDatabase("testTenantAlias", "testHubspotID", configuration);
	}

	public async updateConfiguration(configuration: Configuration) {
		EditDatabase("testTenantAlias", configuration);
	}
}