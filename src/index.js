import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';

//Import of all components "login, customer, employee etc."
import { Login } from './components/login.js';
import { Menu, SideNav } from './components/navbars.js';
import { Home } from './components/home.js';
import { Customers, CustomerDetail, CustomerAdd } from './components/customers.js';
import { Employees, EmployeeDetail } from './components/employees.js';
import { StorageStatus, BikeDetail, EquipmentDetail } from './components/storage.js';
import { Orders, OrderDetail } from './components/orders.js';
import { NewOrder } from './components/neworder.js';

//To be able to change path
import createHashHistory from 'history/createHashHistory';
export const history = createHashHistory();

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <SideNav />
      <Route exact path="/" component={Login} />
      <Route exact path="/customers" component={Customers} />
      <Route exact path="/customers/add" component={CustomerAdd} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/customers/:id" component={CustomerDetail} />
      <Route exact path="/employees" component={Employees} />
      <Route exact path="/employees/:id" component={EmployeeDetail} />
      <Route exact path="/storagestatus" component={StorageStatus} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/orders/:id" component={OrderDetail} />
      <Route exact path="/bikedetails/:id" component={BikeDetail} />
      <Route exact path="/equipmentdetails/:id" component={EquipmentDetail} />
      <Route exact path="/neworder" component={NewOrder} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
