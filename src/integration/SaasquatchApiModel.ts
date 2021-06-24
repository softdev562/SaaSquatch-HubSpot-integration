import axios from "axios";
import querystring from 'querystring';

export class SaasquatchApiModel {

    
    // Temp access until DB has OAuth access tokens
    private SAPIKEY: string;
    private TENANTALIAS: string;

    constructor(apiKey: string, tenantAlias: string){
        this.SAPIKEY = apiKey;
        this.TENANTALIAS = tenantAlias;
    }

    /**
     * Get users from SaaSquatch that match paramToFilterBy
     * Currently gets all users or zero users as filter is not working
     * 
     * @param paramToFilterBy list of query parameters to filter by. eg. 'email:example@example.com'?
     */
    public async getUsers(paramToFilterBy?: string){
        const headers = { accept: 'application/json' };
        const url = `https://staging.referralsaasquatch.com/api/v1/${encodeURIComponent(this.TENANTALIAS)}/users`;
        let qs = '';
        if (paramToFilterBy){
            qs = paramToFilterBy;
        }
        try {
            const resp = await axios.get( url, { 
                params: { 
                    query: qs,
                    limit: 10,
                    offset: 0
                }, 
                headers: headers,
                auth: {
                    username: '',
                    password: this.SAPIKEY
                }
             } );
            if (resp.status != 200) {
                throw Error("Error getting a contact from SaaSquatch." + resp.data["error"]);
            }
            else{
                console.log(resp);
                return resp.data;
            }
        } catch(e){
            console.error(e);
        }
        }

        public async createParticipant(email:string, createParticipantBody:object){
            try{
                //URL should be built using express URL class
                const createParticipantURL = 'https://staging.referralsaasquatch.com/api/v1/' +this.TENANTALIAS+ '/open/account/' + email + '/user/' + email;
                const response = await axios.post(createParticipantURL, createParticipantBody,{
                    headers: {
                      'Authorization':'token '+this.SAPIKEY
                  }
                  });
                return response;
            } catch (e) {
                console.error("Was not able to create contact");
                console.log(e);
            }
        }


   

}