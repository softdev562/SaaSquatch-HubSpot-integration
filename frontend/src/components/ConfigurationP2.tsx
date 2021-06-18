import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import SaaSquatchLogo from '../assets/SaaSquatchLogo.png';

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

export function ConfigurationP2() {
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
      <TitleText>Configure your <Logo src={SaaSquatchLogo} /> Integration</TitleText>
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
