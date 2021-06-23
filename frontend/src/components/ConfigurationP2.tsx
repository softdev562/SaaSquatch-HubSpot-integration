import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { ToggleSetting } from './ToggleSetting';
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
  height: 70px;
  margin-right: 10px;
`;

interface SaasConfig {
  createParticipant: boolean,
  importHistoricalParticipants: boolean,
  deleteParticipant: boolean,
}

interface states {
  config: SaasConfig;
  expandAccordion: boolean;
  handleSubmit: ()=>void;
  handleToggles: {
    toggleSaasCreate: ()=>void;
    toggleSaasHistoricalParticipantImport: ()=>void;
    toggleSaasDelete: ()=>void;
    toggleExpandAccordion: ()=>void;
  }
}

export function ConfigurationP2() {
  return <View {...Controller()}/>
}

export function Controller(){
  const emptyConfig: SaasConfig = {
    createParticipant: false,
    importHistoricalParticipants: false,
    deleteParticipant: false,
  }
  const [config, setConfig] = useState<SaasConfig>(emptyConfig)
  const [expandAccordion, setExpandAccordion] = useState<boolean>(false)

  // Need a handler for each toggle because Switches are kinda weird
  const toggleSaasCreate = () => {
    if (!expandAccordion && !config.createParticipant) {
      setExpandAccordion(true)
    }
    setConfig({...config, createParticipant: !config.createParticipant});
  }
  const toggleSaasHistoricalParticipantImport = () => setConfig({...config, importHistoricalParticipants: !config.importHistoricalParticipants});
  const toggleSaasDelete = () => setConfig({...config, deleteParticipant: !config.deleteParticipant});
  const toggleExpandAccordion = () => setExpandAccordion(!expandAccordion);

  const handleToggles = {
    toggleSaasCreate,
    toggleSaasHistoricalParticipantImport,
    toggleSaasDelete,
    toggleExpandAccordion,
  };
  
  const handleSubmit = () => {
    // Here we will make the requests to the backend to store the config info and to notify the success
    successToast()
  }

  const successToast = () => toast.success("HubSpot Integration is Connected", {
    position: toast.POSITION.BOTTOM_RIGHT
  });
  return {config, expandAccordion, handleSubmit, handleToggles} as states
}

export function View(states: states){
  return (
    <PageWrapper>
      <PageContent>
        <TitleText>Configure your <Logo src={SaaSquatchLogo} /> Integration</TitleText>
        <UnpaddedAccordion expanded={states.expandAccordion} onChange={states.handleToggles.toggleExpandAccordion} >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ToggleSetting 
              settingText={"Connect contacts in HubSpot to particpants in SaaSquatch"} 
              isChecked={states.config.createParticipant} 
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
                  { id: 4, fieldName: 'Email',},
                  { id: 5, fieldName: 'Referrable',},
                  { id: 6, fieldName: 'other stuff',},
                  ]} 
                columns={[
                  { field: 'fieldName', headerName: 'Fields to populate', width: 200 },
                ]} 
                checkboxSelection
              />
              <ItemContainer>
                <Checkbox 
                  checked={states.config.importHistoricalParticipants} 
                  onChange={states.handleToggles.toggleSaasHistoricalParticipantImport} 
                  color={"primary"} 
                />
                <InfoText>Import 420 contacts from HubSpot into SaaSquatch with the selected fields</InfoText>
              </ItemContainer>
            </AccordionDetailsContainer>
          </AccordionDetails>
        </UnpaddedAccordion>
        <ToggleSetting 
          settingText={"Delete participant in SaaSquatch when contact is deleted in HubSpot"} 
          isChecked={states.config.deleteParticipant} 
          handleChange={states.handleToggles.toggleSaasDelete} 
        />
        <ItemContainer>
          <SyncButton 
            onClick={states.handleSubmit}
            type= "button"
          >
            {"Turn on Integration"}
          </SyncButton>
          <InfoText>By turning on this integration, we will import 420 participants from SaaSquatch into HubSpot</InfoText>
        </ItemContainer>
        <ToastContainer/>
      </PageContent>
    </PageWrapper>
   );
 }
