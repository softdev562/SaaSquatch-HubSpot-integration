import { Story, Meta } from '@storybook/react';
import { Login, LoginProps } from '../components/Login';

export default {
    title: 'Integration/Login',
    component: Login,
  } as Meta;
  
  const Template: Story<LoginProps> = (args) => <Login {...args} />;
  
  export const Regular = Template.bind({});
  Regular.args = {
    error: false,
  };
  
  export const Error = Template.bind({});
  Error.args = {
    error: true,
  };
  