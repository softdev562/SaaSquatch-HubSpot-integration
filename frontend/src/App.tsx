import { Route } from 'react-router-dom';
import {Login} from './components/Login';
import {Configuration} from './components/Configuration';

function App() {
  return (
    <div className="App">
        <div className="app-container">
          <Route
            path="/configuration"
            exact component={Configuration}
          />
          <Route path="/login" exact component={Login} />
          <Route path="/" exact component={Login} />
        </div>
      </div>
  );
}

export default App;
