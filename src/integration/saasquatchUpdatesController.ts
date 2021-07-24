import { SaasquatchPayload } from '../Types/types';
import { HubspotApiModel } from './HubspotApiModel';
import { SaasquatchApiModel } from './SaasquatchApiModel';

export class saasquatchUpdatesController {
    private hubApiModel: HubspotApiModel;
    private saasApiModel: SaasquatchApiModel;

    constructor() {
        this.saasApiModel = new SaasquatchApiModel();
        this.hubApiModel = new HubspotApiModel();
    }

    /**
     * Received webhook of event type 'user.created'
     * @param saasquatchPayload Payload of SaaSquatch webhook
     */
    public async NewUser(saasquatchPayload: any) {
        console.log('Received SaaSquatch user.created.');
        // console.log(saasquatchPayload);

        const saasquatchPayloadData = saasquatchPayload.data;
        const contactsSearchBody = {
            filterGroups: [
                {
                    filters: [
                        {
                            value: saasquatchPayloadData.email,
                            propertyName: 'email',
                            operator: 'EQ',
                        },
                    ],
                },
            ],
            limit: 1,
        };
        const contactsSearchResponse = await this.hubApiModel.searchObject('contacts', contactsSearchBody, 20465599);
        if (contactsSearchResponse?.data.total == 0) {
            const programShareLinks: { [key: string]: any } = {};
            for (const key in saasquatchPayloadData.programShareLinks) {
                const newProgramShareLinkName = key.replace(/\W/g, '') + 'saasquatch_program';
                const newProgramShareLinkLabel = key.replace(/\W/g, '') + ' Saasquatch Program';
                try {
                    if (!(await this.hubApiModel.objectHasProperty('contacts', newProgramShareLinkName, 20465599))) {
                        try {
                            await this.hubApiModel.createObjectProperty(
                                'contacts',
                                newProgramShareLinkName,
                                newProgramShareLinkLabel,
                                'string',
                                'textarea',
                                'contactinformation',
                                20465599,
                            );
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    programShareLinks[newProgramShareLinkName] =
                        saasquatchPayloadData.programShareLinks[key].cleanShareLink;
                } catch (e) {
                    console.log(e);
                }
            }

            const basicContactInfo = {
                email: saasquatchPayloadData.email,
                firstname: saasquatchPayloadData.firstName,
                lastname: saasquatchPayloadData.lastName,
            };

            const basicInfoAndProgramShareLinks = Object.assign(basicContactInfo, programShareLinks);
            const createContactBody = {
                properties: basicInfoAndProgramShareLinks,
            };
            try {
                await this.hubApiModel.createObject('contacts', createContactBody, 20465599);
            } catch (e) {
                console.log(e);
            }
        }
    }

    /**
     * Received webhook of event type 'test'. No processing required as this is a test webhook.
     *
     * @param saasquatchPayload Payload of SaaSquatch webhook
     */
    public Test(saasquatchPayload: SaasquatchPayload): void {
        console.info('Received SaaSquatch test webhook:' + saasquatchPayload);
    }
}
