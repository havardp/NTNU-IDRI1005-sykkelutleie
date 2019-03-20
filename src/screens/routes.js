import * as React from 'react';
import { Component } from 'react-simplified';
import { Route, Switch, Redirect } from 'react-router-dom';

//Import of all components "login, customer, employee etc."
import { Login } from './login.js';
import { Menu, SideNav } from './navbars.js';
import { Home } from './home.js';
import { Customers, CustomerDetail, CustomerAdd } from './customers.js';
import { Employees, EmployeeDetail } from './employees.js';
import { StorageStatus, StorageDetails } from './storage.js';
import { Orders, OrderDetail } from './orders.js';
import { NewOrder } from './neworder.js';

class NoMatch extends Component {
  render() {
    console.log('404 no path, redirecting to home');
    return <Redirect to="/home" />;
  }
}

export class Routes extends Component {
  render() {
    return (
      <>
        <Menu />
        <SideNav />
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/customers" component={Customers} />
          <Route exact path="/customers/:id" component={CustomerDetail} />
          <Route exact path="/employees" component={Employees} />
          <Route exact path="/employees/:id" component={EmployeeDetail} />
          <Route exact path="/storagestatus" component={StorageStatus} />
          <Route exact path="/storagestatus/:id" component={StorageDetails} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/orders/:id" component={OrderDetail} />
          <Route exact path="/neworder" component={NewOrder} />
          <Route component={NoMatch} />
        </Switch>
      </>
    );
  }
}
