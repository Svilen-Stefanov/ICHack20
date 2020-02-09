import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import { Switch, Route } from 'react-router-dom'

import Navbar from './Navbar/Navbar';
import Login from './Login/Login';
import Profiles from './Profiles/Profiles';
import Canvas from './Canvas/Canvas';
import VideoCall from './VideoCall/VideoCall';
import KnowledgeGraph from './KnowledgeGraph/KnowledgeGraph';

import { useStateWithLocalStorage } from './utils'

import './App.css';

axios.defaults.baseURL = "http://127.0.0.1:5000"

function App() {
  /* Manage the account Id stored in the local session.
   This allows the account Id to be retrieved and be set.
   If no Id has been set it will be undefined. */
  const [accountId, setAccountId] = useStateWithLocalStorage(
    'accountId'
  );

  /* TODO: Currently Account ID is hardcoded to 0 */
  useEffect(() => {
    setAccountId(0)

    /* Ensure global axios configuration will inject the accountId as a header */
    axios.defaults.headers.common = {
      'Account-Id': accountId
    };
  }, [accountId]);

  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path='/' component={Profiles} />
        <Route path='/videocall' component={VideoCall} />
        <Route path='/test2/:number' component={Profiles} />
        <Route path='/login' component={Login} />
        <Route path='/canvas' component={Canvas} />
        <Route path='/graph' component={KnowledgeGraph} />
      </Switch>

    </div>
  );
}

export default App;
