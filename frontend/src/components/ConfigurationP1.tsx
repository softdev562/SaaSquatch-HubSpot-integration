import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
import HubspotLogo from '../assets/HubspotLogo.png';
import history from '../types/history';
import axios from 'axios';
import { usePenpal } from '@saasquatch/integration-boilerplate-react';
import jwt_decode from 'jwt-decode';

/**
 * Renders the first configuration screen (available at /configuration/1).
 * Handles the config settings to import contacts into HubSpot from SaaSquatch
 */

const PageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-family: Roboto, sans-serif;
`;
const PageContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
`;
const TitleText = styled.h1`
    color: #33475b;
    text-align: center;
    margin: 0px;
    font-size: 48px;
    font-weight: bold;
    display: block;
    padding: 20px;
`;
const InfoText = styled.p`
    color: #000000;
    font-size: 16px;
    display: flex;
    margin-left: 60px;
    width: 680px;
`;
const Logo = styled.img`
    height: 60px;
    vertical-align: bottom;
`;
const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;
const SyncButton = styled.button`
    &:hover {
        background-color: #ff8661;
    }
    font-size: 22px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 2em;
    cursor: pointer;
    color: white;
    background-color: #ff7a59;
    width: 160px;
    height: 50px;
    margin-right: 10px;
`;

const API_CONFIGURATION_URL = '/api/configuration';

export interface HubConfig {
    saasquatchTenantAlias: string;
    pushIntoContacts: boolean;
    pullIntoContacts: boolean;
}

export interface Config {
    saasquatchTenantAlias: string;
    pushIntoContacts: boolean;
    pullIntoContacts: boolean;
    pushIntoParticipants: boolean;
    pullIntoParticipants: boolean;
    contactsImported: boolean;
    participantsImported: boolean;
}

interface states {
    config: Config;
    handleSubmit: () => void;
    handleToggles: {
        toggleHubPush: () => void;
        toggleHubPull: () => void;
    };
}

export function ConfigurationP1(props: any) {
    const { state } = props.location;
    return <View {...Controller(state)} />;
}

export function Controller(state: Config) {
    const penpal = usePenpal();
    // sub is the attribute of the tenant alias from the tenant token
    const tenantAliasUnparsed: { sub: string } = jwt_decode(penpal.tenantScopedToken);
    // the alias is sent of the form exampleAlias@tenants
    const tenantAliasParsed: string = tenantAliasUnparsed.sub.split('@')[0];

    const currConfig: Config = {
        saasquatchTenantAlias: tenantAliasParsed,
        pushIntoContacts: (state && state.pushIntoContacts) || false,
        pullIntoContacts: (state && state.pullIntoContacts) || false,
        pushIntoParticipants: (state && state.pushIntoParticipants) || false,
        pullIntoParticipants: (state && state.pullIntoParticipants) || false,
        contactsImported: (state && state.contactsImported) || false,
        participantsImported: (state && state.participantsImported) || false,
    };
    const [config, setConfig] = useState<Config>(currConfig);

    // Gets config data on page load
    useEffect(() => {
        const postConfigData = async () => {
            return await fetch(API_CONFIGURATION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    SaasquatchTenantAlias: config.saasquatchTenantAlias,
                    PushPartixipantsAsContacts: false,
                    PullParticipantsIntoContacts: false,
                    PushContactsAsParticipants: false,
                    PullContactsIntoParticipants: false,
                }),
            });
        };
        const getConfigData = () => {
            axios
                .get(API_CONFIGURATION_URL, { params: { SaaSquatchTenantAlias: config.saasquatchTenantAlias } })
                .then((response) => {
                    // A blank config object is returned if the user doesn't exist yet in the database
                    if (
                        response.data.PushPartixipantsAsContacts === false &&
                        response.data.PullParticipantsIntoContacts === false &&
                        response.data.DeleteContactwhenParticipantDeleted === false &&
                        response.data.PushContactsAsParticipants === false &&
                        response.data.PullContactsIntoParticipants === false &&
                        response.data.DeleteParticipantWhenContactDeleted === false &&
                        response.data.accessToken === '' &&
                        response.data.refreshToken === ''
                    ) {
                        // Post request to create new user entry in configuration database
                        postConfigData()
                            .then()
                            .catch((e) => console.error(e));
                    } else {
                        // Display config data for user from database
                        setConfig((config) => ({
                            ...config,
                            pushIntoContacts: response.data.PushPartixipantsAsContacts || false,
                            pullIntoContacts: response.data.PullParticipantsIntoContacts || false,
                            pushIntoParticipants: response.data.PushContactsAsParticipants || false,
                            pullIntoParticipants: response.data.PullContactsIntoParticipants || false,
                            contactsImported: response.data.PullParticipantsIntoContacts || false,
                            participantsImported: response.data.PullContactsIntoParticipants || false,
                        }));
                    }
                })
                .catch((error) => {
                    history.push('/login');
                    console.error('Error: Unable to retrieve Configuration Data');
                });
        };
        // If we don't already know the configuration, get it from the db
        if (!state) {
            getConfigData();
        }
    }, [config.saasquatchTenantAlias, state]);

    // Need a handler for each toggle because Switches are kinda weird
    const toggleHubPush = () => {
        setConfig({ ...config, pushIntoContacts: !config.pushIntoContacts });
    };
    const toggleHubPull = () => {
        setConfig({ ...config, pullIntoContacts: !config.pullIntoContacts });
    };

    const handleToggles = {
        toggleHubPush,
        toggleHubPull,
    };

    // On submit we make a request to the backend to store the config data and redirect to second config screen
    const handleSubmit = () => {
        history.push({
            pathname: '/configuration/2',
            state: {
                saasquatchTenantAlias: config.saasquatchTenantAlias,
                pushIntoContacts: config.pushIntoContacts,
                pullIntoContacts: config.pullIntoContacts,
                pushIntoParticipants: config.pushIntoParticipants,
                pullIntoParticipants: config.pullIntoParticipants,
                contactsImported: config.contactsImported,
                participantsImported: config.participantsImported,
            },
        });
    };
    return { config, handleSubmit, handleToggles } as states;
}

export function View(states: states) {
    return (
        <PageWrapper>
            <PageContent>
                <TitleText>
                    Step 1: Configure your <Logo src={HubspotLogo} /> Integration
                </TitleText>
                <ToggleSetting
                    settingText={'Create new Contacts'}
                    isChecked={states.config.pushIntoContacts}
                    handleChange={states.handleToggles.toggleHubPush}
                />
                <InfoText>
                    {
                        'When a new participant is created in your SaaSquatch account, a matching contact with the same Name, Email, Sharelink, and Referrals will be created in your connected Hubspot account.'
                    }
                </InfoText>
                <ToggleSetting
                    settingText={'Import existing Participants as Contacts'}
                    isChecked={states.config.pullIntoContacts}
                    handleChange={states.handleToggles.toggleHubPull}
                    disabled={states.config.contactsImported}
                />
                <InfoText>
                    {
                        'All existing participants in your SaaSquatch account will be imported as matching contacts with the same Name, Email, Sharelink, and Referrals in your connected Hubspot account.'
                    }
                </InfoText>
                <ItemContainer>
                    <SyncButton onClick={states.handleSubmit} type="button">
                        {'Next'}
                    </SyncButton>
                </ItemContainer>
            </PageContent>
        </PageWrapper>
    );
}
