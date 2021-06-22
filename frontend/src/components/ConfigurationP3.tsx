import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
import HubspotLogo from '../assets/HubspotLogo.png';
import SaaSquatchLogo from '../assets/SaaSquatchLogo.png';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DataGrid } from '@material-ui/data-grid';
import Checkbox from '@material-ui/core/Checkbox';


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
  align-items: center;
  justify-content: center;
`;
const AccordionContent = styled.div`
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
  height: 400px;
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
  width: 200px;
  height: 50px;
  margin: 20px;
`;

interface Config {
  hubSync: {
    createContact: boolean,
    importHistoricalContacts: boolean,
    deleteContact: boolean,
    syncRefLinks: boolean,
    importHistoricalRefLinks: boolean,
  },
  saasSync: {
    createParticipant: boolean,
    importHistoricalParticipants: boolean,
    deleteParticipant: boolean,
  }
}

interface states {
  config: Config;
  handleSubmit: ()=>void;
  handleToggles: {
    toggleHubCreate: ()=>void;
    toggleHubHistoricalImport: ()=>void;
    toggleHubDelete: ()=>void;
    toggleHubRefLinks: ()=>void;
    toggleHubHitoricalRefLinksImport: ()=>void;
    toggleSaasCreate: ()=>void;
    toggleSaasHistoricalParticipantImport: ()=>void;
    toggleSaasDelete: ()=>void;
  }
}

export function ConfigurationP3() {
  return <View {...Controller()}/>
}

export function Controller(){
  const emptyConfig: Config = {
    hubSync: {
      createContact: false,
      importHistoricalContacts: false,
      deleteContact: false,
      syncRefLinks: false,
      importHistoricalRefLinks: false,
    },
    saasSync: {
      createParticipant: false,
      importHistoricalParticipants: false,
      deleteParticipant: false,
    }
  }
  const [config, setConfig] = useState<Config>(emptyConfig)

  // Need a handler for each toggle because Switches are kinda weird
  const toggleHubCreate = () => setConfig({...config, hubSync: {...config.hubSync, createContact: !config.hubSync.createContact}});
  const toggleHubHistoricalImport = () => setConfig({...config, hubSync: {...config.hubSync, importHistoricalContacts: !config.hubSync.importHistoricalContacts}});
  const toggleHubDelete = () => setConfig({...config, hubSync: {...config.hubSync, deleteContact: !config.hubSync.deleteContact}});
  const toggleHubRefLinks = () => setConfig({...config, hubSync: {...config.hubSync, syncRefLinks: !config.hubSync.syncRefLinks}});
  const toggleHubHitoricalRefLinksImport = () => setConfig({...config, hubSync: {...config.hubSync, importHistoricalRefLinks: !config.hubSync.importHistoricalRefLinks}});
  const toggleSaasCreate = () => setConfig({...config, saasSync: {...config.saasSync, createParticipant: !config.saasSync.createParticipant}});
  const toggleSaasHistoricalParticipantImport = () => setConfig({...config, saasSync: {...config.saasSync, importHistoricalParticipants: !config.saasSync.importHistoricalParticipants}});
  const toggleSaasDelete = () => setConfig({...config, saasSync: {...config.saasSync, deleteParticipant: !config.saasSync.deleteParticipant}});

  const handleToggles = {
    toggleHubCreate,
    toggleHubHistoricalImport,
    toggleHubDelete,
    toggleHubRefLinks,
    toggleHubHitoricalRefLinksImport,
    toggleSaasCreate,
    toggleSaasHistoricalParticipantImport,
    toggleSaasDelete,
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
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TitleText>Configure your <Logo src={HubspotLogo} /> Integration</TitleText>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionContent>
            <UnpaddedAccordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ToggleSetting 
                  settingText={"Create a Contact in HubSpot when a new participant is added to SaaSquatch"} 
                  isChecked={states.config.hubSync.createContact} 
                  handleChange={states.handleToggles.toggleHubCreate} 
                />
              </AccordionSummary>
              <AccordionDetails>
                <AccordionDetailsContainer>
                  <InfoText>A contact will be created in HubSpot when a new participant is created in SaaSquatch with the selected fields</InfoText>
                  <DataGrid 
                    rows={[
                      { id: 1, fieldName: 'First name',},
                      { id: 2, fieldName: 'Last name',},
                      { id: 3, fieldName: 'email',},
                      { id: 4, fieldName: 'other stuff',},
                      ]} 
                    columns={[
                      { field: 'fieldName', headerName: 'Fields to populate', width: 200 },
                    ]} 
                    checkboxSelection
                  />
                  <ItemContainer>
                    <Checkbox checked={states.config.hubSync.importHistoricalContacts} onChange={states.handleToggles.toggleHubHistoricalImport} color={"primary"} />
                    <p>Import 420 existing participants from SaaSquatch into HubSpot with the selected fields</p>
                  </ItemContainer>
                </AccordionDetailsContainer>
              </AccordionDetails>
            </UnpaddedAccordion>
            <ToggleSetting 
              settingText={"Delete contact in HubSpot when participant is deleted in SaaSquatch"} 
              isChecked={states.config.hubSync.deleteContact} 
              handleChange={states.handleToggles.toggleHubDelete} 
            />
            <ToggleSetting 
              settingText={"Add share link to contact in HubSpot when new share link is created in SaaSquatch"} 
              isChecked={states.config.hubSync.syncRefLinks} 
              handleChange={states.handleToggles.toggleHubRefLinks} 
            />
            <ToggleSetting 
              settingText={"Import existing share links from participants in SaaSquatch to contacts in HubSpot"} 
              isChecked={states.config.hubSync.importHistoricalRefLinks} 
              handleChange={states.handleToggles.toggleHubHitoricalRefLinksImport} 
            />
          </AccordionContent>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TitleText>Configure your <Logo src={SaaSquatchLogo} /> Integration</TitleText>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionContent>
            <UnpaddedAccordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ToggleSetting 
                  settingText={"Connect contacts in HubSpot to particpants in SaaSquatch"} 
                  isChecked={states.config.saasSync.createParticipant} 
                  handleChange={states.handleToggles.toggleSaasCreate} 
                />
              </AccordionSummary>
              <AccordionDetails>
                <AccordionDetailsContainer>
                  <InfoText>A participant will be created in SaaSquatch when a new contact is created in HubSpot with the selected fields</InfoText>
                  <DataGrid 
                    rows={[
                      { id: 1, fieldName: 'Participant Field'},
                      { id: 2, fieldName: 'First name',},
                      { id: 3, fieldName: 'Last name',},
                      { id: 4, fieldName: 'email',},
                      { id: 5, fieldName: 'Referrable',},
                      { id: 6, fieldName: 'other stuff',},
                      ]} 
                    columns={[
                      { field: 'fieldName', headerName: 'Fields to populate', width: 200 },
                    ]} 
                    checkboxSelection
                  />
                  <ItemContainer>
                    <Checkbox checked={states.config.saasSync.importHistoricalParticipants} onChange={states.handleToggles.toggleSaasHistoricalParticipantImport} color={"primary"} />
                    <InfoText>Import 420 contacts from HubSpot into SaaSquatch with the selected fields</InfoText>
                  </ItemContainer>
                </AccordionDetailsContainer>
              </AccordionDetails>
            </UnpaddedAccordion>
            <ToggleSetting 
              settingText={"Delete participant in SaaSquatch when contact is deleted in HubSpot"} 
              isChecked={states.config.saasSync.deleteParticipant} 
              handleChange={states.handleToggles.toggleSaasDelete} 
            />
          </AccordionContent>
        </AccordionDetails>
      </Accordion>
        <ItemContainer>
          <SyncButton 
            onClick={states.handleSubmit}
            type= "button"
          >
            {"Save configuration"}
          </SyncButton>
        </ItemContainer>
        <InfoText>By turning on this integration, we will import 420 contacts from HubSpot into SaaSquatch and 70 participants from SaaSquatch into HubSpot</InfoText>
        <ToastContainer/>
      </PageContent>
    </PageWrapper>
   );
 }
