import { Redirect, Route } from 'react-router-dom';
import {Login} from './components/Login';
import {ConfigurationP1} from './components/ConfigurationP1';
import {ConfigurationP2} from './components/ConfigurationP2';
import { ConfigurationP3 } from './components/ConfigurationP3';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

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
          <Route
            path="/configuration/3"
            exact component={ConfigurationP3}
          />
          <Route path="/configuration" exact >
            <Redirect to="/configuration/1"/>
          </Route>
          <Route path="/login" exact component={Login} />
          <Route path="/" exact component={Login} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
