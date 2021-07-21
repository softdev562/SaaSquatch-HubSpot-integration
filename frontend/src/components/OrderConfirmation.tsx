import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
import history from '../types/history';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';

import { Checkbox } from '@material-ui/core';
import { FormGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';

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
    handleClose: () => void;
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

    // Need a handler for each toggle because Switches are kinda weird
    const toggleSaasPush = () => {
        // Show oneway message if no options are selected on page
        if (config.pushIntoParticipants === false || config.pullIntoParticipants === true) {
            setOneway(false);
        } else {
            setOneway(true);
        }
        setConfig({ ...config, pushIntoParticipants: !config.pushIntoParticipants });
    }
    const toggleSaasPull = () => {
        // Show modal if import toggle is selected
        if (config.pullIntoParticipants === false) {
            setOpen(true);
        }
        // Show oneway message if no options are selected on page
        if (config.pullIntoParticipants === false || config.pushIntoParticipants === true) {
            setOneway(false);
        } else {
            setOneway(true);
        }
        setConfig({ ...config, pullIntoParticipants: !config.pullIntoParticipants });
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleErrorClose = () => {
        setOpenError(false);
    };

    const handleBack = () => {
        history.push('/configuration/1');
    }

    // On submit we make a request to the backend to store the config data and redirect to integration success screen if config selected
    const handleSubmit = () => {
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
    }
    return { config, handleBack, handleSubmit, open, handleClose, openError, handleErrorClose, imported, oneway, noway } as states
}

export function View(states: states) {
    var boolState = true
    return (
        <PageWrapper>
            <PageContent>
                <TitleText>Step 3: Confim Changes</TitleText>

                <FormControl component="fieldset">
                    <FormLabel component="legend">Current Settings:</FormLabel>
                    <FormGroup aria-label="position" row>
                        <FormControlLabel disabled
                            value="ParInS"
                            control={<Checkbox color="primary" checked={states.config.pushIntoContacts} />}
                            label="Create new Participants in SaaSquatch from Hubspot"
                            labelPlacement="end"
                        />
                        <FormControlLabel disabled
                            value="ParHist"
                            control={<Checkbox color="primary" checked={states.config.pullIntoContacts} />}
                            label="Retreive Historical Participants from Hubspot to SaaSquatch"
                            labelPlacement="end"
                        />
                        <FormControlLabel disabled
                            value="ConInH"
                            control={<Checkbox color="primary" checked={states.config.pushIntoParticipants} />}
                            label="Create new Contact in Hubspot from SaaSquatch"
                            labelPlacement="end"
                        />
                        <FormControlLabel disabled
                            value="ConHist"
                            control={<Checkbox color="primary" checked={states.config.pullIntoParticipants} />}
                            label="Retreive Historical Contacts from Hubspot to SaaSquatch"
                            labelPlacement="end"
                        />
                    </FormGroup>
                </FormControl>


                <Modal
                    open={states.open}
                    onClose={states.handleClose}
                >
                    <ModalContainer>
                        <h1>
                            Are you sure?
                        </h1>
                        <ModalBodyContainer>
                            <p>
                                By selecting Turn on Integration you will be importing all of your existing contacts in Hubspot as participants in Saasquatch.
                                This action is irreversible.
                            </p>
                        </ModalBodyContainer>
                    </ModalContainer>
                </Modal>

                <Modal
                    open={states.open}
                    onClose={states.handleClose}
                >
                    <ModalContainer>
                        <h1>
                            Are you sure?
                        </h1>
                        <ModalBody>
                            <p>
                                By selecting Next you will be importing all of your existing particpants in SaaSquatch as contacts in Hubspot.
                                This action is irreversible.
                            </p>
                        </ModalBody>
                    </ModalContainer>
                </Modal>


                <Modal
                    open={states.openError}
                    onClose={states.handleErrorClose}
                >
                    <ModalContainer>
                        <h1>
                            Configuration Error
                        </h1>
                        <ModalBodyContainer>
                            <p>
                                No configuration options have been selected. Please select a configuration to continue with the integration.
                            </p>
                        </ModalBodyContainer>
                    </ModalContainer>
                </Modal>


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
                        {!states.oneway && states.noway ? "Integration is not currently configured for Hubspot, click Turn on Integration to continue with a one-way sync" : ""}
                        {states.oneway && !states.noway ? "Integration is not currently configured for SaaSquatch, click Turn on Integration to continue with a one-way sync" : ""}
                        {states.oneway && states.noway ? "Integration is not currently configured for Hubspot or SaaSquatch, clicking Turn on Integration will not create configuration" : ""}
                    </AlertText>
                </ItemContainer>
            </PageContent>
        </PageWrapper>
    );
}
