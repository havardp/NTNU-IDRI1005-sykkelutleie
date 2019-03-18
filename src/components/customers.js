import * as React from 'react';
import { Component } from 'react-simplified';
import SearchField from "react-search-field";

//Bootstrap imports
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';

//Imports for sql queries
import { customerService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Customers extends Component {
  customers = [];
  render() {
    return (
      <div className="main">
      <SearchField
      placeholder="Søk..."
      classNames="test-class"
          />
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
            <tr>
              <td>
                <button className="btn btn-info btn-lg">&#10010;</button>
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
}

export class CustomerDetail extends Component {
  customer = [];
  render() {
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
