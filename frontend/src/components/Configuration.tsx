import { Switch } from '@material-ui/core';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const Wrapper = styled.div`
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
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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

export function Configuration() {
  return <View/>
}

export function View(){
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
  const notify = () => toast.success("HubSpot Integration is Connected", {
    position: toast.POSITION.BOTTOM_RIGHT
  });

  return (
    <Wrapper>
      <PageContent>
      <TitleText>Configure your HubSpot Integration</TitleText>
      <ItemContainer>
        <Switch checked={config.hubSync.isActive} onChange={() => setConfig({...config, hubSync: {...config.hubSync, isActive: !config.hubSync.isActive}})} />
        <InfoText>Sync with HubSpot</InfoText>
      </ItemContainer>
      <ItemContainer>
        <Switch checked={config.hubSync.createContact} onChange={() => setConfig({...config, hubSync: {...config.hubSync, createContact: !config.hubSync.createContact}})} />
        <InfoText>Create a Contact in HubSpot when a new user is added to SaaSquatch</InfoText>
      </ItemContainer>
      <ItemContainer>
        <Switch checked={config.hubSync.updateContact} onChange={() => setConfig({...config, hubSync: {...config.hubSync, updateContact: !config.hubSync.updateContact}})} />
        <InfoText>Update existing Contacts in HubSpot when Users are updated in SaaSquatch</InfoText>
      </ItemContainer>
      <ItemContainer>
        <Switch checked={config.hubSync.syncRefLinks} onChange={() => setConfig({...config, hubSync: {...config.hubSync, syncRefLinks: !config.hubSync.syncRefLinks}})} />
        <InfoText>Sync SaaSquatch referral links into HubSpot</InfoText>
      </ItemContainer>
      <ItemContainer>
        <Switch checked={config.saasSync.isActive} onChange={() => setConfig({...config, saasSync: {...config.saasSync, isActive: !config.saasSync.isActive}})} />
        <InfoText>Sync with SaaSquatch</InfoText>
      </ItemContainer>
      <ItemContainer>
        <Switch checked={config.saasSync.createUser} onChange={() => setConfig({...config, saasSync: {...config.saasSync, createUser: !config.saasSync.createUser}})} />
        <InfoText>Create a new User in SaaSquatch when a Contact is added to HubSpot</InfoText>
      </ItemContainer>
      <ItemContainer>
        <Switch checked={config.saasSync.updateUser} onChange={() => setConfig({...config, saasSync: {...config.saasSync, updateUser: !config.saasSync.updateUser}})} />
        <InfoText>Update existing Users in SaaSquatch when Contacts are updated in HubSpot</InfoText>
      </ItemContainer>
      <ItemContainer>
        <SyncButton 
          onClick={notify}
          type= "button"
        >
          {"Turn on Sync"}
        </SyncButton>
        <InfoText>By turning on this integration, we will import 420 contacts from HubSpot into SaaSquatch</InfoText>
      </ItemContainer>
      <ToastContainer/>
      </PageContent>
    </Wrapper>
   );
 }
