import * as React from 'react';
import { Component } from 'react-simplified';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//Bootstrap imports
import { Card } from '../widgets';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

//Imports for sql queries
import { storageService, orderService, customerService } from '../services';

//reusable components
import { HorizontalTableComponent } from '../components/tables.js';
import { AddCustomer } from '../components/adduser.js';
import { NewOrderCustomer, NewOrderProductSelection, NewOrderAdditionalDetails } from '../components/makeorder.js';
import { ConfirmOrderProducts, ConfirmOrderAdditionalDetails } from '../components/confirmorder.js';

//node modules
import ReactLoading from 'react-loading';

class MakeOrder extends Component {
  //view variables
  distinctBikeModels = null;
  distinctEquipmentModels = null;
  modal = false;
  temporaryOptions = [];
  searchbarOptions = null;
  temporary = null;

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
        <NewOrderCustomer
          sendStateToParent={this.handleActiveCustomerChange}
          makeNewCustomer={this.toggleModal}
          options={this.searchbarOptions}
        />
        <Form>
          <Card title="Annen informasjon">
            <div className="row">
              <NewOrderAdditionalDetails sendStateToParent={this.handleOrderInformationChange} />
            </div>
          </Card>
          <Card>
            <div className="row">
              <div className="col-6">
                <h3>Sykkel</h3>
                <NewOrderProductSelection
                  tableBody={this.distinctBikeModels}
                  sendStateToParent={this.handleBikeChange}
                  products={this.bike}
                />
              </div>
              <div className="col-6">
                <h3>Utstyr</h3>
                <NewOrderProductSelection
                  tableBody={this.distinctEquipmentModels}
                  sendStateToParent={this.handleEquipmentChange}
                  products={this.equipment}
                />
                <div className="row">
                  <div className="col-6" />
                  <div className="col-6">
                    <Button
                      variant="secondary"
                      style={{ width: '100%' }}
                      type="submit"
                      onClick={this.goToConfirmationPage}
                    >
                      videre &#57518;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Form>
        {this.modal && <AddCustomer modal={true} toggle={this.toggleModal} />}
      </div>
    );
  }

  mounted() {
    customerService.getCustomerSearch(result => {
      this.temporaryOptions = [];
      result.map(e => {
        this.temporaryOptions.push({ value: e.c_id, label: e.fullname });
      });
      this.searchbarOptions = this.temporaryOptions;
    });
    storageService.getDistinctModel(result => {
      this.distinctBikeModels = result[0];
      this.distinctEquipmentModels = result[1];
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

  //handles sending the right states to the parent component, and calling the function in the parent component which sends to next page
  goToConfirmationPage() {
    if (
      this.orderInformation.fromDate &&
      this.orderInformation.toDate &&
      this.activeCustomer &&
      this.orderInformation.dropoffLocation &&
      this.orderInformation.pickupLocation
    ) {
      this.order = [];
      this.order.push(this.bike, this.equipment, this.orderInformation);
      this.props.sendStateToParent([this.order, this.activeCustomer]);
    }
  }

  //Checks to see how many of each bike and equipment are available between the selected from and to date
  updateAvailableDate() {
    if (typeof this.orderInformation.toDate != 'undefined' && typeof this.orderInformation.fromDate != 'undefined') {
      storageService.getCountModel(this.orderInformation.fromDate, this.orderInformation.toDate, result => {
        this.bike = [];
        this.equipment = [];
        this.distinctBikeModels = result[0];
        this.distinctEquipmentModels = result[1];
      });
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
        this.searchbarOptions = this.temporaryOptions;
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

  //variables used for checking if the order is completed
  countProducts = 0;
  insertedProducts = 0;
  makingOrder = false;
  orderId = null;

  render() {
    //render this page with the recieveStateFromParent prop which contains all info from the previous page
    if (!this.customerDetails || this.makingOrder) {
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    }

    return (
      <>
        <Card title="Kunde og tilleggs info">
          <div className="row">
            <div className="col-6">
              <HorizontalTableComponent tableBody={this.customerDetails} tableHead={'customer'} />
            </div>
            <div className="col-6">
              <ConfirmOrderAdditionalDetails tableBody={this.additionalDetails} />
            </div>
          </div>
          <Card title="Sykkel og utstyr">
            <div className="row">
              <div className="col-6">
                <ConfirmOrderProducts tableBody={this.bikeDetails} tableHead={'products'} />
              </div>
              <div className="col-6">
                <ConfirmOrderProducts tableBody={this.equipmentDetails} tableHead={'products'} />
              </div>
            </div>
            <div className="row">
              <div className="col-9" />
              <div className="col-3">
                <Button variant="secondary" style={{ width: '100%' }} onClick={this.sendOrder}>
                  Bekreft ordre
                </Button>
              </div>
            </div>
          </Card>
        </Card>
      </>
    );
  }

  mounted() {
    //finds the totalprice of the order and numbre of products to check when the order is finished
    this.additionalDetails.totalPrice = 0;
    Object.keys(this.bikeDetails).map(data => {
      this.additionalDetails.totalPrice +=
        this.bikeDetails[data][0] * this.bikeDetails[data][1] * this.additionalDetails.nrDays;
      this.countProducts += parseInt(this.bikeDetails[data][0]);
    });
    Object.keys(this.equipmentDetails).map(data => {
      this.additionalDetails.totalPrice +=
        this.equipmentDetails[data][0] * this.equipmentDetails[data][1] * this.additionalDetails.nrDays;
      this.countProducts += parseInt(this.equipmentDetails[data][0]);
    });
    if (this.additionalDetails.rabat) {
      this.additionalDetails.totalPrice *= (100 - parseInt(this.additionalDetails.rabat)) / 100;
    }

    //finds the details about the selected customer
    customerService.getCustomerDetails(this.customer, result => {
      this.customerDetails = result;
    });
  }

  sendOrder() {
    this.makingOrder = true;

    orderService.makeOrder(sessionStorage.getItem('userName'), this.customer, this.additionalDetails, order_id => {
      this.orderId = order_id;
      Object.keys(this.bikeDetails).map(data => {
        storageService.getAvailableChassisId(
          data,
          this.additionalDetails.fromDate,
          this.additionalDetails.toDate,
          parseInt(this.bikeDetails[data][0]),
          result => {
            result.map(bike => {
              orderService.makeBikeOrder(order_id, bike.chassis_id, () => {
                console.log('bike inserted');
                this.insertedProducts++;
                if (this.insertedProducts == this.countProducts) {
                  this.makingOrder = false;
                  alert('Ordre fullført');
                  history.push('/orders/' + this.orderId);
                }
              });
            });
          }
        );
      });
      Object.keys(this.equipmentDetails).map(data => {
        storageService.getAvailableEqId(
          data,
          this.additionalDetails.fromDate,
          this.additionalDetails.toDate,
          parseInt(this.equipmentDetails[data][0]),
          result => {
            result.map(equipment => {
              orderService.makeEquipmentOrder(order_id, equipment.eq_id, () => {
                console.log('equipment inserted');
                this.insertedProducts++;
                if (this.insertedProducts == this.countProducts) {
                  this.makingOrder = false;
                  alert('Ordre fullført');
                  history.push('/orders/' + this.orderId);
                }
              });
            });
          }
        );
      });
    });
  }
}
