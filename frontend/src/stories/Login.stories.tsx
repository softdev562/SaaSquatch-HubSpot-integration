import { Meta } from '@storybook/react';
import { View } from '../components/Login';

const props = { showError: false, accountError: false, cookieError: false, OAuth: () => console.log('Sign in') };
const OpenPopup = () => {
    const h = 800;
    const w = 500;
    // Center popup window on screen
    const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
    const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
    window.open('http://example.com', 'OAuth Popup', `width=${w}, height=${h}, top=${y}, left=${x}`);
};

export default {
    title: 'Integration/Login',
    component: View,
} as Meta;

export const Default = () => <View {...props} />;
export const Error = () => <View {...props} showError={true} />;
export const AccountError = () => <View {...props} accountError={true} />;
export const CookieError = () => <View {...props} cookieError={true} />;
export const ClickForPopup = () => <View {...props} OAuth={OpenPopup} />;
