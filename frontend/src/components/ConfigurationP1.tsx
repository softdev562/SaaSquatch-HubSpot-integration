import { useState } from 'react';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
import HubspotLogo from '../assets/HubspotLogo.png';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DataGrid } from '@material-ui/data-grid';
import Checkbox from '@material-ui/core/Checkbox';
import history from '../types/history';

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
const AccordionDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 500px;
  width: '100%';
`;
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const UnpaddedAccordion = styled(Accordion)`
  .MuiAccordionSummary-root {
    padding-left: 0;
  }
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

interface HubConfig {
  createContact: boolean,
  importHistoricalContacts: boolean,
  deleteContact: boolean,
  syncRefLinks: boolean,
  importHistoricalRefLinks: boolean,
}

interface states {
  config: HubConfig;
  expandAccordion: boolean;
  handleSubmit: ()=>void;
  handleToggles: {
    toggleHubCreate: ()=>void;
    toggleHubHistoricalImport: ()=>void;
    toggleHubDelete: ()=>void;
    toggleHubRefLinks: ()=>void;
    toggleHubHitoricalRefLinksImport: ()=>void;
    toggleExpandAccordion: ()=>void;
  }
}

export function ConfigurationP1() {
  return <View {...Controller()}/>
}

export function Controller(){
  const emptyConfig: HubConfig = {
    createContact: false,
    importHistoricalContacts: false,
    deleteContact: false,
    syncRefLinks: false,
    importHistoricalRefLinks: false,
  }
  const [config, setConfig] = useState<HubConfig>(emptyConfig)
  const [expandAccordion, setExpandAccordion] = useState<boolean>(false)

  // Need a handler for each toggle because Switches are kinda weird
  const toggleHubCreate = () => {
    if (!expandAccordion && !config.createContact) {
      setExpandAccordion(true)
    }
    setConfig({...config, createContact: !config.createContact});
  }
  const toggleHubHistoricalImport = () => setConfig({...config, importHistoricalContacts: !config.importHistoricalContacts});
  const toggleHubDelete = () => setConfig({...config, deleteContact: !config.deleteContact});
  const toggleHubRefLinks = () => setConfig({...config, syncRefLinks: !config.syncRefLinks});
  const toggleHubHitoricalRefLinksImport = () => setConfig({...config, importHistoricalRefLinks: !config.importHistoricalRefLinks});
  const toggleExpandAccordion = () => setExpandAccordion(!expandAccordion);

  const handleToggles = {
    toggleHubCreate,
    toggleHubHistoricalImport,
    toggleHubDelete,
    toggleHubRefLinks,
    toggleHubHitoricalRefLinksImport,
    toggleExpandAccordion,
  };
  
  const handleSubmit = () => {
    // Here we will make the requests to the backend to store the config info and to begin the integration and redirect to second config screen
    history.push('/configuration/2');
  }
  return {config, expandAccordion, handleSubmit, handleToggles} as states
}

export function View(states: states){
  return (
    <PageWrapper>
      <PageContent>
        <TitleText>Configure your <Logo src={HubspotLogo} /> Integration</TitleText>
        <UnpaddedAccordion expanded={states.expandAccordion} onChange={states.handleToggles.toggleExpandAccordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ToggleSetting 
              settingText={"Create a Contact in HubSpot when a new user is added to SaaSquatch"} 
              isChecked={states.config.createContact} 
              handleChange={states.handleToggles.toggleHubCreate} 
            />
          </AccordionSummary>
          <AccordionDetails>
            <AccordionDetailsContainer>
              <InfoText>A contact will be created in Hubspot when a new participant is created in SaaSquatch with the selected fields</InfoText>
              <DataGrid 
                rows={[
                  { id: 1, fieldName: 'First name',},
                  { id: 2, fieldName: 'Last name',},
                  { id: 3, fieldName: 'Email',},
                  { id: 4, fieldName: 'other stuff',},
                  ]} 
                columns={[
                  { field: 'fieldName', headerName: 'Fields to populate', width: 200 },
                ]} 
                checkboxSelection
              />
              <ItemContainer>
                <Checkbox checked={states.config.importHistoricalContacts} onChange={states.handleToggles.toggleHubHistoricalImport} color={"primary"} />
                <InfoText>Import 420 existing participants from SaaSquatch into HubSpot with the selected fields</InfoText>
              </ItemContainer>
            </AccordionDetailsContainer>
          </AccordionDetails>
        </UnpaddedAccordion>
        <ToggleSetting 
          settingText={"Delete contact in HubSpot when participant is deleted in SaaSquatch"} 
          isChecked={states.config.deleteContact} 
          handleChange={states.handleToggles.toggleHubDelete} 
        />
        <ToggleSetting 
          settingText={"Add share link to contact in HubSpot when new share link is created for particpant in SaaSquatch"} 
          isChecked={states.config.syncRefLinks} 
          handleChange={states.handleToggles.toggleHubRefLinks} 
        />
        <ToggleSetting 
          settingText={"Import existing share links from participants in SaaSquatch to contacts in HubSpot"} 
          isChecked={states.config.importHistoricalRefLinks} 
          handleChange={states.handleToggles.toggleHubHitoricalRefLinksImport} 
        />
        <ItemContainer>
          <SyncButton 
            onClick={states.handleSubmit}
            type= "button"
          >
            {"Next"}
          </SyncButton>
          <InfoText>By turning on this integration, we will import 420 contacts from HubSpot into SaaSquatch</InfoText>
        </ItemContainer>
      </PageContent>
    </PageWrapper>
   );
 }
