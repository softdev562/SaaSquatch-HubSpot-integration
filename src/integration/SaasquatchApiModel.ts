import axios, { Method } from "axios";
import { getSaasquatchToken } from "../routes/oath";
var { graphql, buildSchema } = require('graphql');

/**
 * SaaSquatch model for interacting with the SaaSquatch's API
 */

interface HeaderObject {
	[key: string]: any
}

export class SaasquatchApiModel {
    private SaasquatchToken: string = '';

	/**
	 * Saasquatch GraphQL API request wrapper.
	 * 
	 * @param tenantAlias
	 * @param query GraphQL query to be executed. 
	 * @return Expected data from request.
	 */
	public saasquatchGraphqlRequest = async (tenantAlias: string, query: string) => {
        const url = `https://staging.referralsaasquatch.com/api/v1/${tenantAlias}/graphql`;
		let header = {
			Authorization: `Bearer ${this.SaasquatchToken}`,
			'Content-Type': 'application/json',
			'Content-Length': query.length,
		}
		let tries = 2; // Only two tries to get request right.
		while (tries > 0) {
			try {
				let resp: any = await axios.post(url, query, {
					headers: header
				});
				// API token expired.
				if (resp.data.errors != undefined) {
					const tokenObject = await getSaasquatchToken();
					this.SaasquatchToken = tokenObject.access_token;
					header.Authorization = `Bearer ${this.SaasquatchToken}`;
					tries -= 1;
					continue;
				}
				return resp;
			} catch (e) {
				throw new Error(`Unable to complete request to Saasquatch. ${e}`);
			}
		}
		throw new Error(`Unable to complete request to Saasquatch. Max tries exceeded.`);
	};

	/**
	 * Saasquatch REST API request wrapper.
	 * 
	 * @param tenantAlias
	 * @param query GraphQL query to be executed. 
	 * @return Expected data from request.
	 */
	 public saasquatchApiRequest = async (tenantAlias: string, method: Method, url: string, body: any) => {
		let header = {
			Authorization: `Bearer ${this.SaasquatchToken}`,
			'Content-Type': 'application/json',
		}
		let tries = 2; // Only two tries to get request right.
		while (tries > 0) {
			try {
				const resp: any = await axios.request({
					method: method,
					url: url,
					headers: header,
					data: body
				});
				// API token expired.
				if (resp.data.errors != undefined) {
					const tokenObject = await getSaasquatchToken();
					this.SaasquatchToken = tokenObject.access_token;
					header.Authorization = `Bearer ${this.SaasquatchToken}`;
					tries -= 1;
					continue;
				}
				return resp;
			} catch (e) {
				throw new Error(`Unable to complete request to Saasquatch. ${e}`);
			}
		}
		throw new Error(`Unable to complete request to Saasquatch. Max tries exceeded.`);
	};

    /**
     * Get users from SaaSquatch
     */
    public async getUsers(tenantAlias: string){
		const query = `{
			users {
				data {
					...
				}
			}
		}`
        try {
			const resp = await this.saasquatchGraphqlRequest(tenantAlias, query);
			return resp.data;
        } catch (e) {
			throw new Error(e)
		}
	}

	/**
     * Get users from SaaSquatch that match the email provided
     * 
	 * @param tenantAlias tenant alias...
     * @param email email of participant.
	 * @return users with email.
     */
	 public async getUserByEmail(tenantAlias: string, email: string){
		// TODO: Edit query to return needed data of user.
		const body = JSON.stringify({
			query: `{ 
				users(
					filter: { 
						email_eq: "${email}" 
					}) { 
						count, 
				} 
			}`
		});
		try {
			const resp = await this.saasquatchGraphqlRequest(tenantAlias, body);
			return resp.data.data.users;
        } catch (e) {
			throw new Error(e)
		}
	}

	public async createParticipant(tenantAlias: string, participantBody: any){
		try {
			//URL should be built using express URL class
			const url = `https://staging.referralsaasquatch.com/api/v1/${tenantAlias}/open/account/${participantBody.email}/user/${participantBody.email}`;
			const resp = await this.saasquatchApiRequest(tenantAlias, 'post', url, participantBody);
			return resp.data;
		} catch (e) {
			throw new Error(`Was not able to create contact. ${e}`);
		}
	}
}