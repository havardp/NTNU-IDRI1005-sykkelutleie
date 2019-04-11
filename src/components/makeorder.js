import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';
import Table from 'react-bootstrap/Table';

//node module
import Select from 'react-select';

//Imports for sql queries
import { customerService } from '../services';

//components used when making the order in the neworder screen

export class NewOrderCustomer extends Component {
  selectedOption = null;

  temporaryOptions = [];
  searchbarOptions = null;
  temporary = null;

  render() {
    if (!this.props.options) return null;
    return (
      <Card title="Kunde">
        <div className="row">
          <div className="col-10">
            <Select
              value={this.selectedOption}
              placeholder="&#57492; Velg kunde..."
              onChange={e => {
                this.selectedOption = e;
                this.props.sendStateToParent(e.value);
              }}
              options={this.props.options}
            />
          </div>
          <div className="col-2">
            <button className="btn btn-info btn-lg" onClick={this.props.makeNewCustomer}>
              &#57826;
            </button>
          </div>
        </div>
      </Card>
    );
  }
}

export class NewOrderProductSelection extends Component {
  product = [];
  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>Modell</td>
            <td>Dagspris</td>
            <td>Antall(Ledige)</td>
          </tr>
        </thead>
        <tbody>
          {this.props.tableBody.map(model => (
            <tr key={model.model}>
              <td>{model.model}</td>
              <td>{model.day_price}kr</td>
              <td>
                <select
                  id={model.model}
                  value={this.props.products[model.model] ? this.props.products[model.model][0] : 0}
                  onChange={e => {
                    this.product[model.model] = [e.target.value, model.day_price];
                    this.props.sendStateToParent(this.product);
                  }}
                >
                  {this.makeSelect(model.max)}
                </select>
                ({model.max})
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

export class NewOrderAdditionalDetails extends Component {
  orderInformation = [];

  //Variables used to set the minimum date to the current date
  date = new Date();
  day = this.date.getDate().toString().length == 1 ? '0' + this.date.getDate() : this.date.getDate();
  month =
    (this.date.getMonth() + 1).toString().length == 1 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1;
  year = this.date.getFullYear();
  date = this.year + '-' + this.month + '-' + this.day;
  fromDate = '';
  toDate = '';

  render() {
    return (
      <>
        <div className="col-6">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <label>Fra-dato</label>
                </td>
                <td>
                  <input
                    required
                    type="date"
                    min={this.date}
                    onChange={e => {
                      this.orderInformation['fromDate'] = e.target.value;
                      this.fromDate = new Date(this.orderInformation['fromDate']);
                      this.toDate = new Date(this.orderInformation['toDate']);
                      this.orderInformation['nrDays'] = Math.ceil(
                        Math.abs(this.toDate.getTime() - this.fromDate.getTime() + 1) / (1000 * 3600 * 24)
                      );
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
                    required
                    type="date"
                    min={this.orderInformation['fromDate']}
                    onChange={e => {
                      this.orderInformation['toDate'] = e.target.value;
                      this.fromDate = new Date(this.orderInformation['fromDate']);
                      this.toDate = new Date(this.orderInformation['toDate']);
                      this.orderInformation['nrDays'] = Math.ceil(
                        Math.abs(this.toDate.getTime() - this.fromDate.getTime() + 1) / (1000 * 3600 * 24)
                      );
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="col-6">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>
                  <label>Hentested</label>
                </td>
                <td>
                  <select
                    required
                    value={this.orderInformation['pickupLocation'] || ''}
                    onChange={e => {
                      this.orderInformation['pickupLocation'] = e.target.value;
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  >
                    <option value="" hidden>
                      Velg sted...
                    </option>
                    {this.props.pickup.map(location => (
                      <option key={location.l_name}>{location.l_name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Avleveringssted</label>
                </td>
                <td>
                  <select
                    required
                    value={this.orderInformation['dropoffLocation'] || ''}
                    onChange={e => {
                      this.orderInformation['dropoffLocation'] = e.target.value || null;
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  >
                    <option value="" hidden>
                      Velg sted...
                    </option>
                    {this.props.dropoff.map(location => (
                      <option key={location.l_name}>{location.l_name}</option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Rabatt %</td>
                <td>
                  <input
                    required
                    placeholder="0%"
                    defaultValue="0"
                    type="number"
                    onChange={e => {
                      this.orderInformation['rabat'] = e.target.value;
                      this.props.sendStateToParent(this.orderInformation);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </>
    );
  }
}
