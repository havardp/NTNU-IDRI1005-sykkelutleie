import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';
import Table from 'react-bootstrap/Table';

export class ConfirmOrderProducts extends Component {
  tableHead = { products: ['Modell', 'Antall', 'Pris'] };

  render() {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            {this.tableHead[this.props.tableHead].map(data => (
              <td key={data}>{data}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.tableBody).map((data, index) => (
            <tr key={data}>
              <td>{data}</td>
              <td>{this.props.tableBody[data][0]}</td>
              <td>{this.props.tableBody[data][1] * this.props.tableBody[data][0]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export class ConfirmOrderAdditionalDetails extends Component {
  tableHeadAdditional = {
    pickupLocation: 'Hentested',
    dropoffLocation: 'Avleveringssted',
    fromDate: 'Fra-dato',
    toDate: 'Til-dato',
    nrDays: 'Antall dager',
    totalPrice: 'Total pris',
    rabat: 'Rabatt (%)'
  };

  render() {
    return (
      <Table striped bordered hover>
        <tbody>
          {Object.keys(this.tableHeadAdditional).map(data => (
            <tr key={data}>
              <td>{this.tableHeadAdditional[data]}</td>
              <td>{this.props.tableBody[data]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
