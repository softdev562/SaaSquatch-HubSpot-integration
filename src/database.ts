import firebase from "firebase/app";
import "firebase/database";
const crypto = require('crypto')

type blankPassObject =  {
    ConnectToHubspot: boolean,
    CreateParticipant: boolean,
    Field: boolean,
    First: boolean,
    Last: boolean,
    SEmail: boolean,
    Refferable: boolean,
    DeleteWhenDeleted: boolean,
    ConnectToSaasquach: boolean,
    CreateInHubspot: boolean,
    ContactField: boolean,
    Name: boolean,
    HEmail: boolean,
    ContactOwner: boolean,
    AssosiatedCompany: boolean,
    LastActivityDate: boolean,
    CreateDate: boolean,
    DeleteConnected: boolean,
    ConnectShareLinks: boolean,
    AddShareLinks: boolean,
};

//import { AddToDatabase } from "../database"//How to use
//abc();
function hashValue(stringValue: string){
    stringValue.toLowerCase()
    return crypto.createHash('sha1').update(stringValue).digest('hex');
}

/**
 * Adds Values to Database
 */
export function AddToDatabase(email: string, data: blankPassObject) {
        data = {
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
            AddShareLinks: true,
        };

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
            emailCredential: email
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

export function PollDatabase(email: string) {
    var key = hashValue(email);
    var databseRef = firebase.database().ref();
    var temporaryHolder;
    databseRef.child('users/' + key).get().then((snapshot) => {
        if (snapshot.exists()) {
            temporaryHolder = snapshot.val();
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    console.log(temporaryHolder);
    return temporaryHolder;
}
