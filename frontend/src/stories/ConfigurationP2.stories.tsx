import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationP2';

const defaultProps = {
    config: {
        saasquatchTenantAlias: '',
        pushIntoContacts: false,
        pullIntoContacts: false,
        pushIntoParticipants: false,
        pullIntoParticipants: false,
        contactsImported: false,
        participantsImported: false,
    },
    handleBack: () => {},
    handleSubmit: () => {},
    handleToggles: {
        toggleSaasPush: () => {},
        toggleSaasPull: () => {},
    },
    oneway: true,
    noway: false,
};

export default {
    title: 'Integration/ConfigurationP2',
    component: View,
} as Meta;

export const Default = () => <View {...defaultProps} />;
export const TogglesSelected = () => (
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
        }}
        oneway={false}
    />
);
export const PreviousImport = () => (
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
        }}
        oneway={false}
    />
);
export const ImportModal = () => (
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
        }}
        oneway={false}
    />
);
export const NowayError = () => <View {...defaultProps} oneway={true} noway={true} />;
export const NowayModal = () => <View {...defaultProps} oneway={true} noway={true} />;
