import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//reusable table class with tablehead, tablebody, deletebutton props
export class VerticalTableComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Table striped bordered hover>
          <thead>
            <tr>
              {this.props.tableHead.map(tableHead => (
                <td key={tableHead}>{tableHead}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.tableBody.map(row => (
              <tr
                key={Object.values(row)[0]}
                onClick={() => {
                  history.push(history.location.pathname + '/' + Object.values(row)[0]);
                }}
              >
                {Object.keys(row).map(column => (
                  <td key={row[column]}>{row[column]}</td>
                ))}
                {this.props.deleteButton && (
                  <td>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        this.props.delete(Object.values(row)[0]);
                      }}
                    >
                      X
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}

export class HorizontalTableComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (typeof this.props.tableBody.DOB === 'object') return null;
    //<td>{this.props.tableBody[column]}</td>
    return (
      <>
        <Table striped bordered hover>
          <tbody>
            {Object.keys(this.props.tableBody).map((column, index) => (
              <tr key={column}>
                <td>{this.props.tableHead[index]}</td>
                <td>{this.props.tableBody[column]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}
