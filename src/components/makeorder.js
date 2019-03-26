import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';
import Table from 'react-bootstrap/Table';

import Select from 'react-select';

//Imports for sql queries
import { customerService } from '../services';

export class CustomerOrderComponent extends Component {
  temporaryOptions = [];
  options = null;
  selectedOption = null;

  render() {
    if (!this.options) return null;
    return (
      <Card title="Kunde">
        <div className="row">
          <div className="col-10">
            <Select
              value={this.selectedOption}
              onChange={e => {
                this.selectedOption = e;
                this.props.sendStateToParent(e.value);
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
  }
}

export class MakeOrderProductTable extends Component {
  product = [];
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>Modell</td>
            <td>Tilgjengelige</td>
            <td>Antall</td>
          </tr>
        </thead>
        <tbody>
          {this.props.tableBody.map(model => (
            <tr key={model.model}>
              <td>{model.model}</td>
              <td>{model.max}</td>
              <td>
                <select
                  onChange={e => {
                    this.product[model.model] = e.target.value;
                    this.props.sendStateToParent(this.product);
                  }}
                >
                  {this.makeSelect(model.max)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  makeSelect(length) {
    let options = [];
    for (let i = 0; i <= length; i++) {
      options.push(<option key={i}>{i}</option>);
    }
    return options;
  }
}

export class AdditionalDetailsTable extends Component {
  orderInformation = [];
  render() {
    return (
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
                  this.props.sendStateToParent(this.orderInformation);
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
                  this.props.sendStateToParent(this.orderInformation);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Hentested</label>
            </td>
            <td>
              <input
                type="text"
                onChange={e => {
                  this.orderInformation['pickupLocation'] = e.target.value;
                  this.props.sendStateToParent(this.orderInformation);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Avleveringssted</label>
            </td>
            <td>
              <input
                type="text"
                onChange={e => {
                  this.orderInformation['dropoffLocation'] = e.target.value;
                  this.props.sendStateToParent(this.orderInformation);
                }}
              />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
