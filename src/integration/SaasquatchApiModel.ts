import axios, { Method } from "axios";
import { getSaasquatchToken } from "../routes/oath";

/**
 * SaaSquatch model for interacting with the SaaSquatch's API
 */

interface HeaderObject {
	[key: string]: any
}

export class SaasquatchApiModel {
    private SaasquatchToken: string = '';

	/**
	 * Saasquatch API request wrapper. Makes a request to saasquatch API with the parameters provided and the API token. Automatically tries to retrieve a new API token when expired.
	 * 
	 * @param req_method Method of the request.
	 * @param req_url URL of the API.
	 * @param req_parameters Parameters object for the request.
	 * @param req_headers Header object for the request.
	 * @param req_body Body of the request.
	 * @param tries Number of tries to get send request. Max 5.
	 * 
	 * @return Expected data from request.
	 */
	public saasquatchApiRequest = async (req_method: Method, req_url: string, req_header: HeaderObject, req_params = undefined, req_body = undefined, tries = 5) => {
		req_header.Authorization = `Bearer ${this.SaasquatchToken}`;
		try {
			const resp: any = await axios.request({
				method: req_method,
				url: req_url,
				headers: req_header,
				params: req_params,
				data: req_body
			});
			return resp;
		} catch (e) {
			// API token expired.
			if (e.status === 401) {
				try {
					this.SaasquatchToken = await getSaasquatchToken();
					// prevent infinite loops of invalid tokens, etc.
					if (tries === undefined || tries > 5) {
						tries = 5;
					} else if (tries <= 0) {
						throw new Error("Unable to retrieve saasquatch API token. Max tries exceeded.");
					}
					const resp: any = await this.saasquatchApiRequest(req_method, req_url, req_header, req_params, req_body, tries - 1);
					return resp;
				} catch (e) {
					throw new Error(e);
				}
			} else {
				throw new Error("Unable to complete request to Saasquatch.\n Error: {e}");
			}
		}
	};

    /**
     * Get users from SaaSquatch that match paramToFilterBy
     * Currently gets all users or zero users as filter is not working
     * 
     * @param paramToFilterBy list of query parameters to filter by. eg. 'email:example@example.com'?
     */
    public async getUsers(tenantAlias: string, paramToFilterBy?: string){
        const headers = {accept: 'application/json'};
        const url = `https://staging.referralsaasquatch.com/api/v1/${encodeURIComponent(tenantAlias)}/users`;
        let qs = '';
        if (paramToFilterBy){
            qs = paramToFilterBy;
        }
        try {
			const params = {
				query: qs,
				limit: 10,
				offset: 0
			}
			const resp = await this.saasquatchApiRequest('GET', url, headers);
			return resp.data;
        } catch (e) {
			throw new Error(e)
		}
	}

	public async createParticipant(tenantAlias: string, email:string, createParticipantBody: object){
		try {
			//URL should be built using express URL class
			const createParticipantURL = 'https://staging.referralsaasquatch.com/api/v1/' + tenantAlias + '/open/account/' + email + '/user/' + email;
			const resp = await this.saasquatchApiRequest('post', createParticipantURL, {});
			return resp.data;
		} catch (e) {
			throw new Error(`Was not able to create contact.\n Error: {e}`);
		}
	}
}