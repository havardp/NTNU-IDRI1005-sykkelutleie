import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';

//Imports for sql queries
import { orderService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Orders extends Component {
  orders = [];
  render() {
    return (
      <div className="main">
        <Table striped bordered hover>
          <thead>
            <tr>
              <td>Ordrenummer</td>
              <td>Kundenummer</td>
              <td>Kundenavn</td>
            </tr>
          </thead>
          <tbody>
            {this.orders.map(orders => (
              <tr key={orders.order_nr} onClick={() => history.push('/orders/' + orders.orders_nr)}>
                <td>{orders.order_nr}</td>
                <td>{orders.c_id}</td>
                <td>{orders.c_fname + ' ' + orders.c_lname}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
  mounted() {
    orderService.getOrders(orders => {
      this.orders = orders;
    });
  }
}

/* export class OrderDetail extends Component {
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
  }
} */
