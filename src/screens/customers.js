import * as React from 'react';
import { Component } from 'react-simplified';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//Bootstrap imports
import { Card } from '../widgets';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddCustomer } from '../components/adduser.js';

//node modules
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
  sortedBy = 'c_id';

  render() {
    return (
      <>
        {this.searchbarOptions && (
          <div className="row">
            <div className="col-10">
              <Select
                value={this.selectedOption}
                placeholder="&#57492; Søk kunde..."
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
                &#57826;
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
          whereTo={this.props.match.path}
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
    if (sort == this.sortedBy) {
      arraySort(this.customers, sort, { reverse: true });
      this.sortedBy = '';
    } else {
      arraySort(this.customers, sort);
      this.sortedBy = sort;
    }
  }

  delete(id) {
    if (window.confirm('Er du sikker på at du vil slette denne kunden?'))
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
  editable = false;
  sortedBy = 'order_nr';

  render() {
    return (
      <>
        <Card title="Kundedetaljer">
          <HorizontalTableComponent
            tableBody={this.customer}
            tableHead={'customer'}
            editable={this.editable}
            sendStateToParent={this.updateCustomer}
          />
          <button onClick={() => (this.editable ? (this.editable = false) : (this.editable = true))}>
            &#57604; Endre
          </button>
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
    if (sort == this.sortedBy) {
      arraySort(this.orderHistory, sort, { reverse: true });
      this.sortedBy = '';
    } else {
      arraySort(this.orderHistory, sort);
      this.sortedBy = sort;
    }
  }

  updateCustomer(value, key) {
    customerService.updateCustomer(key, value, this.props.match.params.id, () => console.log('kunde endret'));
  }
}
