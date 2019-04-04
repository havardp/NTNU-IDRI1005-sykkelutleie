import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route, Switch } from 'react-router-dom';

import { Routes } from './routes.js';
import { Login } from './screens/login.js';

//To be able to change path
import createHashHistory from 'history/createHashHistory';
export const history = createHashHistory();

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <Routes />
    </Switch>
  </HashRouter>,
  document.getElementById('root')
);
