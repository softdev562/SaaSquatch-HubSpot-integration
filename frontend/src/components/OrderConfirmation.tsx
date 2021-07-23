import { useState, useEffect } from 'react';
import styled from 'styled-components';
import history from '../types/history';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';

import { Checkbox } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const PageWrapper = styled.div`
  min-height: 100vh;
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
  color: #33475B;
  text-align: center;
  margin: 0px;
  font-size: 48px;
  font-weight: bold;
  display: block;
  padding: 20px;
`;
const AlertText = styled.p`
  color: #FC3308;
  font-size: 16px;
  display: flex;
  margin: 0px;
  margin-left: 10px;
  width: 450px;
`;
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
`;
const SyncButton = styled.button`
  &:hover {
    background-color: #FF8661
  }
  font-size: 22px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 2em;
  cursor: pointer;
  color: white;
  background-color: #FF7A59;
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
const ModalContainer = styled.div`
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  margin-left: auto;
  margin-right: auto;
  font-size: 18px;
  padding: 10px;
  width: 500px;
`;
const ModalBodyContainer = styled.div`
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  font-size: 14px;
`;

const API_CONFIGURATION_URL = '/api/configuration'

interface ConfigList {
    pushIntoParticipants: boolean,
    pullIntoParticipants: boolean,
    pushIntoContacts: boolean,
    pullIntoContacts: boolean,
}

interface states {
    config: ConfigList;
    handleBack: () => void;
    handleSubmit: () => void;
    open: boolean;
    handleConfirm: () => void;
    handleCancel: () => void;
    openError: boolean;
    handleErrorClose: () => void;
    imported: boolean;
    oneway: boolean;
    noway: boolean;
}

export function OrderConfirmation() {
    return <View {...Controller()} />
}

export function Controller() {
    const emptyConfig: ConfigList = {
        pushIntoParticipants: false,
        pullIntoParticipants: false,
        pushIntoContacts: false,
        pullIntoContacts: false,
    }
    const [config, setConfig] = useState<ConfigList>(emptyConfig)
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [imported, setImported] = useState(false);
    const [oneway, setOneway] = useState(true);
    const [noway, setNoway] = useState(false);

    // Gets config data on page load
    useEffect(() => {
        const getConfigData = () => {
            axios.get(API_CONFIGURATION_URL)
                .then((response) => {
                    setConfig(config => ({ ...config, pushIntoParticipants: response.data.PushContactsAsParticipants, pullIntoParticipants: response.data.PullContactsIntoParticipants }));
                    // Disable import toggle if previously imported
                    if (response.data.PullContactsIntoParticipants) {
                        setImported(true);
                    }
                    // Show noway message if no options previously selected on previous configuration page
                    if (!response.data.PushPartixipantsAsContacts && !response.data.PullParticipantsIntoContacts) {
                        setNoway(true);
                    }
                    // Don't show oneway message if an option is previously selected on page
                    if (response.data.PushContactsAsParticipants || response.data.PullContactsIntoParticipants) {
                        setOneway(false);
                    }
                })
                .catch(error => console.error('Error: Unable to retrieve Configuration Data'))
        };
        getConfigData();
    }, []);


    const handleErrorClose = () => {
        setOpenError(false);
    };

    const handleBack = () => {
        history.push('/configuration/2');
    }


    const handleConfirm = () => {
        setOpen(false);
        if(!(config.pullIntoParticipants || config.pullIntoContacts || config.pushIntoParticipants || config.pushIntoContacts)){
            return
        }

        const putConfigData = async () => {
            return await fetch(API_CONFIGURATION_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    PushContactsAsParticipants: config.pushIntoParticipants,
                    PullContactsIntoParticipants: config.pullIntoParticipants,
                })
            })
        }
        putConfigData().then().catch(e => console.error(e))
        // Show configuration error modal if no config options selected or redirect to success screen
        if (oneway && noway) {
            setOpenError(true);
        } else {
            history.push('/configuration/success');
        }
    };
    const handleCancel = () => {
        setOpen(false);
    };


    // On submit we make a request to the backend to store the config data and redirect to integration success screen if config selected
    const handleSubmit = () => {
        if (config.pullIntoParticipants || config.pullIntoContacts) {
            setOpen(true);
        }
        else if (!(config.pullIntoParticipants || config.pullIntoContacts || config.pushIntoParticipants || config.pushIntoContacts)) {
            setOpen(true);//Need a seperate dialog to say that you just strait up can't do that
        }
        else {
            const putConfigData = async () => {//This is just for submitting with no problems, but will need to change
                return await fetch(API_CONFIGURATION_URL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        PushContactsAsParticipants: config.pushIntoParticipants,
                        PullContactsIntoParticipants: config.pullIntoParticipants,
                    })
                })
            }
            putConfigData().then().catch(e => console.error(e))
            // Show configuration error modal if no config options selected or redirect to success screen
            if (oneway && noway) {
                setOpenError(true);
            } else {
                history.push('/configuration/success');
            }
        }
    }
    return { config, handleBack, handleSubmit, open, handleConfirm, handleCancel, openError, handleErrorClose, imported, oneway, noway } as states
}

export function View(states: states) {
    return (
        <PageWrapper>
            <PageContent>
                <TitleText>Step 3: Confim Configuration</TitleText>

                <FormControl component="fieldset">
                    <FormLabel component="legend">Current Settings:</FormLabel>
                    <FormGroup aria-label="position">
                        <FormControlLabel disabled
                            value="ParInS"
                            control={<Checkbox color="primary" checked={states.config.pushIntoParticipants} />}
                            label="Create new Participants"
                            labelPlacement="end"
                        />
                        <FormControlLabel disabled
                            value="ParHist"
                            control={<Checkbox color="primary" checked={states.config.pullIntoParticipants} />}
                            label="Import existing Contacts as Participants"
                            labelPlacement="end"
                        />
                        <FormControlLabel disabled
                            value="ConInH"
                            control={<Checkbox color="primary" checked={states.config.pushIntoContacts} />}
                            label="Create new Contacts"
                            labelPlacement="end"
                        />
                        <FormControlLabel disabled
                            value="ConHist"
                            control={<Checkbox color="primary" checked={states.config.pullIntoContacts} />}
                            label="Import existing Participants as Contacts"
                            labelPlacement="end"
                        />
                    </FormGroup>
                </FormControl>


                <Dialog
                    open={states.open}
                    onClose={states.handleCancel}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Configuration Confirmation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {states.config.pullIntoParticipants ? "By selecting Turn on Integration you will be importing all of your existing contacts in Hubspot as participants in Saasquatch. This action is irreversible.\n" : ""}
                            {states.config.pullIntoContacts ? "By selecting Next you will be importing all of your existing particpants in SaaSquatch as contacts in Hubspot.This action is irreversible." : ""}
                            {!(states.config.pullIntoContacts || states.config.pullIntoParticipants || states.config.pushIntoContacts || states.config.pushIntoParticipants) ? "No configuration options have been selected. Please select a configuration to continue with the integration." : ""}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={states.handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={states.handleConfirm} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

                <ItemContainer>
                    <BackButton
                        onClick={states.handleBack}
                        type="button"
                    >
                        {"Back"}
                    </BackButton>
                    <SyncButton
                        onClick={states.handleSubmit}
                        type="button"
                    >
                        {"Turn on Integration"}
                    </SyncButton>
                    <AlertText>
                        {!(states.config.pullIntoContacts || states.config.pushIntoContacts || states.config.pullIntoParticipants || states.config.pushIntoParticipants) ? "Integration is not currently configured for Hubspot or SaaSquatch, clicking Turn on Integration will not create configuration" : ""}
                        {(states.config.pullIntoContacts || states.config.pushIntoContacts) && !(states.config.pullIntoParticipants || states.config.pushIntoParticipants) ? "Integration is not currently configured for Hubspot, click Turn on Integration to continue with a one-way sync" : ""}
                        {!(states.config.pullIntoContacts || states.config.pushIntoContacts) && (states.config.pullIntoParticipants || states.config.pushIntoParticipants) ? "Integration is not currently configured for SaaSquatch, click Turn on Integration to continue with a one-way sync" : ""}
                    </AlertText>
                </ItemContainer>
            </PageContent>
        </PageWrapper>
    );
}
