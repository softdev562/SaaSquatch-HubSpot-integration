import { Meta } from '@storybook/react';
import { View } from '../components/Login';

const props = {showError: false, OAuth: ()=>console.log("Sign in")};

export default {
  title: 'Integration/Login',
  component: View,
} as Meta;

export const Default = ()=> <View {...props} />
export const Error = ()=> <View {...props} showError={true} />
  