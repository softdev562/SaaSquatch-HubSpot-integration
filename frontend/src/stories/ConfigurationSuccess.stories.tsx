import { Meta } from '@storybook/react';
import { View } from '../components/ConfigurationSuccess';

const defaultProps = {
  handleRedirectP1: ()=>{},
  handleRedirectP2:()=>{},
};

export default {
  title: 'Integration/ConfigurationSuccess',
  component: View,
} as Meta;

export const Default = () => <View {...defaultProps} />
