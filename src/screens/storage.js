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
  tableHeadB = ['Modell', 'Beskrivelse', 'Timepris', 'Dagpris', 'Antall'];
  tableHeadE = ['Modell', 'Beskrivelse', 'Timepris', 'Dagpris', 'Antall'];
  modal = false

  render() {
      if (!this.bikes) return null
      if (!this.equipment) return null
      return(
        <div className="main">
        <VerticalTableComponent
          tableBody={this.bikes}
          tableHead={this.tableHeadB}
          deleteButton={true}
          delete={this.delete}
          />
          <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
            &#10010;
          </button>
          <VerticalTableComponent
            tableBody={this.equipment}
            tableHead={this.tableHeadE}
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

 /*
 export class BikeDetail extends Component {
   Allbikes = [];
   render() {
     return (
       <div className="main">
         <Card title={this.props.match.params.id}>
           <Table striped bordered hover responsive>
             <thead>
               <tr>
                 <td>Chassis id</td>
                 <td>Gir</td>
                 <td>Hjulstørrelse</td>
                 <td>Rep.dato</td>
                 <td>Ødelagt</td>
                 <td>Lokasjon</td>
                 <td>Tilholdssted</td>
                 <td>Bagasjebrett</td>
               </tr>
             </thead>
             <tbody>
               {this.Allbikes.map(bike => (
                 <tr key={bike.chassis_id}>
                   <td>{bike.chassis_id}</td>
                   <td>{bike.gear}</td>
                   <td>{bike.wheel_size}</td>
                   <td>{bike.rep_date}</td>
                   <td>{bike.broken}</td>
                   <td>{bike.location}</td>
                   <td>{bike.storage}</td>
                   <td>{bike.luggage}</td>
                   <td>
                     <button>&#9881;</button>
                   </td>
                   <td>
                     <button>&#10004;</button>
                   </td>
                 </tr>
               ))}
               <tr>
                 <td>
                   <button className="btn btn-info btn-lg" onClick={() => history.push('/bike/add')}>&#10010;</button>
                 </td>
               </tr>
             </tbody>
           </Table>
         </Card>
       </div>
     );
   }

   mounted() {
     storageService.getBike(this.props.match.params.id, result => {
       this.Allbikes = result;
     });
   }
 }


 export class EquipmentDetail extends Component {
   name = {
     eq_id: ' ',
     model: ' '
   };
   Allequipment = [];
   render() {
     return (
       <div className="main">
         <Card title={this.props.match.params.id}>
           <Table striped bordered hover responsive>
             <thead>
               <tr>
                 <td>Utstyrs-id</td>
                 <td>Modell</td>
               </tr>
             </thead>
             <tbody>
               {this.Allequipment.map(equipment => (
                 <tr key={equipment.eq_id}>
                   <td>{equipment.eq_id}</td>
                   <td>{equipment.model}</td>
                   <td>
                     <button>&#9881;</button>
                   </td>
                   <td>
                     <button>&#10004;</button>
                   </td>
                 </tr>
               ))}
               <tr>
                 <td>
                   <button className="btn btn-info btn-lg">&#10010;</button>
                 </td>
               </tr>
             </tbody>
           </Table>
         </Card>
       </div>
     );
   }

   mounted() {
     storageService.getEquipment(this.props.match.params.id, result => {
       this.Allequipment = result;
     });
   }
 }
*/
