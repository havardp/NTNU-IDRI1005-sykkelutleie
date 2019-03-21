import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//Reusable table component, which takes in an array for the table head, and an array of objects for the table body.
export class VerticalTableComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <Table striped bordered hover>
          <thead>
            {/*Loops through the head part of the table which is sent in as an array of text strings from parent component*/}
            <tr>
              {this.props.tableHead.map(tableHead => (
                <td key={tableHead}>{tableHead}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {/*Loops through an array of objects from the sql queries, the array length will be the number of rows.*/}
            {/*The onclick on the row will send you to the current location plus the id of the row etc("/customers/400100")*/}
            {this.props.tableBody.map(row => (
              <tr
                key={Object.values(row)[0]}
                onClick={() => {
                  history.push(history.location.pathname + '/' + Object.values(row)[0]);
                }}
              >
                {/*Loops through the values in the object*/}
                {Object.values(row).map(data => (
                  <td key={data}>{data}</td>
                ))}
                {/*Add a delete button at the end of the row if its sent in as true from parent component*/}
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

//Reusable table component, which takes in an array with descriptive strings, and the corresponding object from the sql query.
export class HorizontalTableComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //Won't render anything until the date object from the sql query has been changed to a string of numbers, to avoid errors.
    if (
      typeof this.props.tableBody.DOB === 'object' ||
      typeof this.props.tableBody.from_date === 'object' ||
      typeof this.props.tableBody.to_date === 'object'
    )
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
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
