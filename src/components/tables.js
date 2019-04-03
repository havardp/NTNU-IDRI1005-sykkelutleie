import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//contentEditable="true" gjør tablen editable

//Reusable table component, which takes in an array for the table head, and an array of objects for the table body.
export class VerticalTableComponent extends Component {
  //props:
  //deleteButton: whether to display a functional delete button at the end of each row in the table.
  //delete: callback to parent function with id's as an argument to be able to delete the row wwith an sql query
  //tableBody : arrays/objects with the information to be displayed in the table
  //tableHead: chooses what to display in the talbhead from the tableHead object in this class, and the sort key decides which value to sort on when clicked

  tableHead = {
    employee: [
      { sort: 'e_id', value: 'Ansatt id' },
      { sort: 'fname', value: 'Fornavn' },
      { sort: 'lname', value: 'Etternavn' },
      { sort: 'e_id', value: 'Fjern' }
    ],
    customer: [
      { sort: 'c_id', value: 'Kunde-id' },
      { sort: 'c_fname', value: 'Fornavn' },
      { sort: 'c_lname', value: 'Etternavn' },
      { sort: 'nrorder', value: 'Antall ordre' },
      { sort: 'c_id', value: 'Fjern' }
    ],
    customersOrder: [
      { sort: 'order_nr', value: 'Ordrenummer' },
      { sort: 'c_id', value: 'Kundenummer' },
      { sort: 'nrbikes', value: 'Antall sykler' },
      { sort: 'nrequipment', value: 'Antall utstyr' }
    ],
    reparation: [
      { sort: 'rep_id', value: 'Reprasjons id' },
      { sort: 'chassis_id', value: 'Ramme id' },
      { sort: 'r_fdate', value: 'Fra-dato' },
      { sort: 'r_tdate', value: 'Til-dato' }
    ],
    storage: [
      { sort: 'model', value: 'Modell' },
      { sort: 'description', value: 'Beskrivelse' },
      { sort: 'hour_price', value: 'Timepris' },
      { sort: 'day_price', value: 'Dagpris' },
      { sort: 'countBikes', value: 'Antall' }
    ],
    bike: [
      { sort: 'chassis_id', value: 'Ramme id' },
      { sort: 'gear', value: 'Gir' },
      { sort: 'wheel_size', value: 'Hjulstørrelse' },
      { sort: 'broken', value: 'Ødelagt' },
      { sort: 'storage', value: 'Tilholdssted' }
    ],
    equipment: [{ sort: 'eq_id', value: 'Utstyr id' }, { sort: 'model', value: 'Modell' }],
    order: [
      { sort: 'order_nr', value: 'Ordrenummer' },
      { sort: 'c_id', value: 'Kundenummer' },
      { sort: 'fullname', value: 'Kundenavn' },
      { sort: 'nrbikes', value: 'Antall sykler' },
      { sort: 'nrequipment', value: 'Antall utstyr' },
      { sort: 'from_date', value: 'Fra-dato' },
      { sort: 'to_date', value: 'Til-dato' },
      { sort: 'order_nr', value: 'Fjern' }
    ],
    orderEquipment: [
      { sort: 'model', value: 'Modell' },
      { sort: 'eq_id', value: 'Utstyrs id' },
      { sort: 'day_price', value: 'Pris' }
    ],
    orderBike: [
      { sort: 'model', value: 'Modell' },
      { sort: 'chassis_id', value: 'Ramme id' },
      { sort: 'day_price', value: 'Pris' }
    ]
  };

  render() {
    if (!this.props.tableBody)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <Table striped bordered hover>
        <thead>
          {/*Loops through the head part of the table which is sent in as an array of text strings from parent component*/}
          <tr className="sortable">
            {this.tableHead[this.props.tableHead].map(tableHead => (
              <td key={tableHead.value} onClick={() => this.props.sort(tableHead.sort)}>
                {tableHead.value}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {/*Loops through an array of objects from the sql queries, the array length will be the number of rows.*/}
          {/*The onclick on the row will send you to the current location plus the id of the row etc("/customers/400100")*/}
          {this.props.tableBody.map(row => (
            <tr
              key={Object.values(row)[0] + Object.values(row)[1].toString()}
              onClick={() => history.push(this.props.whereTo + '/' + Object.values(row)[0])}
              className={this.props.className}
            >
              {/*Loops through the values in the object*/}
              {Object.values(row).map((data, index) => (
                <td key={data + row + index}>{data}</td>
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
    );
  }
}

//Reusable table component, which takes in an array with descriptive strings, and the corresponding object from the sql query.
export class HorizontalTableComponent extends Component {
  //props:
  //checkDate(Doesn't render until the date object from the database has been changed to a string),
  //tableBody: arrays/objects with the information to be displayed in the table
  //tableHead: chooses what to display in the talbhead from the tableHead object in this class

  tableHead = {
    customer: ['Kunde id', 'Fornavn', 'Etternavn', 'Email', 'Telefon', 'Adresse'],
    employee: ['Ansatt id', 'Fornavn', 'Etternavn', 'Avdeling', 'Email', 'Telefon', 'Adresse', 'Fødselsdato'],
    bikeDetails: [
      'Ramme id',
      'Modell',
      'Gir',
      'Hjulstørrelse',
      'Ødelagt',
      'Tilholdssted',
      'Bagasjerett',
      'Beskrivelse',
      'Dagspris'
    ],
    reparationDetails: ['Reparasjons id', 'Ramme id', 'Fra-dato', 'Til-dato', 'Reparasjons kostnad', 'Beskrivelse'],
    order: [
      'Ordrenummer',
      'Ansatt id',
      'Kunde id',
      'Fra-dato',
      'Til-dato',
      'Utleveringsted',
      'Innleveringsted',
      'Totalpris'
    ]
  };

  render() {
    if (!this.props.tableBody)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <Table striped bordered hover>
        <tbody>
          {Object.keys(this.props.tableBody).map((column, index) => (
            <tr key={column}>
              <td>{this.tableHead[this.props.tableHead][index]}</td>
              <td>{this.props.tableBody[column]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
