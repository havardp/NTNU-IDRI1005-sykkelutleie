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
              <td>Antall sykler</td>
              <td>Antall utstyr</td>
            </tr>
          </thead>
          <tbody>
            {this.orders.map(orders => (
              <tr key={orders.order_nr} onClick={() => history.push('/orders/' + orders.order_nr)}>
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


 export class OrderDetail extends Component {
  order = { order_nr: ' ', e_id: ' ', c_id: ' ', from_date: ' ', to_date: ' ', from_place: ' ', to_place: ' ' };
  render() {
    return (
      <div className="main">
      <Card title="Ordredetaljer">
      <Table striped bordered hover>
      <tbody>
      <tr>
      <td>Ordrenummer</td>
      <td>{this.order.order_nr}</td>
      </tr>
      <tr>
      <td>Ansatt id</td>
      <td>{this.order.e_id}</td>
      </tr>
      <tr>
      <td>Kunde id</td>
      <td>{this.order.c_id}</td>
      </tr>
      <tr>
      <td>Fra-dato</td>
      <td>{this.order.from_date}</td>
      </tr>
      <tr>
      <td>Til-dato</td>
      <td>{this.order.to_date}</td>
      </tr>
      <tr>
      <td>Utleveringsted</td>
      <td>{this.order.from_place}</td>
      </tr>
      <tr>
      <td>Innleveringsted</td>
      <td>{this.order.to_place}</td>
      </tr>
      </tbody>
      </Table>
      </Card>
      </div>
    );
  }

  mounted() {
    orderService.getOrder(this.props.match.params.id, result => {
      this.order.order_nr = result.order_nr;
      this.order.e_id = result.e_id;
      this.order.c_id = result.c_id;
      this.order.from_date = result.from_date.getDate() + '-' + (result.from_date.getMonth() + 1) + '-' + result.from_date.getFullYear();
      this.order.to_date = result.to_date.getDate() + '-' + (result.to_date.getMonth() + 1) + '-' + result.to_date.getFullYear();
      this.order.from_place = result.from_place;
      this.order.to_place = result.to_place;
    });
  }
}
