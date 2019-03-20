import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';

//Imports for sql queries
import { storageService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class StorageStatus extends Component {
  bikestatus = [];
  equipmentstatus = [];
  render() {
    return (
      <div className="main">
        <Card title="LAGERSTATUS" />
        <Card title="Sykler">
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Modell</td>
                <td>Beskrivelse</td>
                <td>Timepris</td>
                <td>Dagpris</td>
                <td>Antall</td>
              </tr>
            </thead>
            <tbody>
              {this.bikestatus.map(product_type => (
                <tr key={product_type.model} onClick={() => history.push('/bikedetails/' + product_type.model)}>
                  <td>{product_type.model}</td>
                  <td>{product_type.description}</td>
                  <td>{product_type.hour_price}</td>
                  <td>{product_type.day_price}</td>
                  <td>{product_type.countBikes}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card title="Utstyr">
          <Table striped bordered hover>
            <thead>
              <tr>
                <td>Modell</td>
                <td>Beskrivelse</td>
                <td>Timepris</td>
                <td>Dagpris</td>
                <td>Antall</td>
              </tr>
            </thead>
            <tbody>
              {this.equipmentstatus.map(product_type => (
                <tr key={product_type.model} onClick={() => history.push('/equipmentdetails/' + product_type.model)}>
                  <td>{product_type.model}</td>
                  <td>{product_type.description}</td>
                  <td>{product_type.hour_price}</td>
                  <td>{product_type.day_price}</td>
                  <td>{product_type.countEquipment}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    );
  }
  mounted() {
    storageService.getBikeModels(bikestatus => {
      this.bikestatus = bikestatus;
    });

    {
      storageService.getEquipmentModels(equipmentstatus => {
        this.equipmentstatus = equipmentstatus;
      });
    }
  }
}
