import * as React from 'react';
import { Component } from 'react-simplified';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

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
    if (!this.bikes || !this.equipment)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <VerticalTableComponent
          tableBody={this.bikes}
          tableHead={this.tableHead}
          deleteButton={false}
          delete={this.delete}
          whereTo={history.location.pathname}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        <VerticalTableComponent
          tableBody={this.equipment}
          tableHead={this.tableHead}
          deleteButton={false}
          delete={this.delete}
          whereTo={history.location.pathname}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
      </>
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

//turn the two returns into one conditional TODO
export class StorageDetails extends Component {
  bike = null;
  equipment = null;
  tableHeadBike = ['Ramme id', 'Gir', 'Hjulstørrelse', 'Ødelagt', 'Lokasjon', 'Tilholdssted', 'Bagasjerett'];
  tableHeadEquipment = ['Utstyr id', 'Modell'];

  render() {
    if (!this.bike && !this.equipment)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    this.tableBody = this.bike ? this.bike : this.equipment;
    this.tableHead = this.bike ? this.tableHeadBike : this.tableHeadEquipment;
    return (
      <>
        <VerticalTableComponent
          tableBody={this.tableBody}
          tableHead={this.tableHead}
          deleteButton={false}
          delete={this.delete}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
      </>
    );
  }
  mounted() {
    storageService.getBike(this.props.match.params.id, result => {
      this.bike = result;
    });
    storageService.getEquipment(this.props.match.params.id, result => {
      this.equipment = result;
    });
  }
}
