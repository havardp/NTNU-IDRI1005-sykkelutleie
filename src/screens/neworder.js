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

//make it not show if loading is fast?
import ReactLoading from 'react-loading';
import Select from 'react-select';

//using hacky solution hidden on makeorder render when on confirmationpage to not have to rerender and lose states
//Class for handling all the inputs in making the order.
class MakeOrder extends Component {
  //view variables
  distinctBikeModels = null;
  distinctEquipmentModels = null;
  selectedOption = null;
  options = null;
  modal = false;
  temporaryOptions = [];

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
          <Card title="Kunde">
            <div className="row">
              <div className="col-10">
                <Select
                  value={this.selectedOption}
                  onChange={e => {
                    this.selectedOption = e;
                    this.activeCustomer = e.value;
                  }}
                  options={this.options}
                />
              </div>
              <div className="col-2">
                <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
                  &#10010;
                </button>
              </div>
            </div>
          </Card>
          <Card title="Sykkel og utstyr">
            <div className="row" hidden={this.props.hide}>
              <div className="col-6">
                <Table striped bordered hover>
                  <tbody>
                    {this.distinctBikeModels.map(model => (
                      <tr key={model.model}>
                        <td>{model.model}</td>
                        <td>
                          <input
                            type="number"
                            placeholder={'Tilgjengelige: ' + model.max}
                            onChange={e => {
                              if (e.target.value > model.max) {
                                alert('Maks tilgjengelig antall er: ' + model.max);
                                e.target.value = model.max;
                              }
                              this.bike[model.model] = e.target.value;
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="col-6">
                <Table striped bordered hover>
                  <tbody>
                    {this.distinctEquipmentModels.map(model => (
                      <tr key={model.model}>
                        <td>{model.model}</td>
                        <td>
                          <input
                            type="number"
                            placeholder={'Tilgjengelige: ' + model.max}
                            onChange={e => {
                              if (e.target.value > model.max) {
                                alert('Maks tilgjengelig antall er: ' + model.max);
                                e.target.value = model.max;
                              }
                              this.equipment[model.model] = e.target.value;
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Card>
          <Card title="Annen informasjon">
            <div className="row" hidden={this.props.hide}>
              <div className="col-8">
                <Table striped bordered hover>
                  <tbody>
                    <tr>
                      <td>
                        <label>Fra-dato</label>
                      </td>
                      <td>
                        <input
                          type="date"
                          onChange={e => {
                            this.orderInformation['fromDate'] = e.target.value;
                            this.updateAvailableDate();
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Til-dato</label>
                      </td>
                      <td>
                        <input
                          type="date"
                          onChange={e => {
                            this.orderInformation['toDate'] = e.target.value;
                            this.updateAvailableDate();
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Hentested</label>
                      </td>
                      <td>
                        <input type="text" onChange={e => (this.orderInformation['pickupLocation'] = e.target.value)} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label>Avleveringssted</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          onChange={e => (this.orderInformation['dropoffLocation'] = e.target.value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="col-4">
                <button
                  onClick={() => {
                    this.order.push(this.bike);
                    this.order.push(this.equipment);
                    this.order.push(this.orderInformation);
                    this.selectedOption
                      ? this.props.sendStateToParent([this.order, this.selectedOption.value])
                      : alert('fyll ut data');
                  }}
                >
                  videre
                </button>
                {/*send in all the state thats been made on this page here*/}
              </div>
            </div>
          </Card>
        </Card>
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
      this.options = this.temporaryOptions;
    });
    storageService.getDistinctBikeModel(result => {
      this.distinctBikeModels = result;
    });
    storageService.getDistinctEquipmentModel(result => {
      this.distinctEquipmentModels = result;
    });
  }

  updateAvailableDate() {
    if (typeof this.orderInformation.toDate != 'undefined' && typeof this.orderInformation.fromDate != 'undefined') {
      storageService.getCountBikeModel(this.orderInformation.fromDate, this.orderInformation.toDate, result => {
        this.distinctBikeModels = result;
      });
      storageService.getCountEquipmentModel(this.orderInformation.fromDate, this.orderInformation.toDate, result => {
        console.log(result);
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
            <Card title="Tillegs Info">test</Card>
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
