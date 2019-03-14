import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';

//Bootstrap imports
import { Card, List, Row, Column, NavBar, Alert } from './widgets';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ModalBody from 'react-bootstrap/ModalBody';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

//import mysql queries
import { customerService, employeeService, storageService } from './services.js';

//Import of all components "login, customer, employee etc."
import { Login } from './login.js';

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
    if (sessionStorage.getItem('userLoggedIn') != 'true') return null;
    return (
      <NavBar brand="Sykkelutleie AS">
        <ButtonGroup vertical>
          <DropdownButton
            id="dropdown-item-button"
            alignRight
            title={sessionStorage.getItem('userName')}
            variant="outline-secondary"
          >
            <Dropdown.Item onClick={() => history.push('/employees/' + sessionStorage.getItem('userName'))}>
              Min side
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                sessionStorage.clear();
                ipcRenderer.send('minimize');
                history.push('/home');
              }}
            >
              {' '}
              Logg ut
            </Dropdown.Item>
          </DropdownButton>
        </ButtonGroup>
      </NavBar>
    );
  }
}

class SideNav extends Component {
  render() {
    if (sessionStorage.getItem('userLoggedIn') != 'true') return null;
    return (
      <div className="sidenav">
        <Button variant="outline-secondary" block onClick={this.newOrder}>
          Ny ordre
        </Button>

        <Button variant="outline-secondary" block onClick={this.findOrder}>
          Finn ordre
        </Button>

        <Button variant="outline-secondary" block onClick={this.customer}>
          Kunder
        </Button>

        <Button variant="outline-secondary" block onClick={this.storageStatus}>
          Lagerstatus
        </Button>

        <Button variant="outline-secondary" block onClick={this.employee}>
          Ansatte
        </Button>
      </div>
    );
  }
  newOrder() {}
  findOrder() {
    history.push('/orders')
  }
  customer() {
    history.push('/customers');
  }
  storageStatus() {
    history.push('/storagestatus');
  }
  employee() {
    history.push('/employees');
  }
}

class Home extends Component {
  render() {
    return <div className="main">HOME</div>;
  }
}

class EmployeeDetail extends Component {
  user = { e_id: ' ', fname: ' ', lname: ' ', department: ' ', email: ' ', tlf: ' ', address: ' ', dob: ' ' };
  render() {
    return (
      <div className="main">
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
      </div>
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
      <div className="main">
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
                <td>{this.user.c_adress}</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </div>
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
      <div className="main">
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
      </div>
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
      <div className="main">
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
      </div>
    );
  }
  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }
}

class StorageStatus extends Component {
  storagestatus = [];
  render() {
    return (
      <div className="main">
        <Card title="LAGERSTATUS" />
        <Card title="Sykler">
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Modell</td>
                <td>Beskrivelse</td>
                <td>Timepris</td>
                <td>Dagpris</td>
              </tr>
            </thead>
            <tbody>
              {this.storagestatus.map(product_type => (
                <tr key={product_type.model} onClick={() => history.push('/storagestatus/' + product_type.model)}>
                  <td>{product_type.model}</td>
                  <td>{product_type.description}</td>
                  <td>{product_type.hour_price}</td>
                  <td>{product_type.day_price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card title="Utstyr" />
      </div>
    );
  }
  mounted() {
    storageService.getStorage(storagestatus => {
      this.storagestatus = storagestatus;
    });
  }
}

class StorageDetail extends Component {
  name = {
    chassis_id: ' ',
    model: ' ',
    gear: ' ',
    wheel_size: ' ',
    rep_date: ' ',
    broken: ' ',
    location: ' ',
    storage: ' ',
    luggage: ' '
  };
  Allbikes = [];
  render() {
    return (
      <div className="main">
        <Card title="Detaljer">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <td>Chassis id</td>
                <td>Modell</td>
                <td>Gir</td>
                <td>Hjulstørrelse</td>
                <td>Rep.dato</td>
                <td>Ødelagt</td>
                <td>Lokasjon</td>
                <td>Tilholdssted</td>
                <td>Bagasjebrett</td>
              </tr>
            </thead>
            <tbody>
              {this.Allbikes.map(bike => (
                <tr key={bike.chassis_id}>
                  <td>{bike.chassis_id}</td>
                  <td>{bike.model}</td>
                  <td>{bike.gear}</td>
                  <td>{bike.wheel_size}</td>
                  <td>{bike.rep_date}</td>
                  <td>{bike.broken}</td>
                  <td>{bike.location}</td>
                  <td>{bike.storage}</td>
                  <td>{bike.luggage}</td>
                  <td>
                    <button>&#9881;</button>
                  </td>
                  <td>
                    <button>&#10004;</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <button className="btn btn-info btn-lg">
                    <span className="glyphicon glyphicon-plus" />
                    &#10010;
                  </button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </div>
    );
  }

  mounted() {
    storageService.getBike(this.props.match.params.id, result => {
      this.Allbikes = result;
      /*    this.name.chassis_id = result.chassis_id;
      this.name.model = result.model;
      this.name.gear = result.gear;
      this.name.wheel_size = result.wheel_size;
      this.name.rep_date = result.rep_date;
      this.name.broken = result.broken;
      this.name.location = result.location;
      this.name.storage = result.storage;
      this.name.luggage = result.luggage; */
    });
  }
}


class OrderDetail extends Component {
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

class Orders extends Component {
  orders = [];
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
      <Route exact path="/storagestatus/:id" component={StorageDetail} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/orders/:id" component={OrderDetail} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
