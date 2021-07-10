import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP1';

const defaultProps = {
  config: {
    pushIntoContacts: false,
    pullIntoContacts: false,
  },
  handleSubmit: ()=>{},
  handleToggles: {
    toggleHubPush: ()=>{},
    toggleHubPull: ()=>{},
  },
  open: false,
  handleClose: ()=>{},
  imported: false,
  oneway: true,
};

export default {
  title: 'Integration/ConfigurationP1',
  component: View,
} as Meta;

export const Default = () => <View {...defaultProps} />
export const TogglesSelected = () => (
  <View 
    {...defaultProps} 
    config={{
      pushIntoContacts: true,
      pullIntoContacts: true,
    }} 
    oneway={false}
  />
)
export const PrevousImport = () => (
  <View 
    {...defaultProps} 
    config={{
      pushIntoContacts: true,
      pullIntoContacts: true,
    }}
    oneway={false}
    imported={true}
  />
)
export const ImportModal = () => (
  <View 
    {...defaultProps} 
    config={{
      pushIntoContacts: true,
      pullIntoContacts: true,
    }}
    oneway={false}
    open={true}
  />
)
