import { Redirect, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { ConfigurationP1 } from './components/ConfigurationP1';
import { ConfigurationP2 } from './components/ConfigurationP2';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { ConfigurationSuccess } from './components/ConfigurationSuccess';
import { OrderConfirmation } from './components/OrderConfirmation';

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

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <div className="app-container">
                    <Route path="/configuration/1" exact component={(props: any) => <ConfigurationP1 {...props} />} />
                    <Route path="/configuration/2" exact component={(props: any) => <ConfigurationP2 {...props} />} />
                    <Route path="/confirmation" exact component={(props: any) => <OrderConfirmation {...props} />} />
                    <Route path="/configuration" exact>
                        <Redirect to="/configuration/1" />
                    </Route>
                    <Route path="/configuration/success" exact component={ConfigurationSuccess} />
                    <Route path="/login" exact component={Login} />
                    <Route path="/" exact component={Login} />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
