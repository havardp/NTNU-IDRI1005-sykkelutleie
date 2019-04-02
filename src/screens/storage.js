import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { storageService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

import { AddModel, AddBike, AddReparation } from '../components/adduser.js';

export class StorageStatus extends Component {
  bikes = null;
  equipment = null;
  modal = false;
  render() {
    return (
      <>
        <h3 align="center">Sykler</h3>
        <VerticalTableComponent
          tableBody={this.bikes}
          tableHead={'storage'}
          deleteButton={false}
          delete={this.delete}
          whereTo={history.location.pathname}
        />
        <h3 align="center">Utstyr</h3>
        <VerticalTableComponent
          tableBody={this.equipment}
          tableHead={'storage'}
          deleteButton={false}
          delete={this.delete}
          whereTo={history.location.pathname}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        {this.modal && <AddModel modal={true} toggle={this.toggleModal} />}
      </>
    );
  }
  mounted() {
    storageService.getModels(bikes => {
      this.bikes = bikes;
    });
    storageService.getEquipmentModels(equipment => {
      this.equipment = equipment;
    });
  }
  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }
}

//turn the two returns into one conditional TODO
export class StorageDetails extends Component {
  bike = null;
  equipment = null;
  tablehead = '';

  render() {
    this.tableBody = this.bike ? this.bike : this.equipment;
    this.tableHead = this.bike ? 'bike' : 'equipment';
    return (
      <>
        <VerticalTableComponent
          tableBody={this.tableBody}
          tableHead={this.tableHead}
          deleteButton={false}
          delete={this.delete}
          whereTo={'/bikedetails'}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        {this.modal && <AddBike modal={true} toggle={this.toggleModal} />}
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
  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }
}

export class BikeDetails extends Component {
  bike = null;


  render() {
    if (!this.bike)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Sykkelinformasjon">
          <HorizontalTableComponent tableBody={this.bike} tableHead={'bikeDetails'} />
          <button onClick={() => console.log('test')}>&#9881;</button>
          <button>&#10004;</button>
        </Card>
      </>
    );
  }
  mounted() {
    storageService.getBikeDetails(this.props.match.params.id, result => {
      this.bike = result;
    });
  }
}
