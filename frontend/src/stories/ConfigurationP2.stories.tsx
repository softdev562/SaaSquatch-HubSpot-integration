import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP2';
import { createTheme, ThemeProvider } from '@material-ui/core';

const theme = createTheme({
    palette: {
        primary: {
            main: '#255fcc',
        },
        secondary: {
            main: '#5BC236',
        },
    },
});

const defaultProps = {
  config: {
    saasquatchTenantAlias: '',
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
  parameters: {
    cucumber: {
      data: 'SyncParticipantsWithHubSpot.feature',
    },
  },
} as Meta;


const render = (component: any) => {
    return <ThemeProvider theme={theme}>{component}</ThemeProvider>;
};

export const Default = () => render(<View {...defaultProps} />);
export const TogglesSelected = () =>
    render(
        <View
            {...defaultProps}
            config={{
                saasquatchTenantAlias: '',
                pushIntoContacts: false,
                pullIntoContacts: false,
                pushIntoParticipants: true,
                pullIntoParticipants: true,
                contactsImported: false,
                participantsImported: false,
                newUser: false,
            }}
        />,
    );
export const PreviousImport = () =>
    render(
        <View
            {...defaultProps}
            config={{
                saasquatchTenantAlias: '',
                pushIntoContacts: false,
                pullIntoContacts: false,
                pushIntoParticipants: true,
                pullIntoParticipants: true,
                contactsImported: false,
                participantsImported: true,
                newUser: false,
            }}
        />,
    );
