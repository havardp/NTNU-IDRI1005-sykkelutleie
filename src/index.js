import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { employeeService, customerService } from './services';
import { Card, List, Row, Column, NavBar, Button, Alert } from './widgets';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
const bcrypt = require('bcryptjs');

class Menu extends Component {
  //"&#128100;" profil ikon
  render() {
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
                  history.push('/');
                  localStorage.clear();
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

class Login extends Component {
  user = [];
  collapseShow = false;
  modalShow = false;

  modalClose() {
    this.modalShow = false;
  }

  collapseClose() {
    this.collapseShow = false;
  }

  modalOpen() {
    this.modalShow = true;
  }

  render() {
    return (
      <div>
        <Card title="Login">
          <List>
            <Form.Control type="text" placeholder="Brukernavn" onChange={e => (this.user.name = e.target.value)} />
            <Form.Control type="password" placeholder="Passord" onChange={e => (this.user.password = e.target.value)} />
          </List>
          <div onClick={this.collapseClose}>
            <Collapse in={this.collapseShow}>
              <div id="example-collapse-text">
                <Alert role="danger"> Du har skrevet inn feil brukernavn eller passord </Alert>
              </div>
            </Collapse>
          </div>
          <Row>
            <Column>
              <Button.Light onClick={this.login}>Logg inn</Button.Light>
            </Column>
            <Column right>
              <Button.Light onClick={this.modalOpen}>Hjelp &#x2753;</Button.Light>
            </Column>
          </Row>
        </Card>
        <Modal show={this.modalShow} onHide={this.modalClose} centered>
          <Modal.Body>Hvis du er usikker på passord eller brukernavn, kontakt en administrator</Modal.Body>
        </Modal>
      </div>
    );
  }

  mounted() {
    if (localStorage.getItem('userLoggedIn') == 'true') {
      history.push('/home');
    }
  }

  login() {
    employeeService.getEmployee(
      this.user.name,
      result => {
        if (bcrypt.compareSync(this.user.password ? this.user.password : '', result.password)) {
          localStorage.setItem('userName', this.user.name);
          localStorage.setItem('userLoggedIn', true);
          history.push('/home');
        } else {
          this.collapseShow = true;
        }
      },
      () => {
        this.collapseShow = true;
      }
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
  user = { e_id: ' ', fname: ' ', lname: ' ', department: ' ', email: ' ', tlf: ' ', adress: ' ', dob: ' ' };
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
              <td>{this.user.adress}</td>
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
      this.user.adress = result.adress;
      this.user.dob = result.DOB.getDate() + '-' + (result.DOB.getMonth() + 1) + '-' + result.DOB.getFullYear();
    });
  }
}

class CustomerDetail extends Component {
  user = { c_id: ' ', c_fname: ' ', c_lname: ' ', email: ' ', tlf: ' ', adress: ' ', c_zip: ' ' };
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
              <td>{this.user.c_adress}</td>
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
      this.user.c_adress = result.c_adress;
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
    return (
      <Card>
        <Form>
          <Form.Row>
            <Form.Group as={Column} controlId="formGridEmail">
              <Form.Label>Fornavn</Form.Label>
              <Form.Control type="text" placeholder="Skriv her" />
            </Form.Group>

            <Form.Group as={Column} controlId="formGridPassword">
              <Form.Label>Etternavn</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="1234 Main St" />
          </Form.Group>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control placeholder="Apartment, studio, or floor" />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Column} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control />
            </Form.Group>

            <Form.Group as={Column} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control as="select">
                <option>Choose...</option>
                <option>...</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Column} controlId="formGridZip">
              <Form.Label>Zip</Form.Label>
              <Form.Control />
            </Form.Group>
          </Form.Row>

          <Form.Group id="formGridCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
        </Form>
      </Card>
    );
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
