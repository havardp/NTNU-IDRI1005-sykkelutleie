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

import Select from 'react-select';
import arraySort from 'array-sort';
//Imports for sql queries
import { customerService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Customers extends Component {
  customers = null;
  modal = false;

  //variables for the select searchbar
  selectedOption = null;
  temporaryOptions = [];
  searchbarOptions = null;
  temporary = null;

  render() {
    return (
      <>
        {this.searchbarOptions && (
          <div className="row">
            <div className="col-10">
              <Select
                value={this.selectedOption}
                placeholder="Søk kunde..."
                className="writable"
                onChange={e => {
                  this.selectedOption = e;
                  history.push('/customers/' + e.value);
                }}
                options={this.searchbarOptions}
              />
            </div>
            <div className="col-2">
              <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
                &#10010;
              </button>
            </div>
          </div>
        )}
        <VerticalTableComponent
          className={'clickable'}
          tableBody={this.customers}
          tableHead={'customer'}
          deleteButton={true}
          delete={this.delete}
          whereTo={history.location.pathname}
          sort={this.sort}
        />
        {this.modal && <AddCustomer modal={true} toggle={this.toggleModal} />}
      </>
    );
  }
  mounted() {
    customerService.getCustomers(customers => {
      this.customers = customers;
    });

    customerService.getCustomerSearch(result => {
      this.temporaryOptions = [];
      result.map(e => {
        this.temporaryOptions.push({ value: e.c_id, label: e.fullname });
      });
      this.searchbarOptions = this.temporaryOptions;
    });
  }

  sort(sort) {
    arraySort(this.customers, sort);
  }

  delete(id) {
    customerService.deleteCustomers(id, () => this.mounted());
  }

  toggleModal() {
    if (this.modal == true) this.mounted();
    this.modal ? (this.modal = false) : (this.modal = true);
  }
}

export class CustomerDetail extends Component {
  customer = null;
  orderHistory = null;

  render() {
    return (
      <>
        <Card title="Kundedetaljer">
          <HorizontalTableComponent tableBody={this.customer} tableHead={'customer'} />
          <button onClick={() => console.log('test')}>&#9881;</button>
          <button>&#10004;</button>
        </Card>
        <Card title="Ordrehistorikk">
          {this.orderHistory && (
            <VerticalTableComponent
              tableBody={this.orderHistory}
              tableHead={'customersOrder'}
              whereTo={'/orders'}
              sort={this.sort}
            />
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

  sort(sort) {
    arraySort(this.orderHistory, sort);
  }
}
