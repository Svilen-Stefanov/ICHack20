import React from 'react';
import logo from './logo.svg';
import { Switch, Route } from 'react-router-dom'

import Navbar from './Navbar/Navbar';
import Profiles from './Profiles/Profiles';

import './App.css';



function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path='/' component={Profiles} />
        <Route path='/test1/:number' component={Profiles} />
        <Route path='/test2/:number' component={Profiles} />
      </Switch>

    </div>
  );
}

export default App;
