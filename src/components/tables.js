import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//node modules
import ReactLoading from 'react-loading';

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
      { sort: 'rep_id', value: 'Reparasjons id' },
      { sort: 'chassis_id', value: 'Ramme id' },
      { sort: 'r_fdate', value: 'Fra-dato' },
      { sort: 'r_tdate', value: 'Til-dato' }
    ],
    transportations: [
      { sort: 't_id', value: 'Transport id' },
      { sort: 'order_nr', value: 'Ordrenummer' },
      { sort: 'chassis_id', value: 'Ramme id' },
      { sort: 'storage', value: 'Transporteres fra' },
      { sort: 'to_place', value: 'Transporteres til' },
      { sort: 't_id', value: 'Bestill transport' }
    ],
    storage: [
      { sort: 'model', value: 'Modell' },
      { sort: 'description', value: 'Beskrivelse' },
      { sort: 'day_price', value: 'Dagpris' },
      { sort: 'countBikes', value: 'Antall' },
      { sort: 'model', value: 'Fjern' }
    ],
    bike: [
      { sort: 'chassis_id', value: 'Ramme id' },
      { sort: 'gear', value: 'Gir' },
      { sort: 'wheel_size', value: 'Hjulstørrelse' },
      { sort: 'stolen', value: 'Stjelt' },
      { sort: 'storage', value: 'Tilholdssted' },
      { sort: 'luggage', value: 'Baggasje' },
      { sort: 'chassis_id', value: 'Fjern' }
    ],
    equipment: [
      { sort: 'eq_id', value: 'Utstyr id' },
      { sort: 'model', value: 'Modell' },
      { sort: 'eq_id', value: 'Fjern' }
    ],
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
      { sort: 'day_price', value: 'Dags pris' }
    ],
    orderBike: [
      { sort: 'model', value: 'Modell' },
      { sort: 'chassis_id', value: 'Ramme id' },
      { sort: 'day_price', value: 'Dags pris' }
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
            {this.tableHead[this.props.tableHead].map(tableHead =>
              tableHead.value != 'Fjern' ||
              sessionStorage.getItem('role') == 'Admin' ||
              sessionStorage.getItem('role') == 'Sektretær' ? (
                <td key={tableHead.value} onClick={() => this.props.sort(tableHead.sort)}>
                  {tableHead.value}
                </td>
              ) : null
            )}
          </tr>
        </thead>
        <tbody>
          {/*Loops through an array of objects from the sql queries, the array length will be the number of rows.*/}
          {/*The onclick on the row will send you to the current location plus the id of the row etc("/customers/400100")*/}
          {this.props.tableBody.map(row => (
            <tr
              key={Object.values(row)[0] + Object.values(row)[1].toString()}
              onClick={() => {
                this.props.whereTo
                  ? history.push(this.props.whereTo + '/' + Object.values(row)[0])
                  : console.log('nowhere to go');
              }}
              className={this.props.className}
            >
              {/*Loops through the values in the object*/}
              {Object.values(row).map((data, index) => (
                <td key={data + row + index}>{data}</td>
              ))}
              {/*Add a delete button at the end of the row if its sent in as true from parent component*/}
              {(sessionStorage.getItem('role') == 'Admin' || sessionStorage.getItem('role') == 'Sekretær') &&
                this.props.deleteButton && (
                  <td>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        this.props.delete(Object.values(row)[0]);
                      }}
                    >
                      &#57610;
                    </button>
                  </td>
                )}{this.props.transportation && (
                    <td>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          this.props.transport(Object.values(row)[0]);
                        }}
                      >
                    &#9951;
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
  temporaryEdit = {};
  tableHead = {
    customer: ['Kunde id', 'Fornavn', 'Etternavn', 'Email', 'Telefon', 'Adresse'],
    employee: ['Ansatt id', 'Fornavn', 'Etternavn', 'Avdeling', 'Email', 'Telefon', 'Adresse', 'Fødselsdato'],
    bikeDetails: ['Ramme id', 'Modell', 'Gir', 'Hjulstørrelse', 'Status', 'Tilholdssted', 'Bagasjerett'],
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
              <td
                contentEditable={this.props.editable}
                suppressContentEditableWarning={true}
                onInput={e => {
                  this.temporaryEdit[Object.keys(this.props.tableBody)[index]] = this.editableValue =
                    e.target.textContent;
                }}
              >
                {this.props.tableBody[column]}
              </td>
              {this.props.editable && (
                <td>
                  <button
                    onClick={() =>
                      this.props.sendStateToParent(
                        this.temporaryEdit[Object.keys(this.props.tableBody)[index]],
                        Object.keys(this.props.tableBody)[index]
                      )
                    }
                  >
                    &#57605; Lagre
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
