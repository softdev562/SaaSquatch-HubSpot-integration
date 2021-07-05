import firebase from "firebase/app";
import "firebase/database";
import { Configuration } from './Types/types'
const crypto = require('crypto')

function hashValue(stringValue: string){
    stringValue.toLowerCase()
    return crypto.createHash('sha1').update(stringValue).digest('hex');
}

/**
 * Adds Values to Database
 */
export function AddToDatabase(email: string, data: Configuration) {
        var key = hashValue(email);
        firebase.database().ref('users/'+ key + '/saasquach' ).set({
            ConnectToHubspot: data.ConnectToHubspot,
            CreateParticipant: data.CreateParticipant,
            Field: data.Field,
            First: data.First,
            Last: data.Last,
            SEmail: data.SEmail,
            Refferable: data.Refferable,
            DeleteWhenDeleted: data.DeleteWhenDeleted
        });
        firebase.database().ref('users/' + key + '/hubspot').set({
            ConnectToSaasquach: data.ConnectToSaasquach,
            CreateInHubspot: data.CreateInHubspot,
            ContactField: data.ContactField,
            Name: data.Name,
            HEmail: data.HEmail,
            ContactOwner: data.ContactOwner,
            AssosiatedCompany: data.AssosiatedCompany,
            LastActivityDate: data.LastActivityDate,
            CreateDate: data.CreateDate,
            DeleteConnected: data.DeleteConnected,
            ConnectShareLinks: data.ConnectShareLinks,
            AddShareLinks: data.AddShareLinks
        });
        firebase.database().ref('users/' + key + '/userinfo').set({
            emailCredential: email,
            accessToken: "",
            refreshToken: ""
        });
    }

export function DeleteFromDatabase(email: string) {
    var key = hashValue(email);
    firebase.database().ref('users/' + key).remove();
}

export function EditDatabase() {//Not Done at all yet
    var userkey = "name";
    firebase.database().ref('users/' + userkey + 'userinfo').set({
        email: 'email@example.com', //We need to remove any feild here that we don't want to change, so this one might be aa bit complex
        hcreate: false,
        hupdate: false,
        hsync: false
    });
}

export async function PollDatabase(email: string) {
    var key = hashValue(email);
    var databseRef = firebase.database().ref();
    var data = {
        ConnectToHubspot: false,
        CreateParticipant: false,
        Field: false,
        First: false,
        Last: false,
        SEmail: false,
        Refferable: false,
        DeleteWhenDeleted: false,
        ConnectToSaasquach: false,
        CreateInHubspot: false,
        ContactField: false,
        Name: false,
        HEmail: false,
        ContactOwner: false,
        AssosiatedCompany: false,
        LastActivityDate: false,
        CreateDate: false,
        DeleteConnected: false,
        ConnectShareLinks: false,
        AddShareLinks: false,
    };
    await databseRef.child('users/' + key).get().then((snapshot) => {
        if (snapshot.exists()) {
            data.ConnectToHubspot =     snapshot.child("saasquach/ConnectToHubspot").val();
            data.CreateParticipant =    snapshot.child("saasquach/CreateParticipant").val();
            data.Field =                snapshot.child("saasquach/Field").val();
            data.First =                snapshot.child("saasquach/First").val();
            data.Last =                 snapshot.child("saasquach/Last").val();
            data.SEmail =               snapshot.child("saasquach/SEmail").val();
            data.Refferable =           snapshot.child("saasquach/Refferable").val();
            data.DeleteWhenDeleted =    snapshot.child("saasquach/DeleteWhenDeleted").val();
            data.ConnectToSaasquach =   snapshot.child("hubspot/ConnectToSaasquach").val();
            data.CreateInHubspot =      snapshot.child("hubspot/CreateInHubspot").val();
            data.ContactField =         snapshot.child("hubspot/ContactField").val();
            data.Name =                 snapshot.child("hubspot/Name").val();
            data.HEmail =               snapshot.child("hubspot/HEmail").val();
            data.ContactOwner =         snapshot.child("hubspot/ContactOwner").val();
            data.AssosiatedCompany =    snapshot.child("hubspot/AssosiatedCompany").val();
            data.LastActivityDate =     snapshot.child("hubspot/LastActivityDate").val();
            data.CreateDate =           snapshot.child("hubspot/CreateDate").val();
            data.DeleteConnected =      snapshot.child("hubspot/DeleteConnected").val();
            data.ConnectShareLinks =    snapshot.child("hubspot/ConnectShareLinks").val();
            data.AddShareLinks =        snapshot.child("hubspot/AddShareLinks").val();
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    return data;
}

export function AddTokensToDatabase(email: string,  accessToken: string, refreshToken: string) {
    var key = hashValue(email);
    firebase.database().ref('users/' + key + '/userinfo').set({
        emailCredential: email,
        accessToken: accessToken,
        refreshToken: refreshToken
    });
}

export async function PollTokensFromDatabase(email: string) {
    var key = hashValue(email);
    var databseRef = firebase.database().ref();
    var data = {
        accessToken: false,
        refreshToken: false,
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