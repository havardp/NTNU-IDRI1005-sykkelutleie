import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';

//Import of all components "login, customer, employee etc."
import { Login } from './components/login.js';
import { Customers, CustomerDetail } from './components/customers.js';
import { Employees, EmployeeDetail } from './components/employees.js';
import { StorageStatus, BikeDetail, EquipmentDetail } from './components/storage.js';
import { Menu, SideNav } from './components/navbars.js';
import { Orders } from './components/orders.js';
import { Home } from './components/home.js';

//To be able to change path
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//Export a class to be able to change path from different components
class HistoryRoute {
  changePath(path) {
    history.push(path);
  }
}
export let historyRoute = new HistoryRoute();

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <SideNav />
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/customers" component={Customers} />
      <Route exact path="/customers/:id" component={CustomerDetail} />
      <Route exact path="/employees" component={Employees} />
      <Route exact path="/employees/:id" component={EmployeeDetail} />
      <Route exact path="/storagestatus" component={StorageStatus} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/bikedetails/:id" component={BikeDetail} />
      <Route exact path="/equipmentdetails/:id" component={EquipmentDetail} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
