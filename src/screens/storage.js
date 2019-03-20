import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { storageService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class StorageStatus extends Component {
  bikes = null;
  equipment = null;
  tableHead = ['Modell', 'Beskrivelse', 'Timepris', 'Dagpris', 'Antall'];

  render() {
    if (!this.bikes) return null;
    if (!this.equipment) return null;
    return (
      <div className="main">
        <VerticalTableComponent
          tableBody={this.bikes}
          tableHead={this.tableHead}
          deleteButton={true}
          delete={this.delete}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        <VerticalTableComponent
          tableBody={this.equipment}
          tableHead={this.tableHead}
          deleteButton={true}
          delete={this.delete}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
      </div>
    );
  }

  mounted() {
    storageService.getBikeModels(bikes => {
      this.bikes = bikes;
    });
    storageService.getEquipmentModels(equipment => {
      this.equipment = equipment;
    });
  }
}
