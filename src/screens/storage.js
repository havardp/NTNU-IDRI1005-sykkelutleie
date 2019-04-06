import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//node modules
import ReactLoading from 'react-loading';
import arraySort from 'array-sort';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddModel, AddBike } from '../components/addproducts.js';
import { AddReparation } from '../components/addReparation.js';

//Imports for sql queries
import { storageService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Storage extends Component {
  bikes = null;
  equipment = null;
  modal = false;
  sortedByBike = 'chassis_id';
  sortedByEq = 'eq_id';
  render() {
    return (
      <>
        <h3 align="center">Sykler</h3>
        <VerticalTableComponent
          tableBody={this.bikes}
          tableHead={'storage'}
          deleteButton={true}
          delete={this.deleteBike}
          whereTo={this.props.match.path}
          sort={this.sortBike}
          className={'clickable'}
        />
        <h3 align="center">Utstyr</h3>
        <VerticalTableComponent
          tableBody={this.equipment}
          tableHead={'storage'}
          deleteButton={true}
          delete={this.deleteEquipment}
          whereTo={this.props.match.path}
          sort={this.sortEquipment}
          className={'clickable'}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        {this.modal && <AddModel modal={true} toggle={this.toggleModal} />}
      </>
    );
  }
  mounted() {
    storageService.getModels(models => {
      this.bikes = models[0];
      this.equipment = models[1];
    });
  }
  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }

  sortBike(sort) {
    if (sort == this.sortedByBike) {
      arraySort(this.bikes, sort, { reverse: true });
      this.sortedByBike = '';
    } else {
      arraySort(this.bikes, sort);
      this.sortedByBike = sort;
    }
  }
  sortEquipment(sort) {
    if (sort == this.sortedByEq) {
      arraySort(this.equipment, sort, { reverse: true });
      this.sortedByEq = '';
    } else {
      arraySort(this.equipment, sort);
      this.sortedByEq = sort;
    }
  }

  deleteBike(id, index) {
    if (this.bikes[index].countBikes != 0) {
      alert('Du må slette alle syklene av denne modellen først');
    } else if (window.confirm('Er du sikker på at du vil slette denne modellen?'))
      storageService.deleteModel(id, () => this.mounted());
  }
  deleteEquipment(id, index) {
    if (this.equipment[index].countEquipment != 0) {
      alert('Du må slette alt utstyret av denne modellen først');
    } else if (window.confirm('Er du sikker på at du vil slette denne modellen?'))
      storageService.deleteModel(id, () => this.mounted());
  }
}

//turn the two returns into one conditional TODO
export class StorageDetails extends Component {
  bike = null;
  equipment = null;
  tablehead = '';
  sortedBy = 'model';

  render() {
    if (this.bike)
      return (
        <>
          <VerticalTableComponent
            tableBody={this.bike ? this.bike : []}
            tableHead={'bike'}
            deleteButton={true}
            delete={this.delete}
            whereTo={'/bikedetails'}
            sort={this.sort}
            className={'clickable'}
          />
          <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
            &#10010; Legg til
          </button>
          {this.modal && (
            <AddBike
              modal={true}
              toggle={this.toggleModal}
              bikeDetails={this.bike[0]}
              model={this.props.match.params.id}
            />
          )}
        </>
      );
    else if (this.equipment)
      return (
        <>
          <VerticalTableComponent
            tableBody={this.equipment ? this.equipment : []}
            tableHead={'equipment'}
            deleteButton={true}
            delete={this.delete}
            sort={this.sort}
          />
          <button className="btn btn-info btn-lg" onClick={this.addEquipment}>
            &#10010;
          </button>
        </>
      );
    else return null;
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

  sort(sort) {
    if (this.bike) {
      if (sort == this.sortedBy) {
        arraySort(this.bike, sort, { reverse: true });
        this.sortedBy = '';
      } else {
        arraySort(this.bike, sort);
        this.sortedBy = sort;
      }
    } else {
      if (sort == this.sortedBy) {
        arraySort(this.equipment, sort, { reverse: true });
        this.sortedBy = '';
      } else {
        arraySort(this.equipment, sort);
        this.sortedBy = sort;
      }
    }
  }

  addEquipment() {
    storageService.addEquipment(this.props.match.params.id, () => {
      storageService.getEquipment(this.props.match.params.id, result => {
        this.equipment = result;
      });
    });
  }

  delete(id) {
    if (this.bike) {
      if (
        window.confirm(
          'Er du sikker på at du vil slette denne sykkelen? Den vil bli fjernet fra alle orderne, reparasjoner og transportering.'
        )
      )
        storageService.deleteBike(id, () => this.mounted());
    } else {
      if (
        window.confirm(
          'Er du sikker på at du vil slette dette utstyret? Den vil bli fjernet fra alle orderne, reparasjoner og transportering.'
        )
      )
        storageService.deleteEquipment(id, () => this.mounted());
    }
  }
}

export class BikeDetails extends Component {
  bike = null;
  modal = false;
  editable = false;

  render() {
    if (!this.bike)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Sykkelinformasjon">
          <HorizontalTableComponent
            tableBody={this.bike}
            tableHead={'bikeDetails'}
            editable={this.editable}
            sendStateToParent={this.updateBike}
          />
          <button onClick={() => (this.editable ? (this.editable = false) : (this.editable = true))}>
            &#57604; Endre
          </button>
          <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
            Reparasjon &#10010;
          </button>
          {this.modal && <AddReparation modal={true} toggle={this.toggleModal} chassisId={this.props.match.params} />}
        </Card>
      </>
    );
  }
  mounted() {
    storageService.getBikeDetails(this.props.match.params.id, result => {
      this.bike = result;
    });
  }

  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }

  updateBike(value, key) {
    storageService.updateBike(key, value, this.props.match.params.id, () => console.log('Bike endret'));
  }
}
