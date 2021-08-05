import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP1';
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
  parameters: {
    cucumber: {
      data: 'SyncContactsWithSaaSquatch.feature',
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
                pushIntoParticipants: false,
                pullIntoParticipants: false,
                pushIntoContacts: true,
                pullIntoContacts: true,
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
                pushIntoParticipants: false,
                pullIntoParticipants: false,
                pushIntoContacts: true,
                pullIntoContacts: true,
                contactsImported: true,
                participantsImported: true,
                newUser: false,
            }}
        />,
    );

