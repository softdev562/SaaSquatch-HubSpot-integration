import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP2';

const defaultProps = {
  config: {
    pushIntoParticipants: false,
    pullIntoParticipants: false,
  },
  handleBack: ()=>{},
  handleSubmit: ()=>{},
  handleToggles: {
    toggleSaasPush: ()=>{},
    toggleSaasPull: ()=>{},
  },
  open: false,
  handleClose: ()=>{},
  openError: false,
  handleErrorClose: ()=>{},
  imported: false,
  oneway: true,
  noway: false,
};

export default {
  title: 'Integration/ConfigurationP2',
  component: View,
} as Meta;

export const Default = () => <View {...defaultProps} />
export const TogglesSelected = () => (
  <View 
    {...defaultProps} 
    config={{
      pushIntoParticipants: true,
      pullIntoParticipants: true,
    }} 
    oneway={false}
  />
)
export const PrevousImport = () => (
  <View 
    {...defaultProps} 
    config={{
      pushIntoParticipants: true,
      pullIntoParticipants: true,
    }}
    oneway={false}
    imported={true}
  />
)
export const ImportModal = () => (
  <View 
    {...defaultProps} 
    config={{
      pushIntoParticipants: true,
      pullIntoParticipants: true,
    }}
    oneway={false}
    open={true}
  />
)
export const NowayError = () => (
  <View 
    {...defaultProps} 
    oneway={true}
    noway={true}
  />
)
export const NowayModal = () => (
  <View 
    {...defaultProps} 
    oneway={true}
    noway={true}
    openError={true}
  />
)
