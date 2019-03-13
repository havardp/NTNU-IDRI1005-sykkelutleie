import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';

//Bootstrap imports
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { Card, List, Row, Column, NavBar, Button, Alert } from './widgets';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ModalBody from 'react-bootstrap/ModalBody';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

//Import of all components "login, customer, employee etc."
import { Login } from './login.js';

//Imports for sql queries
import { employeeService, customerService } from './services';

//To be able to change path
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory();

//To be able to call main.js to change window size
const electron = require('electron');
let { ipcRenderer } = electron;

//Export a class to be able to change path from different components
class HistoryRoute {
  changePath(path) {
    history.push(path);
  }
}
export let historyRoute = new HistoryRoute();

class Menu extends Component {
  //"&#128100;" profil ikon
  render() {
    if (localStorage.getItem('userLoggedIn') != 'true') return null;
    return (
      <NavBar brand="Sykkelutleie AS">
        {localStorage.getItem('userLoggedIn') == 'true' ? (
          <ButtonGroup vertical>
            <DropdownButton
              id="dropdown-item-button"
              alignRight
              title={localStorage.getItem('userName')}
              variant="secondary"
            >
              <Dropdown.Item onClick={() => history.push('/employees/' + localStorage.getItem('userName'))}>
                Min side
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  localStorage.clear();
                  ipcRenderer.send('minimize');
                  history.push('/');
                }}
              >
                {' '}
                Logg ut
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        ) : (
          ''
        )}
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <Card>
          <List>
            <Button.Info onClick={this.newOrder}>Ny ordre</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.findOrder}>Finn ordre</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.customer}>Kunder</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.storageStatus}>Lagerstatus</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.employee}>Ansatte</Button.Info>
          </List>
        </Card>
      </div>
    );
  }
  newOrder() {
    history.push('/newOrder');
  }
  findOrder() {}
  customer() {
    history.push('/customers');
  }
  storageStatus() {}
  employee() {
    history.push('/employees');
  }
}

class EmployeeDetail extends Component {
  user = { e_id: ' ', fname: ' ', lname: ' ', department: ' ', email: ' ', tlf: ' ', address: ' ', dob: ' ' };
  render() {
    return (
      <Card title="Personalia">
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Ansatt id</td>
              <td>{this.user.e_id}</td>
            </tr>
            <tr>
              <td>Fornavn</td>
              <td>{this.user.fname}</td>
            </tr>
            <tr>
              <td>Etternavn</td>
              <td>{this.user.lname}</td>
            </tr>
            <tr>
              <td>Avdeling</td>
              <td>{this.user.department}</td>
            </tr>
            <tr>
              <td>Telefon</td>
              <td>{this.user.tlf}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{this.user.email}</td>
            </tr>
            <tr>
              <td>Adresse</td>
              <td>{this.user.address}</td>
            </tr>
            <tr>
              <td>Fødselsdato</td>
              <td>{this.user.dob}</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    );
  }

  mounted() {
    employeeService.getEmployee(this.props.match.params.id, result => {
      this.user.e_id = result.e_id;
      this.user.fname = result.fname;
      this.user.lname = result.lname;
      this.user.department = result.department;
      this.user.email = result.email;
      this.user.tlf = result.tlf;
      this.user.address = result.address;
      this.user.dob = result.DOB.getDate() + '-' + (result.DOB.getMonth() + 1) + '-' + result.DOB.getFullYear();
    });
  }
}

class CustomerDetail extends Component {
  user = { c_id: ' ', c_fname: ' ', c_lname: ' ', email: ' ', tlf: ' ', address: ' ', c_zip: ' ' };
  render() {
    return (
      <Card title="Personalia">
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Kunde id</td>
              <td>{this.user.c_id}</td>
            </tr>
            <tr>
              <td>Fornavn</td>
              <td>{this.user.c_fname}</td>
            </tr>
            <tr>
              <td>Etternavn</td>
              <td>{this.user.c_lname}</td>
            </tr>
            <tr>
              <td>Telefon</td>
              <td>{this.user.c_tlf}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{this.user.c_email}</td>
            </tr>
            <tr>
              <td>Adresse</td>
              <td>{this.user.c_address}</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    );
  }

  mounted() {
    customerService.getCustomer(this.props.match.params.id, result => {
      this.user.c_id = result.c_id;
      this.user.c_fname = result.c_fname;
      this.user.c_lname = result.c_lname;
      this.user.c_email = result.c_email;
      this.user.c_tlf = result.c_tlf;
      this.user.c_address = result.c_address;
    });
    console.log(this.user);
  }
}

class Customers extends Component {
  customers = [];
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>Kunde id</td>
            <td>Fornavn</td>
            <td>Etternavn</td>
            <td>Antall ordrer</td>
          </tr>
        </thead>
        <tbody>
          {this.customers.map(customer => (
            <tr key={customer.c_id} onClick={() => history.push('/customers/' + customer.c_id)}>
              <td>{customer.c_id}</td>
              <td>{customer.c_fname}</td>
              <td>{customer.c_lname}</td>
              <td>0</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  mounted() {
    customerService.getCustomers(customers => {
      this.customers = customers;
    });
  }
}

class Employees extends Component {
  employees = [];
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>Ansatt id</td>
            <td>Fornavn</td>
            <td>Etternavn</td>
          </tr>
        </thead>
        <tbody>
          {this.employees.map(employee => (
            <tr key={employee.e_id} onClick={() => history.push('/employees/' + employee.e_id)}>
              <td>{employee.e_id}</td>
              <td>{employee.fname}</td>
              <td>{employee.lname}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }
}

class NewOrder extends Component {
  render() {
    return <div>test</div>;
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/customers" component={Customers} />
      <Route exact path="/customers/:id" component={CustomerDetail} />
      <Route exact path="/employees" component={Employees} />
      <Route exact path="/employees/:id" component={EmployeeDetail} />
      <Route exact path="/newOrder" component={NewOrder} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
