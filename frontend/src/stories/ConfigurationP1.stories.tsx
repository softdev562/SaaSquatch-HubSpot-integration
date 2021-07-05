import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP1';

const defaultProps = {
  config: {
    createContact: false,
    importHistoricalContacts: false,
    deleteContact: false,
    syncRefLinks: false,
    importHistoricalRefLinks: false,
  },
  expandAccordion: false,
  handleSubmit: ()=>{},
  handleToggles: {
    toggleHubCreate: ()=>{},
    toggleHubHistoricalImport: ()=>{},
    toggleHubDelete: ()=>{},
    toggleHubRefLinks: ()=>{},
    toggleHubHitoricalRefLinksImport: ()=>{},
    toggleExpandAccordion: ()=>{},
  }
};

export default {
  title: 'Integration/ConfigurationP1',
  component: View,
} as Meta;

export const Default = () => <View {...defaultProps} />
export const AccordionExtended = () => <View {...defaultProps} expandAccordion={true} />
export const TogglesSelected = () => (
  <View 
    {...defaultProps} 
    expandAccordion={true}
    config={{
      createContact: true,
      importHistoricalContacts: true,
      deleteContact: true,
      syncRefLinks: true,
      importHistoricalRefLinks: true,
    }} 
  />
)
