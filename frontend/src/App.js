import React from 'react';
import logo from './logo.svg';
import { Switch, Route } from 'react-router-dom'

import Navbar from './Navbar/Navbar';
import Profiles from './Profiles/Profiles';
import VideoCall from './VideoCall/VideoCall';

import './App.css';

const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey) || ''
  );
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);
  return [value, setValue];
};

function App() {
  /* Manage the account Id stored in the local session.
   This allows the account Id to be retrieved and be set.
   If no Id has been set it will be undefined. */
  const [accountId, setAccountId] = useStateWithLocalStorage(
    'accountId'
  );

  /* On entry set accountId to 0 */
  // setAccountId(0)

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path='/' component={Profiles} />
        <Route path='/videocall' component={VideoCall} />
        <Route path='/test2/:number' component={Profiles} />
      </Switch>

    </div>
  );
}

export default App;
