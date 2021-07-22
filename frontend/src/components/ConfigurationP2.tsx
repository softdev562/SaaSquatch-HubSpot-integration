import { useState } from 'react';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
import SaaSquatchLogo from '../assets/SaaSquatchLogo.png';
import history from '../types/history';
import { usePenpal } from '@saasquatch/integration-boilerplate-react';
import jwt_decode from 'jwt-decode';
import { Config } from './ConfigurationP1';

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
const AlertText = styled.p`
    color: #fc3308;
    font-size: 16px;
    display: flex;
    margin: 0px;
    margin-left: 10px;
    width: 450px;
`;
const Logo = styled.img`
    height: 60px;
    vertical-align: bottom;
`;
const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
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
    width: 140px;
    height: 70px;
    margin-right: 10px;
`;
const BackButton = styled.button`
    &:hover {
        background-color: #888888;
    }
    font-size: 22px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 2em;
    cursor: pointer;
    color: white;
    background-color: #808080;
    width: 120px;
    height: 70px;
    margin-right: 10px;
`;

const API_CONFIGURATION_URL = '/api/configuration';

interface states {
    config: Config;
    handleBack: () => void;
    handleSubmit: () => void;
    handleToggles: {
        toggleSaasPush: () => void;
        toggleSaasPull: () => void;
    };
    oneway: boolean;
    noway: boolean;
}

export function ConfigurationP2(props: any) {
    const { state } = props.location;
    return <View {...Controller(state)} />;
}

export function Controller(state: Config) {
    const penpal = usePenpal();
    // sub is the attribute of the tenant alias from the tenant token
    const tenantAliasUnparsed: { sub: string } = jwt_decode(penpal.tenantScopedToken);
    // the alias is sent of the form exampleAlias@tenants
    const tenantAliasParsed: string = tenantAliasUnparsed.sub.split('@')[0];

    let currConfig: Config = {
        saasquatchTenantAlias: tenantAliasParsed,
        pushIntoContacts: (state && state.pushIntoContacts) || false,
        pullIntoContacts: (state && state.pullIntoContacts) || false,
        pushIntoParticipants: (state && state.pushIntoParticipants) || false,
        pullIntoParticipants: (state && state.pullIntoParticipants) || false,
        contactsImported: (state && state.contactsImported) || false,
        participantsImported: (state && state.participantsImported) || false,
    };
    const [config, setConfig] = useState<Config>(currConfig);
    const [oneway, setOneway] = useState(true);
    const noway = false;

    // Need a handler for each toggle because Switches are kinda weird
    // We have to do the comparisons before inverting the data, because state assignment takes a while and awaiting them didn't fix it
    const toggleSaasPush = () => {
        // Show oneway message if no options are selected on page
        if (config.pushIntoParticipants === false || config.pullIntoParticipants === true) {
            setOneway(false);
        } else {
            setOneway(true);
        }
        setConfig({ ...config, pushIntoParticipants: !config.pushIntoParticipants });
    };
    const toggleSaasPull = () => {
        // Show oneway message if no options are selected on page
        if (config.pullIntoParticipants === false || config.pushIntoParticipants === true) {
            setOneway(false);
        } else {
            setOneway(true);
        }
        setConfig({ ...config, pullIntoParticipants: !config.pullIntoParticipants });
    };

    const handleToggles = {
        toggleSaasPush,
        toggleSaasPull,
    };

    const handleBack = () => {
        history.push({
            pathname: '/configuration/1',
            state: {
                pushIntoContacts: config.pushIntoContacts,
                pullIntoContacts: config.pullIntoContacts,
                pushIntoParticipants: config.pushIntoParticipants,
                pullIntoParticipants: config.pullIntoParticipants,
                contactsImported: config.contactsImported,
                participantsImported: config.participantsImported,
            },
        });
    };

    // On submit we make a request to the backend to store the config data and redirect to integration success screen if config selected
    const handleSubmit = () => {
        const putConfigData = async () => {
            console.log('show me the money', config);
            return await fetch(API_CONFIGURATION_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    SaaSquatchTenantAlias: config.saasquatchTenantAlias,
                    PushPartixipantsAsContacts: config.pushIntoContacts,
                    PullParticipantsIntoContacts: config.pullIntoContacts,
                    PushContactsAsParticipants: config.pushIntoParticipants,
                    PullContactsIntoParticipants: config.pullIntoParticipants,
                }),
            });
        };
        putConfigData()
            .then()
            .catch((e) => console.error(e));
        // Show configuration error modal if no config options selected or redirect to success screen
        history.push({
            pathname: '/configuration/confirmation',
            state: {
                pushIntoContacts: config.pushIntoContacts,
                pullIntoContacts: config.pullIntoContacts,
                pushIntoParticipants: config.pushIntoParticipants,
                pullIntoParticipants: config.pullIntoParticipants,
            },
        });
        history.push('/configuration/success');
    };
    return { config, handleBack, handleSubmit, handleToggles, oneway, noway } as states;
}

export function View(states: states) {
    return (
        <PageWrapper>
            <PageContent>
                <TitleText>
                    Step 2: Configure your <Logo src={SaaSquatchLogo} /> Integration
                </TitleText>
                <ToggleSetting
                    settingText={'Create new Participants'}
                    isChecked={states.config.pushIntoParticipants}
                    handleChange={states.handleToggles.toggleSaasPush}
                />
                <InfoText>
                    {
                        'When a new contact is created in your Hubspot account, a matching participant with the same First Name, Last Name, Email, and a new generated Sharelink will be created in your connected SaaSquatch account.'
                    }
                </InfoText>
                <ToggleSetting
                    settingText={'Import existing Contacts as Participants'}
                    isChecked={states.config.pullIntoParticipants}
                    handleChange={states.handleToggles.toggleSaasPull}
                    disabled={states.config.participantsImported}
                />
                <InfoText>
                    {
                        'All existing contacts in your Hubspot account will be imported as matching participants with the same First Name, Last Name, Email, and a new generated Sharelink in your connected SaaSquatch account.'
                    }
                </InfoText>
                <ItemContainer>
                    <BackButton onClick={states.handleBack} type="button">
                        {'Back to Step 1'}
                    </BackButton>
                    <SyncButton onClick={states.handleSubmit} type="button">
                        {'Turn on Integration'}
                    </SyncButton>
                    <AlertText>
                        {!states.oneway && states.noway
                            ? 'Integration is not currently configured for Hubspot, click Turn on Integration to continue with a one-way sync'
                            : ''}
                        {states.oneway && !states.noway
                            ? 'Integration is not currently configured for SaaSquatch, click Turn on Integration to continue with a one-way sync'
                            : ''}
                        {states.oneway && states.noway
                            ? 'Integration is not currently configured for Hubspot or SaaSquatch, clicking Turn on Integration will not create configuration'
                            : ''}
                    </AlertText>
                </ItemContainer>
            </PageContent>
        </PageWrapper>
    );
}
