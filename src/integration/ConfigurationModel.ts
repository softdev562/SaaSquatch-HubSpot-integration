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
		return PollDatabase("test_abmacfbsumae1");
	}

	public async setConfiguration(configuration: Configuration) {
		AddToDatabase("test_abmacfbsumae1", "308099", configuration);
	}

	public async updateConfiguration(configuration: Configuration) {
		EditDatabase("test_abmacfbsumae1", configuration);
	}
}