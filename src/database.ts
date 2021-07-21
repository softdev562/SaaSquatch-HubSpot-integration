import chalk from "chalk";
import firebase from "firebase/app";
import "firebase/database";
import { Configuration } from "./Types/types";
const crypto = require('crypto')


//#todo: The tenant alias is a number event after converting it to string
//      the has function requires "data" argument must be of type
//      string or an instance of Buffer, TypedArray, or DataView.
function hashValue(stringValue: string){
    stringValue.toString().toLowerCase()
    return crypto.createHash('sha1').update(stringValue).digest('hex');
}


/**
 * Adds Values to Database
 * The default values for this function's parameters are false. Tennant alias is the
 * database key value, so passing it is nessesary. Other parameters can be set in the objet,
 * and if not set will default to false or the empty string.
 * Function call should look like AddToDatabase(tenantAllias,{parameter:value,...})
 * as many or as few of the parameters should be filled out as needed, but if non still include the {}
 * possible paramters include:
 * PushPartixipantsAsContacts bool, PullParticipantsIntoContacts bool, DeleteContactwhenParticipantDeleted bool
 * PushContactsAsParticipants bool, PullContactsIntoParticipants bool, DeleteParticipantWhenContactDeleted bool
 * accessToken string, refreshToken string
 */
export function AddToDatabase(tenantAllias: string, hubspotID: string, {PushPartixipantsAsContacts = false, PullParticipantsIntoContacts = false,

                                                     DeleteContactwhenParticipantDeleted = false, PushContactsAsParticipants = false,
                                                     PullContactsIntoParticipants = false, DeleteParticipantWhenContactDeleted = false,
                                                     accessToken = "", refreshToken = ""}) {
    var key = hashValue(tenantAllias);
    var id =  hashValue(hubspotID);
    firebase.database().ref('keyTable/' + id + "/SasID").set({
        ID: tenantAllias
    });
    firebase.database().ref('users/'+ key + '/saasquach' ).set({
        PushPartixipantsAsContacts: PushPartixipantsAsContacts,
        PullParticipantsIntoContacts : PullParticipantsIntoContacts,
        DeleteContactwhenParticipantDeleted : DeleteContactwhenParticipantDeleted
    });
    firebase.database().ref('users/' + key + '/hubspot').set({
        PushContactsAsParticipants : PushContactsAsParticipants,
        PullContactsIntoParticipants : PullContactsIntoParticipants,
        DeleteParticipantWhenContactDeleted : DeleteParticipantWhenContactDeleted
    });
    firebase.database().ref('users/' + key + '/userinfo').set({
        tenantAllias: tenantAllias,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
}

/**
 * Given a tenant alliase, deletes the coresponding db entry.
 * @param tenantAllias
 */
export function DeleteFromDatabase(tenantAllias: string) {
    var key = hashValue(tenantAllias);
    firebase.database().ref('users/' + key).remove();
}

export function EditDatabase(tenantAllias: string, params : {PushPartixipantsAsContacts:Boolean,
    PullParticipantsIntoContacts:Boolean, DeleteContactwhenParticipantDeleted:Boolean, PushContactsAsParticipants:Boolean,
    PullContactsIntoParticipants:Boolean, DeleteParticipantWhenContactDeleted:Boolean, accessToken:String, refreshToken:String}) {
    var key = hashValue(tenantAllias);
    if(params.PushPartixipantsAsContacts != undefined){
        firebase.database().ref('users/'+ key + '/saasquach' ).update({
            PushPartixipantsAsContacts: params.PushPartixipantsAsContacts
        });
    }
    if(params.PullParticipantsIntoContacts != undefined){
        firebase.database().ref('users/'+ key + '/saasquach' ).update({
            PullParticipantsIntoContacts : params.PullParticipantsIntoContacts
        });
    }
    if(params.DeleteContactwhenParticipantDeleted != undefined){
        firebase.database().ref('users/'+ key + '/saasquach' ).update({
            DeleteContactwhenParticipantDeleted : params.DeleteContactwhenParticipantDeleted
        });
    }
    if(params.PushContactsAsParticipants != undefined){
        firebase.database().ref('users/' + key + '/hubspot').update({
            PushContactsAsParticipants : params.PushContactsAsParticipants
        });
    }

    if(params.PullContactsIntoParticipants != undefined){  
        firebase.database().ref('users/' + key + '/hubspot').update({
            PullContactsIntoParticipants : params.PullContactsIntoParticipants
        });
    }
    if(params.DeleteParticipantWhenContactDeleted != undefined){
        firebase.database().ref('users/' + key + '/hubspot').update({
            DeleteParticipantWhenContactDeleted : params.DeleteParticipantWhenContactDeleted
        });
    }
    if(params.accessToken != undefined){
        firebase.database().ref('users/' + key + '/userinfo').update({
            accessToken: params.accessToken
        });
    }
    if(params.refreshToken != undefined){
        firebase.database().ref('users/' + key + '/userinfo').update({
            refreshToken: params.refreshToken
        });
    }
    firebase.database().ref('users/' + key + '/userinfo').update({
        tenantAllias: tenantAllias
    });
}

export async function PollDatabase(tenantAllias: string): Promise<Configuration> {
	const key = hashValue(tenantAllias);
	const databseRef = firebase.database().ref();
	let configuration: Configuration = {
		PushPartixipantsAsContacts: false,
		PullParticipantsIntoContacts: false,
		DeleteContactwhenParticipantDeleted: false,
		PushContactsAsParticipants: false,
		PullContactsIntoParticipants: false,
		DeleteParticipantWhenContactDeleted: false,
		accessToken: '',
		refreshToken: ''
	};
	await databseRef.child('users/' + key).get().then((snapshot) => {
		if (snapshot.exists()) {
			configuration.PushPartixipantsAsContacts = snapshot.child("saasquach/PushPartixipantsAsContacts").val();
			configuration.PullParticipantsIntoContacts = snapshot.child("saasquach/PullParticipantsIntoContacts").val();
			configuration.DeleteContactwhenParticipantDeleted = snapshot.child("saasquach/DeleteContactwhenParticipantDeleted").val();

			configuration.PushContactsAsParticipants = snapshot.child("hubspot/PushContactsAsParticipants").val();
			configuration.PullContactsIntoParticipants = snapshot.child("hubspot/PullContactsIntoParticipants").val();
			configuration.DeleteParticipantWhenContactDeleted = snapshot.child("hubspot/DeleteParticipantWhenContactDeleted").val();

			configuration.accessToken = snapshot.child("userinfo/accessToken").val();
			configuration.refreshToken = snapshot.child("userinfo/refreshToken").val();
		} else
			console.log(chalk.bold("No configuration data available!"));
	}).catch((error) => {
		console.error(error);
	});
	return configuration;
}

export async function LookupAllias(hubspotID: string) {
    var key = hashValue(hubspotID);
    var data = "";
    var databseRef = firebase.database().ref();
    await databseRef.child('keyTable/' + key).get().then((snapshot) => {
        if (snapshot.exists()) {
            data =  snapshot.child("SasID").val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    return data;
}


/**
 * Passing in a tenant alias as well as the access token and refresh token should update both, thoough the most
 * up to date version of both must be passed in. If only 1 needs to be changed, use the update fnction
 */
export function AddTokensToDatabase(tenantAllias: string,  accessToken: string, refreshToken: string) {
    var key = hashValue(tenantAllias);
    firebase.database().ref('users/' + key + '/userinfo').set({
        tenantAllias: tenantAllias,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
}

/**
 * Retreives the stored access and refresh tokens for a given tenant allias. returns an object of the form
 * { accessToken, refreshToken } if the entry is available. If no entry is available, it will return two empty strings
 */
export async function PollTokensFromDatabase(tenantAllias: string) {
    var key = hashValue(tenantAllias);

    var databseRef = firebase.database().ref();
    var data = {
        accessToken: "",
        refreshToken: "",
    };
    await databseRef.child('users/' + key + '/userinfo').get().then((snapshot) => {
        if (snapshot.exists()) {
            data.accessToken =     snapshot.child("accessToken").val();
            data.refreshToken =    snapshot.child("refreshToken").val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
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
export function AddTempUser(hubspotID: string, accessToken = "", refreshToken = "") {
    var key =  hashValue(hubspotID);
    firebase.database().ref('tempUsers/'+ key ).set({
        hubspotID : hubspotID,
        accessToken : accessToken,
        refreshToken : refreshToken,
    });
}

export function DeleteTempUser(hubspotID: string) {
    var key = hashValue(hubspotID);
    firebase.database().ref('tempUsers/' + key).remove();
}


/**
 * Allowes us to read the values stored in the temporary user table
 * @param hubspotID 
 * @returns { accessToken, refreshToken }
 *  Fields will be empty if it does not return
 */
export async function PollTempUser(hubspotID: string) {
    var key = hashValue(hubspotID);
    var databseRef = firebase.database().ref();
    var data = { accessToken: "", refreshToken: "" };
    await databseRef.child('tempUsers/' + key).get().then((snapshot) => {
        if (snapshot.exists()) {
            data.accessToken =      snapshot.child("userinfo/accessToken").val();
            data.refreshToken =     snapshot.child("userinfo/refreshToken").val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    return data;
}