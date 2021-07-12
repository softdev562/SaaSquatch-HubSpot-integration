import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
import HubspotLogo from '../assets/HubspotLogo.png';
import history from '../types/history';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
import { usePenpal } from '@saasquatch/integration-boilerplate-react';

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
const InfoText = styled.p`
  color: #000000;
  font-size: 16px;
  display: flex;
  margin-left: 60px;
  width: 680px;
`;
const AlertText = styled.p`
  color: #FC3308;
  font-size: 16px;
  display: flex;
  margin: 0px;
  margin-left: 10px;
  width: 520px;
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
  width: 160px;
  height: 50px;
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
const ModalBody = styled.div`
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  font-size: 14px;
`;

const API_CONFIGURATION_URL = '/api/configuration'

interface HubConfig {
  saasquatchTenantAlias: string,
  pushIntoContacts: boolean,
  pullIntoContacts: boolean,
}

interface states {
  config: HubConfig;
  handleSubmit: ()=>void;
  handleToggles: {
    toggleHubPush: ()=>void;
    toggleHubPull: ()=>void;
  }
  open: boolean;
  handleClose: ()=>void;
  imported: boolean;
  oneway: boolean;
}

export function ConfigurationP1() {
  return <View {...Controller()}/>
}

export function Controller(){
  const penpal = usePenpal()
  const emptyConfig: HubConfig = {
    saasquatchTenantAlias: penpal.tenantScopedToken,
    pushIntoContacts: false,
    pullIntoContacts: false,
  }
  const [config, setConfig] = useState<HubConfig>(emptyConfig)
  const [open, setOpen] = useState(false);
  const [imported, setImported] = useState(false);
  const [oneway, setOneway] = useState(true);

  const postConfigData = async () => {
      return await fetch(API_CONFIGURATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        PushPartixipantsAsContacts: false,
        PullParticipantsIntoContacts: false,
      })
    })
  }

  // Gets config data on page load
  useEffect(() => {
    const getConfigData = () => {
      axios.get(API_CONFIGURATION_URL,
        { params: {token: document.cookie, SaaSquatchTenantAlias: config.saasquatchTenantAlias} }
      )
      .then((response) => {
        // A blank config object is returned if the user doesn't exist yet in the database
        if (
          response.data.PushPartixipantsAsContacts === false && 
          response.data.PullParticipantsIntoContacts === false && 
          response.data.DeleteContactwhenParticipantDeleted === false &&
          response.data.PushContactsAsParticipants === false &&
          response.data.PullContactsIntoParticipants === false &&
          response.data.DeleteParticipantWhenContactDeleted === false &&
          response.data.accessToken === "" && 
          response.data.refreshToken === "") {
            // Post request to create new user entry in configuration database
            postConfigData().then().catch( e => console.error(e) )
        } else {
          // Display config data for user from database
          setConfig(config => ({...config, pushIntoContacts: response.data.PushPartixipantsAsContacts, pullIntoContacts: response.data.PullParticipantsIntoContacts}));
          // Disable import toggle if previously imported
          if (response.data.PullParticipantsIntoContacts){
            setImported(true);
          }
          // Don't show oneway message if an option is previously selected on page
          if (response.data.PushPartixipantsAsContacts || response.data.PullParticipantsIntoContacts){
            setOneway(false);
          }
        }
      })
      .catch(error => {
        history.push('/login');
        console.error('Error: Unable to retrieve Configuration Data');
      })
    };
    getConfigData();
  },[]);

  // Need a handler for each toggle because Switches are kinda weird
  const toggleHubPush = () => {
    // Show oneway message if no options are selected on page
    if (config.pushIntoContacts === false || config.pullIntoContacts === true){
      setOneway(false);
    } else {
      setOneway(true);
    }
    setConfig({...config, pushIntoContacts: !config.pushIntoContacts});
  }
  const toggleHubPull = () => {
    // Show modal if import toggle is selected
    if (config.pullIntoContacts === false){
      setOpen(true);
    }
    // Show oneway message if no options are selected on page
    if (config.pullIntoContacts === false || config.pushIntoContacts === true){
      setOneway(false);
    } else {
      setOneway(true);
    }
    setConfig({...config, pullIntoContacts: !config.pullIntoContacts});
  }

  const handleToggles = {
    toggleHubPush,
    toggleHubPull,
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  // On submit we make a request to the backend to store the config data and redirect to second config screen
  const handleSubmit = () => {
    const putConfigData = async () => {
        return await fetch(API_CONFIGURATION_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          SaaSquatchTenantAlias: config.saasquatchTenantAlias,
          PushPartixipantsAsContacts: config.pushIntoContacts,
          PullParticipantsIntoContacts: config.pullIntoContacts,
        })
      })
    }
    putConfigData().then().catch( e => console.error(e) )
    history.push('/configuration/2');
  }
  return {config, handleSubmit, handleToggles, open, handleClose, imported, oneway} as states
}

export function View(states: states){
  return (
    <PageWrapper>
      <PageContent>
        <TitleText>Step 1: Configure your <Logo src={HubspotLogo}/> Integration</TitleText>
          <ToggleSetting 
            settingText={"Create new Contacts"} 
            isChecked={states.config.pushIntoContacts} 
            handleChange={states.handleToggles.toggleHubPush} 
          />
          <InfoText>
            {"When a new participant is created in your SaaSquatch account, a matching contact with the same Name, Email, Sharelink, and Referrals will be created in your connected Hubspot account."}
          </InfoText>
          <ToggleSetting 
            settingText={"Import existing Participants as Contacts"} 
            isChecked={states.config.pullIntoContacts} 
            handleChange={states.handleToggles.toggleHubPull} 
            disabled={states.imported}
          />
          <InfoText>
            {"All existing participants in your SaaSquatch account will be imported as matching contacts with the same Name, Email, Sharelink, and Referrals in your connected Hubspot account."}
          </InfoText>
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
          <ItemContainer>
            <SyncButton 
              onClick={states.handleSubmit}
              type= "button"
            >
              {"Next"}
            </SyncButton>
            <AlertText>
              {states.oneway ? "Integration is not currently configured for Hubspot, click Next to continue with a one-way sync" : ""}
            </AlertText>
          </ItemContainer>
      </PageContent>
    </PageWrapper>
   );
 }
