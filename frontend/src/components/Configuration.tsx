import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
import HubspotLogo from '../assets/HubspotLogo.png';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
`;
const ChildrenContainer = styled.div`
  margin-left: 3em;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
`;
const TitleText = styled.h1`
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #33475B;
  text-align: left;
  margin: 0px;
  font-size: 48px;
  font-weight: bold;
  display: flex;
`;
const Logo = styled.img`
  height: 60px;
`;
const InfoText = styled.p`
  color: #000000;
  font-size: 20px;
  display: flex;
  margin-right: 5px;
`;
const PaddedSelect = styled.select`
  margin-right: 5px;
  margin-left: 5px;
`;
const SyncButton = styled.button`
  &:hover {
    background-color: #FF8661
  }
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  border: 0;
  border-radius: 1em;
  cursor: pointer;
  color: white;
  background-color: #FF7A59;
  display: inherit;
  font-size: 22px;
  width: 120px;
  height: 60px;
  margin-right: 10px;
`;

interface Config {
  hubSync: {
    isActive: boolean,
    createContact: boolean,
    updateContact: boolean,
    syncRefLinks: boolean,
  },
  saasSync: {
    isActive: boolean,
    createUser: boolean,
    updateUser: boolean,
  }
}

interface states {
  config: Config;
  handleSubmit: ()=>void;
  handleToggles: {
    toggleHubSync: ()=>void;
    toggleHubCreate: ()=>void;
    toggleHubUpdate: ()=>void;
    toggleHubRefLinks: ()=>void;
    toggleSaasSync: ()=>void;
    toggleSaasCreate: ()=>void;
    toggleSaasUpdate: ()=>void;
  }
}

export function Configuration() {
  return <View {...Controller()}/>
}

export function Controller(){
  const emptyConfig: Config = {
    hubSync: {
      isActive: false,
      createContact: false,
      updateContact: false,
      syncRefLinks: false,
    },
    saasSync: {
      isActive: false,
      createUser: false,
      updateUser: false,
    }
  }
  const [config, setConfig] = useState<Config>(emptyConfig)

  // Need a handler for each toggle because Switches are kinda weird
  const toggleHubSync = () => setConfig({...config, hubSync: {...config.hubSync, isActive: !config.hubSync.isActive}});
  const toggleHubCreate = () => setConfig({...config, hubSync: {...config.hubSync, createContact: !config.hubSync.createContact}});
  const toggleHubUpdate = () => setConfig({...config, hubSync: {...config.hubSync, updateContact: !config.hubSync.updateContact}});
  const toggleHubRefLinks = () => setConfig({...config, hubSync: {...config.hubSync, syncRefLinks: !config.hubSync.syncRefLinks}});
  const toggleSaasSync = () => setConfig({...config, saasSync: {...config.saasSync, isActive: !config.saasSync.isActive}});
  const toggleSaasCreate = () => setConfig({...config, saasSync: {...config.saasSync, createUser: !config.saasSync.createUser}});
  const toggleSaasUpdate = () => setConfig({...config, saasSync: {...config.saasSync, updateUser: !config.saasSync.updateUser}});

  const handleToggles = {
    toggleHubSync,
    toggleHubCreate,
    toggleHubUpdate,
    toggleHubRefLinks,
    toggleSaasSync,
    toggleSaasCreate,
    toggleSaasUpdate,
  };
  
  const handleSubmit = () => {
    // Here we will make the requests to the backend to store the config info and to begin the integration
    successToast()
  }

  const successToast = () => toast.success("HubSpot Integration is Connected", {
    position: toast.POSITION.BOTTOM_RIGHT
  });
  return {config, handleSubmit, handleToggles} as states
}

export function View(states: states){
  return (
    <PageWrapper>
      <PageContent>
      <TitleText>Configure your <Logo src={HubspotLogo} /> Integration</TitleText>
      <ToggleSetting 
        settingText={"Sync contacts in HubSpot to users in SaaSquatch"} 
        isChecked={states.config.hubSync.isActive} 
        handleChange={states.handleToggles.toggleHubSync} 
      />
      <ChildrenContainer>
        <InfoText>
          Connect
          <PaddedSelect>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </PaddedSelect>
          from SaaSquatch to
          <PaddedSelect>
            <option value="name">Name</option>
            <option value="email">Email</option>
          </PaddedSelect>
          in HubSpot
        </InfoText>
        <ToggleSetting 
          settingText={"Create a Contact in HubSpot when a new user is added to SaaSquatch"} 
          isChecked={states.config.hubSync.createContact} 
          handleChange={states.handleToggles.toggleHubCreate}
          disabled={!states.config.hubSync.isActive}
        />
        <ToggleSetting 
          settingText={"Update existing Contacts in HubSpot when Users are updated in SaaSquatch"} 
          isChecked={states.config.hubSync.updateContact} 
          handleChange={states.handleToggles.toggleHubUpdate}
          disabled={!states.config.hubSync.isActive}
        />
        <ToggleSetting 
          settingText={"Sync SaaSquatch referral links into HubSpot"} 
          isChecked={states.config.hubSync.syncRefLinks} 
          handleChange={states.handleToggles.toggleHubRefLinks}
          disabled={!states.config.hubSync.isActive}
        />
      </ChildrenContainer>
      <ToggleSetting 
        settingText={"Sync users in SaaSquatch with contacts in Hubspot"} 
        isChecked={states.config.saasSync.isActive} 
        handleChange={states.handleToggles.toggleSaasSync}
      />
      <ChildrenContainer>
        <ToggleSetting 
          settingText={"Create a new User in SaaSquatch when a Contact is added to HubSpot"} 
          isChecked={states.config.saasSync.createUser} 
          handleChange={states.handleToggles.toggleSaasCreate}
          disabled={!states.config.saasSync.isActive}
        />
        <ToggleSetting 
          settingText={"Update existing Users in SaaSquatch when Contacts are updated in HubSpot"} 
          isChecked={states.config.saasSync.updateUser} 
          handleChange={states.handleToggles.toggleSaasUpdate}
          disabled={!states.config.saasSync.isActive}
        />
      </ChildrenContainer>
        <SyncButton 
          onClick={states.handleSubmit}
          type= "button"
        >
          {"Turn on Sync"}
        </SyncButton>
        <InfoText>By turning on this integration, we will import 420 contacts from HubSpot into SaaSquatch</InfoText>
      <ToastContainer/>
      </PageContent>
    </PageWrapper>
   );
 }