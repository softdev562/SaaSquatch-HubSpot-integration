import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP2';

const defaultProps = {
  config: {
    createParticipant: false,
    importHistoricalParticipants: false,
    deleteParticipant: false,
  },
  expandAccordion: false,
  handleSubmit: ()=>{},
  handleToggles: {
    toggleSaasCreate: ()=>{},
    toggleSaasHistoricalParticipantImport: ()=>{},
    toggleSaasDelete: ()=>{},
    toggleExpandAccordion: ()=>{},
  }
};

export default {
  title: 'Integration/ConfigurationP2',
  component: View,
} as Meta;

export const Default = () => <View {...defaultProps} />
export const AccordionExtended = () => <View {...defaultProps} expandAccordion={true} />
export const TogglesSelected = () => (
  <View 
    {...defaultProps} 
    expandAccordion={true}
    config={{
      createParticipant: true,
      importHistoricalParticipants: true,
      deleteParticipant: true,
    }} 
  />
)
