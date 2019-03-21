import * as React from 'react';
import { Component } from 'react-simplified';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//Bootstrap imports
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddCustomer } from '../components/adduser.js';

//Imports for sql queries
import { customerService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Customers extends Component {
  customers = null;
  tableHead = ['Kunde id', 'Fornavn', 'Etternavn', 'Antall ordre'];
  modal = false;

  render() {
    if (!this.customers)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <VerticalTableComponent
          tableBody={this.customers}
          tableHead={this.tableHead}
          deleteButton={true}
          delete={this.delete}
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
  tableHead = ['Kunde id', 'Fornavn', 'Etternavn', 'Telefon', 'Email', 'Adresse'];
  orderHistory = [];
  render() {
    if (!this.customer)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    let customerDetailsStyle = {
      padding: '50px',
      paddingTop: '25px'
    };
    return (
      <>
        <Card style={customerDetailsStyle}>
          <Card.Title>Kundedetaljer</Card.Title>
          <HorizontalTableComponent tableBody={this.customer} tableHead={this.tableHead} />

          <button>&#9881;</button>
          <button>&#10004;</button>

          <h4 style={{ paddingTop: '20px' }}>Ordrehistorikk:</h4>
        </Card>
        <CardDeck>
          <Card>
            <Card.Body>
              <Card.Title>Ordrenr:</Card.Title>
              <Card.Text>1x terrengsykkel</Card.Text>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary">Se detaljer</Button>
            </Card.Footer>
          </Card>
        </CardDeck>
      </>
    );
  }

  mounted() {
    customerService.getCustomerDetails(this.props.match.params.id, result => {
      this.customer = result;
    });
  }
}
