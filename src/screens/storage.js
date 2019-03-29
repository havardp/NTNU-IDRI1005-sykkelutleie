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

import { AddModel } from '../components/adduser.js';

export class StorageStatus extends Component {
  bikes = null;
  equipment = null;
  modal = false;
  render() {
    if (!this.bikes || !this.equipment)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
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
    storageService.getBikeModels(bikes => {
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
    if (!this.bike && !this.equipment)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    this.tableBody = this.bike ? this.bike : this.equipment;
    this.tableHead = this.bike ? 'bike' : 'equipment';
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
