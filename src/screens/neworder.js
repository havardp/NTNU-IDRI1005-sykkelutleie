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

//callback to parent component which saves state and trasfers it to sibling aswell
class MakeOrder extends Component {
  //view variables
  distinctBikeModels = null;
  distinctEquipmentModels = null;
  selectedOption = null;
  options = null;
  modal = false;
  temporaryOptions = [];
  obj = { name: 'test' };

  //variables to be used in order
  activeCustomer = null;

  render() {
    if (!this.distinctBikeModels || !this.distinctEquipmentModels)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    console.log(this.selectedOption);
    return (
      <>
        <div className="row">
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

        <div className="row">
          <div className="col-6">
            <Card title="Sykkel" style={{ width: '100%', height: '100%' }}>
              {this.distinctBikeModels.map(model => (
                <div key={model.model}>
                  {Object.values(model).map((data, index) => (
                    <div key={data + model + index}>
                      {data} <input type="number" defaultValue="0" />
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
                      {data} <input type="number" defaultValue="0" />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </div>
        </div>
        <div className="row">
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
              <button onClick={() => history.push('/neworder2')}>videre</button>
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
              onClick={() => (this.confirmationPage = true)}
            >
              Bekreft ordre
            </Button>
          </div>
        </div>
        {!this.confirmationPage && <MakeOrder />}
        {this.confirmationPage && <ConfirmOrder />}
      </>
    );
  }
}

class ConfirmOrder extends Component {
  render() {
    return <div>test</div>;
  }
}
