import * as React from 'react';
import { Component } from 'react-simplified';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//Bootstrap imports;
import Button from 'react-bootstrap/Button';

//Bootstrap imports
import { Card } from '../widgets';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddCustomer } from '../components/adduser.js';

//Imports for sql queries
import { customerService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Customers extends Component {
  customers = null;
  modal = false;

  render() {
    if (!this.customers)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <VerticalTableComponent
          tableBody={this.customers}
          tableHead={'customer'}
          deleteButton={true}
          delete={this.delete}
          whereTo={history.location.pathname}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        {this.modal && <AddCustomer modal={true} toggle={this.toggleModal} />}
      </>
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

  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }
}

export class CustomerDetail extends Component {
  customer = null;
  orderHistory = null;

  render() {
    if (!this.customer)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Kundedetaljer">
          <HorizontalTableComponent tableBody={this.customer} tableHead={'customer'} />
          <button onClick={() => console.log('test')}>&#9881;</button>
          <button>&#10004;</button>
        </Card>
        <Card title="Ordrehistorikk">
          {this.orderHistory && (
            <VerticalTableComponent tableBody={this.orderHistory} tableHead={'customersOrder'} whereTo={'/orders'} />
          )}
        </Card>
      </>
    );
  }
  mounted() {
    customerService.getCustomerDetails(this.props.match.params.id, result => {
      this.customer = result;
    });

    customerService.getCustomerOrders(this.props.match.params.id, orders => {
      this.orderHistory = orders;
    });
  }
}
