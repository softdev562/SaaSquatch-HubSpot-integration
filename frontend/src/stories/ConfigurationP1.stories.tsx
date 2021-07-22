import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP1';

const defaultProps = {
    config: {
        saasquatchTenantAlias: '',
        pushIntoParticipants: false,
        pullIntoParticipants: false,
        pushIntoContacts: false,
        pullIntoContacts: false,
        contactsImported: false,
        participantsImported: false,
    },
    handleSubmit: () => {},
    handleToggles: {
        toggleHubPush: () => {},
        toggleHubPull: () => {},
    },
    oneway: true,
};

export default {
    title: 'Integration/ConfigurationP1',
    component: View,
} as Meta;

export const Default = () => <View {...defaultProps} />;
export const TogglesSelected = () => (
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
        }}
        oneway={false}
    />
);
export const PreviousImport = () => (
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
        }}
        oneway={false}
    />
);
export const ImportModal = () => (
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
        }}
        oneway={false}
    />
);
