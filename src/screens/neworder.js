import * as React from 'react';
import { Component } from 'react-simplified';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//Bootstrap imports
import { Card } from '../widgets';
import Button from 'react-bootstrap/Button';

//Imports for sql queries
import { storageService, orderService, customerService } from '../services';

import { AddCustomer } from '../components/adduser.js';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';
import Select from 'react-select';

//using hacky solution hidden on makeorder render when on confirmationpage to not have to rerender and lose states
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
  order = [];

  render() {
    if (!this.distinctBikeModels || !this.distinctEquipmentModels)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    if (this.selectedOption) console.log(this.selectedOption.value);
    console.log(this.props.hide);
    return (
      <>
        <div className="row" hidden={this.props.hide}>
          <div className="col-10">
            <Card title="Eksisterende kunde">
              <Select
                value={this.selectedOption}
                onChange={e => {
                  this.selectedOption = e;
                  this.activeCustomer = e.value;
                }}
                options={this.options}
              />
            </Card>
          </div>
          <div className="col-2">
            <Card title="Ny kunde">
              <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
                &#10010;
              </button>
            </Card>
          </div>
        </div>

        <div className="row" hidden={this.props.hide}>
          <div className="col-6">
            <Card title="Sykkel" style={{ width: '100%', height: '100%' }}>
              {this.distinctBikeModels.map(model => (
                <div key={model.model}>
                  {Object.values(model).map((data, index) => (
                    <div key={data + model + index}>
                      {data}{' '}
                      <input type="number" defaultValue="0" onChange={e => (this.order[data] = e.target.value)} />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </div>
          <div className="col-6">
            <Card title="Utstyr" style={{ width: '100%', height: '100%' }}>
              {this.distinctEquipmentModels.map(model => (
                <div key={model.model}>
                  {Object.values(model).map((data, index) => (
                    <div key={data + index + model}>
                      {data}{' '}
                      <input type="number" defaultValue="0" onChange={e => (this.order[data] = e.target.value)} />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </div>
        </div>
        <div className="row" hidden={this.props.hide}>
          <div className="col-8">
            <Card title="Annen informasjon">
              <div>
                Fra-dato <input type="date" />
              </div>
              <div>
                Til-dato <input type="date" />
              </div>
              <div>
                Hentested <input type="text" />
              </div>
              <div>
                Avleveringssted <input type="text" />
              </div>
            </Card>
          </div>
          <div className="col-4">
            <Card title="Videre">
              <button
                onClick={() =>
                  this.selectedOption
                    ? this.props.sendStateToParent([this.order, this.selectedOption.value])
                    : alert('fyll ut data')
                }
              >
                videre
              </button>
              {/*send in all the state thats been made on this page here*/}
            </Card>{' '}
          </div>
        </div>
        {this.modal && <AddCustomer modal={true} toggle={this.toggleModal} />}
      </>
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

class ConfirmOrder extends Component {
  customer = this.props.recieveStateFromParent[1];
  orderDetails = this.props.recieveStateFromParent[0];
  render() {
    console.log(this.customer, this.orderDetails);
    //render this page with the recieveStateFromParent prop which contains all info from the previous page
    return (
      <>
        <div>kunde id: {this.customer}</div>
        <div>
          {Object.keys(this.orderDetails).map(data => (
            <div key={data}>
              {data} -{this.orderDetails[data]}
            </div>
          ))}
        </div>
      </>
    );
  }
}
