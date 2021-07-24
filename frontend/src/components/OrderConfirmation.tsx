import { useState } from 'react';
import styled from 'styled-components';
import history from '../types/history';

import { Checkbox } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
const AlertText = styled.p`
    color: #fc3308;
    font-size: 16px;
    display: flex;
    margin: 0px;
    margin-left: 10px;
    margin-bottom: 10px;
    width: 450px;
`;
const ItemContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
`;
const FormControlContainer = styled.div`
    padding-left: 20px;
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

interface ConfigList {
    pushIntoParticipants: boolean;
    pullIntoParticipants: boolean;
    pushIntoContacts: boolean;
    pullIntoContacts: boolean;
}

interface states {
    config: ConfigList;
    handleBack: () => void;
    handleSubmit: () => void;
    open: boolean;
    handleConfirm: () => void;
    handleCancel: () => void;
}

export function OrderConfirmation(props: any) {
    const { state } = props.location;
    return <View {...Controller(state)} />;
}

export function Controller(state: Config) {
    const config: Config = {
        saasquatchTenantAlias: state && state.saasquatchTenantAlias ? state.saasquatchTenantAlias : '',
        pushIntoContacts: (state && state.pushIntoContacts) || false,
        pullIntoContacts: (state && state.pullIntoContacts) || false,
        pushIntoParticipants: (state && state.pushIntoParticipants) || false,
        pullIntoParticipants: (state && state.pullIntoParticipants) || false,
        contactsImported: (state && state.contactsImported) || false,
        participantsImported: (state && state.participantsImported) || false,
    };
    const [open, setOpen] = useState(false);

    const handleBack = () => {
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

    const putConfigData = async () => {
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

    const handleConfirm = () => {
        setOpen(false);
        if (
            !(
                config.pullIntoParticipants ||
                config.pullIntoContacts ||
                config.pushIntoParticipants ||
                config.pushIntoContacts
            )
        ) {
            return;
        }
        putConfigData()
            .then()
            .catch((e) => console.error(e));
        history.push('/configuration/success');
    };
    const handleCancel = () => {
        setOpen(false);
    };

    // On submit we make a request to the backend to store the config data and redirect to integration success screen if config selected
    const handleSubmit = () => {
        if (
            (config.pullIntoParticipants && !config.participantsImported) ||
            (config.pullIntoContacts && !config.contactsImported)
        ) {
            setOpen(true);
        } else if (
            !(
                config.pullIntoParticipants ||
                config.pullIntoContacts ||
                config.pushIntoParticipants ||
                config.pushIntoContacts
            )
        ) {
            setOpen(true); //Need a seperate dialog to say that you just strait up can't do that
        } else {
            putConfigData()
                .then()
                .catch((e) => console.error(e));
            history.push('/configuration/success');
        }
    };
    return { config, handleBack, handleSubmit, open, handleConfirm, handleCancel } as states;
}

export function View(states: states) {
    return (
        <PageWrapper>
            <PageContent>
                <TitleText>Step 3: Confirm Configuration</TitleText>
                <FormControlContainer>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Current Settings:</FormLabel>
                        <FormGroup aria-label="position">
                            <FormControlLabel
                                disabled
                                value="ParInS"
                                control={<Checkbox color="primary" checked={states.config.pushIntoParticipants} />}
                                label="Create new Participants"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                disabled
                                value="ParHist"
                                control={<Checkbox color="primary" checked={states.config.pullIntoParticipants} />}
                                label="Import existing Contacts as Participants"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                disabled
                                value="ConInH"
                                control={<Checkbox color="primary" checked={states.config.pushIntoContacts} />}
                                label="Create new Contacts"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                disabled
                                value="ConHist"
                                control={<Checkbox color="primary" checked={states.config.pullIntoContacts} />}
                                label="Import existing Participants as Contacts"
                                labelPlacement="end"
                            />
                        </FormGroup>
                    </FormControl>
                </FormControlContainer>
                <Dialog
                    open={states.open}
                    onClose={states.handleCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{'Configuration Confirmation'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {states.config.pullIntoParticipants ? (
                                <AlertText>
                                    By confirming, you will be importing all of your existing contacts in Hubspot as
                                    participants in Saasquatch. This action is irreversible.
                                </AlertText>
                            ) : (
                                ''
                            )}
                            {states.config.pullIntoContacts ? (
                                <AlertText>
                                    By confirming, you will be importing all of your existing particpants in SaaSquatch
                                    as contacts in Hubspot.This action is irreversible.
                                </AlertText>
                            ) : (
                                ''
                            )}
                            {!(
                                states.config.pullIntoContacts ||
                                states.config.pullIntoParticipants ||
                                states.config.pushIntoContacts ||
                                states.config.pushIntoParticipants
                            ) ? (
                                <AlertText>
                                    No configuration options have been selected. Please select a configuration to
                                    continue with the integration.
                                </AlertText>
                            ) : (
                                ''
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={states.handleCancel} color="primary">
                            Cancel
                        </Button>
                        {(states.config.pullIntoContacts ||
                            states.config.pullIntoParticipants ||
                            states.config.pushIntoContacts ||
                            states.config.pushIntoParticipants) && (
                            <Button onClick={states.handleConfirm} color="primary" autoFocus>
                                Confirm
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>

                <ItemContainer>
                    <BackButton onClick={states.handleBack} type="button">
                        {'Back'}
                    </BackButton>
                    <SyncButton onClick={states.handleSubmit} type="button">
                        {'Turn on Integration'}
                    </SyncButton>
                    <AlertText>
                        {!(
                            states.config.pullIntoContacts ||
                            states.config.pushIntoContacts ||
                            states.config.pullIntoParticipants ||
                            states.config.pushIntoParticipants
                        )
                            ? 'Integration is not currently configured for Hubspot or SaaSquatch, clicking Turn on Integration will not create configuration'
                            : ''}
                        {(states.config.pullIntoContacts || states.config.pushIntoContacts) &&
                        !(states.config.pullIntoParticipants || states.config.pushIntoParticipants)
                            ? 'Integration is not currently configured for Hubspot, click Turn on Integration to continue with a one-way sync'
                            : ''}
                        {!(states.config.pullIntoContacts || states.config.pushIntoContacts) &&
                        (states.config.pullIntoParticipants || states.config.pushIntoParticipants)
                            ? 'Integration is not currently configured for SaaSquatch, click Turn on Integration to continue with a one-way sync'
                            : ''}
                    </AlertText>
                </ItemContainer>
            </PageContent>
        </PageWrapper>
    );
}
