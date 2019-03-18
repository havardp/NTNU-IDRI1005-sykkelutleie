import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//Imports for sql queries
import { customerService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Customers extends Component {
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
              <td>Slett Kunde</td>
            </tr>
          </thead>
          <tbody>
            {this.customers.map(customer => (
              <tr key={customer.c_id} onClick={() => history.push('/customers/' + customer.c_id)}>
                <td>{customer.c_id}</td>
                <td>{customer.c_fname}</td>
                <td>{customer.c_lname}</td>
                <td>0</td>
                <td>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      this.delete(customer.c_id);
                    }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <button className="btn btn-info btn-lg" onClick={() => history.push('/customers/add')}>
                  &#10010;
                </button>
              </td>
            </tr>
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
  delete(id) {
    customerService.deleteCustomers(id, () => {
      this.mounted();
    });
  }
}

export class CustomerDetail extends Component {
  customer = null;
  render() {
    if (!this.customer) return null;
    return (
      <div className="main">
        <Card title="Personalia">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Kunde id</td>
                <td>{this.customer.c_id}</td>
              </tr>
              <tr>
                <td>Fornavn</td>
                <td>{this.customer.c_fname}</td>
              </tr>
              <tr>
                <td>Etternavn</td>
                <td>{this.customer.c_lname}</td>
              </tr>
              <tr>
                <td>Telefon</td>
                <td>{this.customer.c_tlf}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.customer.c_email}</td>
              </tr>
              <tr>
                <td>Adresse</td>
                <td>{this.customer.c_address}</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </div>
    );
  }

  mounted() {
    customerService.getCustomer(this.props.match.params.id, result => {
      this.customer = result;
    });
  }
}

export class CustomerAdd extends Component {
  user = [];
  //TODO legg til validering av data
  render() {
    return (
      <div className="main">
        <Card>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Fornavn</Form.Label>
                <Form.Control type="text" placeholder="Ola" onChange={e => (this.user.fname = e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Etternavn</Form.Label>
                <Form.Control type="text" placeholder="Normann" onChange={e => (this.user.lname = e.target.value)} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Adressegata 1"
                  onChange={e => (this.user.address = e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Telefon</Form.Label>
                <Form.Control type="number" placeholder="1234 5678" onChange={e => (this.user.tlf = e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ola@ntnu.no"
                  onChange={e => (this.user.email = e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Postnummer</Form.Label>
                <Form.Control type="number" placeholder="1234" onChange={e => (this.user.zip = e.target.value)} />
              </Form.Group>
            </Form.Row>

            <Button variant="outline-primary" onClick={this.add}>
              Registrer
            </Button>
          </Form>
        </Card>
      </div>
    );
  }

  mounted() {}

  add() {
    console.log(this.user.length);
    customerService.addCustomer(this.user, () => {
      history.push('/customers');
    });
  }
}
