import * as React from 'react';
import { Component } from 'react-simplified';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//Bootstrap imports
import { Card } from '../widgets';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

//Imports for sql queries
import { storageService, orderService, customerService } from '../services';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddCustomer } from '../components/adduser.js';
import { CustomerOrderComponent, MakeOrderProductTable, AdditionalDetailsTable } from '../components/makeorder.js';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

class MakeOrder extends Component {
  //view variables
  distinctBikeModels = null;
  distinctEquipmentModels = null;
  modal = false;

  //variables to be used in order
  activeCustomer = null;
  bike = [];
  equipment = [];
  orderInformation = [];
  order = [];

  render() {
    if (!this.distinctBikeModels || !this.distinctEquipmentModels)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <div hidden={this.props.hide}>
        <Card>
          <CustomerOrderComponent sendStateToParent={this.handleActiveCustomerChange} />
          <Card title="Sykkel og utstyr">
            <div className="row">
              <div className="col-6">
                <MakeOrderProductTable tableBody={this.distinctBikeModels} sendStateToParent={this.handleBikeChange} />
              </div>
              <div className="col-6">
                <MakeOrderProductTable
                  tableBody={this.distinctEquipmentModels}
                  sendStateToParent={this.handleEquipmentChange}
                />
              </div>
            </div>
          </Card>
          <Card title="Annen informasjon">
            <div className="row">
              <div className="col-8">
                <AdditionalDetailsTable sendStateToParent={this.handleOrderInformationChange} />
              </div>
              <div className="col-4">
                <button
                  onClick={() => {
                    this.order = [];
                    this.order.push(this.bike, this.equipment, this.orderInformation);
                    this.activeCustomer
                      ? this.props.sendStateToParent([this.order, this.activeCustomer])
                      : alert('fyll ut data');
                  }}
                >
                  videre
                </button>
              </div>
            </div>
          </Card>
        </Card>
        {this.modal && <AddCustomer modal={true} toggle={this.toggleModal} />}
      </div>
    );
  }

  mounted() {
    storageService.getDistinctBikeModel(result => {
      this.distinctBikeModels = result;
    });
    storageService.getDistinctEquipmentModel(result => {
      this.distinctEquipmentModels = result;
    });
  }

  //recieve state from children components and save them in this component.
  handleBikeChange(bike) {
    this.bike = bike;
  }
  handleEquipmentChange(equipment) {
    this.equipment = equipment;
  }
  handleActiveCustomerChange(customer) {
    this.activeCustomer = customer;
  }
  handleOrderInformationChange(orderInformation) {
    this.orderInformation = orderInformation;
    this.updateAvailableDate();
  }

  //Checks to see how many of each bike and equipment are available between the selected from and to date
  updateAvailableDate() {
    if (typeof this.orderInformation.toDate != 'undefined' && typeof this.orderInformation.fromDate != 'undefined') {
      storageService.getCountBikeModel(this.orderInformation.fromDate, this.orderInformation.toDate, result => {
        this.distinctBikeModels = result;
      });
      storageService.getCountEquipmentModel(this.orderInformation.fromDate, this.orderInformation.toDate, result => {
        this.distinctEquipmentModels = result;
      });
    } else {
      console.log('trenger begge dato');
    }
  }

  //updates the search list if a customer has been added, aswell as handles the modal toggle
  toggleModal() {
    if (this.modal == true) {
      customerService.getCustomerSearch(result => {
        this.temporaryOptions = [];
        result.map(e => {
          this.temporaryOptions.push({ value: e.c_id, label: e.fullname });
        });
        this.options = this.temporaryOptions;
      });
    }
    this.modal ? (this.modal = false) : (this.modal = true);
  }
}

//Parent component which handles state transfers between making the order and displaying it in the confirmation page
export class NewOrder extends Component {
  confirmationPage = false;
  orderState = null;

  render() {
    return (
      <>
        <div className="row">
          <div className="col-6">
            <Button
              variant={!this.confirmationPage ? 'secondary' : 'light'}
              style={{ width: '100%' }}
              onClick={() => (this.confirmationPage = false)}
            >
              Lag ordre
            </Button>
          </div>
          <div className="col-6">
            <Button
              variant={this.confirmationPage ? 'secondary' : 'light'}
              style={{ width: '100%' }}
              onClick={() => (this.orderState ? (this.confirmationPage = true) : alert('fullfør orderen'))}
            >
              Bekreft ordre
            </Button>
          </div>
        </div>
        <MakeOrder sendStateToParent={this.stateHandler} hide={this.confirmationPage} />
        {this.confirmationPage && <ConfirmOrder recieveStateFromParent={this.orderState} />}
      </>
    );
  }

  stateHandler(state) {
    this.orderState = state;
    this.confirmationPage = this.confirmationPage ? false : true;
  }
}

//Class that shows the information about the order on the confirmation page.
class ConfirmOrder extends Component {
  //customer id, used in sql query to output information about the selected user
  customer = this.props.recieveStateFromParent[1];
  //all the other information, array of array
  orderDetails = this.props.recieveStateFromParent[0];
  //the arrays inside the orderdetails array.
  bikeDetails = this.orderDetails[0];
  equipmentDetails = this.orderDetails[1];
  additionalDetails = this.orderDetails[2];
  //tableBody and tableHead for displaying the customer details
  customerDetails = null;
  tableHead = ['Kunde id', 'Fornavn', 'Etternavn', 'Email', 'Telefon', 'Adresse'];

  render() {
    //render this page with the recieveStateFromParent prop which contains all info from the previous page
    if (!this.customerDetails) {
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    }
    return (
      <Card>
        <div className="row">
          <div className="col-6">
            <Card title="Kunde id">
              <HorizontalTableComponent tableBody={this.customerDetails} tableHead={this.tableHead} />
            </Card>
          </div>
          <div className="col-3">
            <Card title="Bikes">
              {Object.keys(this.bikeDetails).map(data => (
                <div key={data}>
                  {data} -{this.bikeDetails[data]}
                </div>
              ))}
            </Card>
          </div>
          <div className="col-3">
            <Card title="Equipment">
              {Object.keys(this.equipmentDetails).map(data => (
                <div key={data}>
                  {data} -{this.equipmentDetails[data]}
                </div>
              ))}
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <Card title="Tillegs Info">
              {Object.keys(this.additionalDetails).map(data => (
                <div key={data}>
                  {data} -{this.additionalDetails[data]}
                </div>
              ))}
            </Card>
          </div>
          <div className="col-6">
            <Card title="Info">test</Card>
          </div>
        </div>
      </Card>
    );
  }

  mounted() {
    customerService.getCustomerDetails(this.customer, result => {
      this.customerDetails = result;
    });
  }
}
