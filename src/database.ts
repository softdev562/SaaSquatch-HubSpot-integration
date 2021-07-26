import firebase from 'firebase/app';
import 'firebase/database';
import { Configuration, IntegrationTokens } from './Types/types';
const crypto = require('crypto');

//#todo: The tenant alias is a number event after converting it to string
//      the has function requires "data" argument must be of type
//      string or an instance of Buffer, TypedArray, or DataView.
function hashValue(stringValue: string) {
    return crypto.createHash('sha1').update(stringValue).digest('hex');
}

/**
 * Adds Values to Database
 * The default values for this function's parameters are false. Tenant alias is the
 * database key value, so passing it is necessary. Other parameters can be set in the objet,
 * and if not set will default to false or the empty string.
 * Function call should look like AddToDatabase(tenantAlias,{parameter:value,...})
 * as many or as few of the parameters should be filled out as needed, but if non still include the {}
 * possible parameters include:
 * PushParticipantsAsContacts bool, PullParticipantsIntoContacts bool, DeleteContactWhenParticipantDeleted bool
 * PushContactsAsParticipants bool, PullContactsIntoParticipants bool, DeleteParticipantWhenContactDeleted bool
 * accessToken string, refreshToken string
 */
export function AddToDatabase(
    tenantAlias: string,
    hubspotID: string,
    {
        PushParticipantsAsContacts = false,
        PullParticipantsIntoContacts = false,
        DeleteContactwhenParticipantDeleted = false,
        PushContactsAsParticipants = false,
        PullContactsIntoParticipants = false,
        DeleteParticipantWhenContactDeleted = false,
        accessToken = '',
        refreshToken = '',
    },
): void {
    const key = hashValue(tenantAlias);
    const id = hashValue(hubspotID);
    firebase
        .database()
        .ref('keyTable/' + id + '/SasID')
        .set({
            ID: tenantAlias,
        });
    firebase
        .database()
        .ref('users/' + key + '/saasquach')
        .set({
            PushParticipantsAsContacts: PushParticipantsAsContacts,
            PullParticipantsIntoContacts: PullParticipantsIntoContacts,
            DeleteContactwhenParticipantDeleted: DeleteContactwhenParticipantDeleted,
        });
    firebase
        .database()
        .ref('users/' + key + '/hubspot')
        .set({
            PushContactsAsParticipants: PushContactsAsParticipants,
            PullContactsIntoParticipants: PullContactsIntoParticipants,
            DeleteParticipantWhenContactDeleted: DeleteParticipantWhenContactDeleted,
        });
    firebase
        .database()
        .ref('users/' + key + '/userinfo')
        .set({
            tenantAlias: tenantAlias,
            hubspotID: hubspotID,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
}

/**
 * Given a tenant alias, deletes the corresponding db entry.
 * @param tenantAlias
 */
export function DeleteFromDatabase(tenantAlias: string): void {
    const key = hashValue(tenantAlias);
    firebase
        .database()
        .ref('users/' + key)
        .remove();
}

export function EditDatabase(
    tenantAlias: string,
    params: {
        PushParticipantsAsContacts: boolean;
        PullParticipantsIntoContacts: boolean;
        DeleteContactwhenParticipantDeleted: boolean;
        PushContactsAsParticipants: boolean;
        PullContactsIntoParticipants: boolean;
        DeleteParticipantWhenContactDeleted: boolean;
        hubspotID: string;
        accessToken: string;
        refreshToken: string;
    },
): void {
    const key = hashValue(tenantAlias);
    if (params.PushParticipantsAsContacts != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/saasquach')
            .update({
                PushParticipantsAsContacts: params.PushParticipantsAsContacts,
            });
    }
    if (params.PullParticipantsIntoContacts != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/saasquach')
            .update({
                PullParticipantsIntoContacts: params.PullParticipantsIntoContacts,
            });
    }
    if (params.DeleteContactwhenParticipantDeleted != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/saasquach')
            .update({
                DeleteContactwhenParticipantDeleted: params.DeleteContactwhenParticipantDeleted,
            });
    }
    if (params.PushContactsAsParticipants != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/hubspot')
            .update({
                PushContactsAsParticipants: params.PushContactsAsParticipants,
            });
    }

    if (params.PullContactsIntoParticipants != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/hubspot')
            .update({
                PullContactsIntoParticipants: params.PullContactsIntoParticipants,
            });
    }
    if (params.DeleteParticipantWhenContactDeleted != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/hubspot')
            .update({
                DeleteParticipantWhenContactDeleted: params.DeleteParticipantWhenContactDeleted,
            });
    }
    if (params.hubspotID != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/userinfo')
            .update({
                accessToken: params.hubspotID,
            });
    }
    if (params.accessToken != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/userinfo')
            .update({
                accessToken: params.accessToken,
            });
    }
    if (params.refreshToken != undefined) {
        firebase
            .database()
            .ref('users/' + key + '/userinfo')
            .update({
                refreshToken: params.refreshToken,
            });
    }
    firebase
        .database()
        .ref('users/' + key + '/userinfo')
        .update({
            tenantAlias: tenantAlias,
        });
}

export async function PollDatabase(tenantAlias: string): Promise<Configuration> {
    const key = hashValue(tenantAlias);
    const databseRef = firebase.database().ref();
    const configuration: Configuration = {
        SaaSquatchTenantAlias: '',
        PushParticipantsAsContacts: false,
        PullParticipantsIntoContacts: false,
        DeleteContactwhenParticipantDeleted: false,
        PushContactsAsParticipants: false,
        PullContactsIntoParticipants: false,
        DeleteParticipantWhenContactDeleted: false,
        hubspotID: '',
        accessToken: '',
        refreshToken: '',
    };
    await databseRef
        .child('users/' + key)
        .get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                configuration.PushParticipantsAsContacts = snapshot.child('saasquach/PushParticipantsAsContacts').val();
                configuration.PullParticipantsIntoContacts = snapshot
                    .child('saasquach/PullParticipantsIntoContacts')
                    .val();
                configuration.DeleteContactwhenParticipantDeleted = snapshot
                    .child('saasquach/DeleteContactwhenParticipantDeleted')
                    .val();

                configuration.PushContactsAsParticipants = snapshot.child('hubspot/PushContactsAsParticipants').val();
                configuration.PullContactsIntoParticipants = snapshot
                    .child('hubspot/PullContactsIntoParticipants')
                    .val();
                configuration.DeleteParticipantWhenContactDeleted = snapshot
                    .child('hubspot/DeleteParticipantWhenContactDeleted')
                    .val();

                configuration.accessToken = snapshot.child('userinfo/accessToken').val();
                configuration.refreshToken = snapshot.child('userinfo/refreshToken').val();
                configuration.hubspotID = snapshot.child('userinfo/hubspotID').val();
            } else console.warn('No configuration data available!');
        })
        .catch((error) => {
            console.error(error);
        });
    return configuration;
}

export async function LookupAlias(hubspotID: string): Promise<string> {
    const key = hashValue(hubspotID);
    let data = {
        ID: '',
    };
    const databseRef = firebase.database().ref();
    await databseRef
        .child('keyTable/' + key)
        .get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                data = snapshot.child('SasID').val();
            } else {
                console.warn('No data available');
            }
        })
        .catch((error) => {
            console.error(error);
        });
    return data.ID;
}

/**
 * Passing in a tenant alias as well as the access token and refresh token should update both, through the most
 * up to date version of both must be passed in. If only 1 needs to be changed, use the update function
 */
export function AddTokensToDatabase(tenantAlias: string, accessToken: string, refreshToken: string): void {
    const key = hashValue(tenantAlias);
    firebase
        .database()
        .ref('users/' + key + '/userinfo')
        .set({
            tenantAlias: tenantAlias,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
}

/**
 * Retrieves the stored access and refresh tokens for a given tenant alias. returns an object of the form
 * { accessToken, refreshToken } if the entry is available. If no entry is available, it will return two empty strings
 */
export async function PollTokensFromDatabase(tenantAlias: string): Promise<IntegrationTokens> {
    const key = hashValue(tenantAlias);

    const databseRef = firebase.database().ref();
    const data: IntegrationTokens = {
        accessToken: '',
        refreshToken: '',
    };
    await databseRef
        .child('users/' + key + '/userinfo')
        .get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                data.accessToken = snapshot.child('accessToken').val();
                data.refreshToken = snapshot.child('refreshToken').val();
            } else {
                console.warn('No data available');
            }
        })
        .catch((error) => {
            console.error(error);
        });
    return data;
}

/**
 * Used to store temporary user information
 * @param hubspotID
 * @param accessToken
 * @param refreshToken
 */
export function AddTempUser(hubspotID: string, accessToken = '', refreshToken = ''): void {
    const key = hashValue(hubspotID);
    firebase
        .database()
        .ref('tempUsers/' + key)
        .set({
            hubspotID: hubspotID,
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
}

export function DeleteTempUser(hubspotID: string) {
    const key = hashValue(hubspotID);
    firebase
        .database()
        .ref('tempUsers/' + key)
        .remove();
}

/**
 * Allows us to read the values stored in the temporary user table
 * @param hubspotID
 * @returns { accessToken, refreshToken }
 *  Fields will be empty if it does not return
 */
export async function PollTempUser(hubspotID: string): Promise<IntegrationTokens> {
    const key = hashValue(hubspotID);
    const databseRef = firebase.database().ref();
    const data: IntegrationTokens = { accessToken: '', refreshToken: '' };
    await databseRef
        .child('tempUsers/' + key)
        .get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                data.accessToken = snapshot.child('accessToken').val();
                data.refreshToken = snapshot.child('refreshToken').val();
            } else {
                console.error('No data available');
            }
        })
        .catch((error) => {
            console.error(error);
        });
    return data;
}
