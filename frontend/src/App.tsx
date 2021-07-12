import { Redirect, Route } from 'react-router-dom';
import {Login} from './components/Login';
import {ConfigurationP1} from './components/ConfigurationP1';
import {ConfigurationP2} from './components/ConfigurationP2';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { ConfigurationSuccess } from './components/ConfigurationSuccess';
import { usePenpal } from '@saasquatch/integration-boilerplate-react';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#255fcc',
    },
    secondary: {
      main: '#5BC236',
    },
  },
});

function App() {
  const penpal = usePenpal()

  console.log('mode', penpal.mode)
  console.log('tenantScopedToken', penpal.tenantScopedToken)
  console.log('integrationConfig', penpal.integrationConfig)
  console.log('formConfig', penpal.formConfig)

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="app-container">
          <Route
            path="/configuration/1"
            exact component={ConfigurationP1}
          />
          <Route
            path="/configuration/2"
            exact component={ConfigurationP2}
          />
          <Route path="/configuration" exact >
            <Redirect to="/configuration/1"/>
          </Route>
          <Route 
            path="/configuration/success" 
            exact component={ConfigurationSuccess}
          />
          <Route path="/login" exact component={Login} />
          <Route path="/" exact component={Login} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
