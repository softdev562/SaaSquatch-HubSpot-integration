import firebase from "firebase/app";
import "firebase/database";
const crypto = require('crypto')

function hashValue(stringValue: string){
    stringValue.toLowerCase()
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

export async function PollDatabase(tenantAllias: string) {
    var key = hashValue(tenantAllias);
    var databseRef = firebase.database().ref();
    var data = {PushPartixipantsAsContacts: false, PullParticipantsIntoContacts: false,
        DeleteContactwhenParticipantDeleted: false,PushContactsAsParticipants: false,
        PullContactsIntoParticipants: false, DeleteParticipantWhenContactDeleted: false,
        accessToken: "", refreshToken: ""};
    await databseRef.child('users/' + key).get().then((snapshot) => {
        if (snapshot.exists()) {
            data.PushPartixipantsAsContacts =           snapshot.child("saasquach/PushPartixipantsAsContacts").val();
            data.PullParticipantsIntoContacts =         snapshot.child("saasquach/PullParticipantsIntoContacts").val();
            data.DeleteContactwhenParticipantDeleted =  snapshot.child("saasquach/DeleteContactwhenParticipantDeleted").val();
            data.PushContactsAsParticipants =           snapshot.child("hubspot/PushContactsAsParticipants").val();
            data.PullContactsIntoParticipants =         snapshot.child("hubspot/PullContactsIntoParticipants").val();
            data.DeleteParticipantWhenContactDeleted =  snapshot.child("hubspot/DeleteParticipantWhenContactDeleted").val();
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

export async function LookupAlias(hubspotID: string) {
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
		throw new Error(error);
      });
    return data;
}


/**
 * Passing in a tenant alias as well as the access token and refresh token should update both, thoough the most
 * up to date version of both must be passed in. If only 1 needs to be changed, use the update fnction
 */
export function AddTokensToDatabase(tenantAllias: string, accessToken: string, refreshToken: string) {
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
    await databseRef.child('users/' + key + 'userinfo').get().then((snapshot) => {
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