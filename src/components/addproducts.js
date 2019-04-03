import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { Radio, ControlLabel, ButtonGroup } from 'react-bootstrap';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

import { Customers, Employees } from '../components/adduser.js';

//Imports for sql queries
import { customerService, employeeService, storageService, reparationService } from '../services';

export class AddModel extends Component {
  model = {};
  submitting = false;
  bike = null;
  bikeDetails = [];
  location = ['Haugastøl', 'Finse'];

  render() {
    console.log(this.model);
    console.log(this.bike);
    if (this.submitting)
      return (
        <Modal show={this.props.modal} onHide={this.props.toggle} centered>
          <Modal.Body>
            <ReactLoading type="spin" className="logging fade-in" color="#A9A9A9" height={200} width={200} />
          </Modal.Body>
        </Modal>
      );

    return (
      <div>
        <Modal show={this.props.modal} onHide={this.props.toggle} centered>
          <Modal.Body>
            <Form>
              <div>
                <input type="radio" value="1" name="modeltype" onChange={e => (this.bike = e.target.value)} /> Sykkel
              </div>
              <div>
                <input type="radio" value="0" name="modeltype" onChange={e => (this.bike = e.target.value)} /> Utstyr
              </div>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Modell</Form.Label>
                  <Form.Control type="text" placeholder="Navn" onChange={e => (this.model.model = e.target.value)} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Beskrivelse</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tekst"
                    onChange={e => (this.model.description = e.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Timepris</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="X kr"
                    onChange={e => (this.model.hour_price = e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Dagspris</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="X kr"
                    onChange={e => (this.model.day_price = e.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              {this.bike == 1 && (
                <>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Antall gir</Form.Label>
                      <Form.Control type="number" placeholder="Gir" onChange={e => (this.bike.gear = e.target.value)} />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Hjulstørrelse</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Hjul"
                        onChange={e => (this.bike.wheel_size = e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <select
                          onChange={e => {
                            this.bikeDetails.locations = e.target.value;
                            console.log(this.bikeDetails);
                          }}
                        >
                          <option hidden>Velg sted...</option>
                          {this.location.map(location => (
                            <option key={location}>{location}</option>
                          ))}{' '}
                        </select>
                      </Form.Label>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Bagasjebrett: </Form.Label>
                      <div>
                        <input
                          type="radio"
                          value="1"
                          name="bikevalue"
                          onChange={e => (this.bikeDetails = e.target.value)}
                        />{' '}
                        Ja
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="0"
                          name="bikevalue"
                          onChange={e => (this.bikeDetails = e.target.value)}
                        />{' '}
                        Nei
                      </div>
                    </Form.Group>
                  </Form.Row>
                </>
              )}
              <Button variant="outline-primary" onClick={this.add}>
                Legg til
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  add() {
    console.log(this.bike.location);
    if (this.model.model && this.model.description && this.model.hour_price && this.model.day_price) {
      this.submitting = true;
      storageService.addProductType(this.model, this.bike, () => console.log('success'));
    } else {
      alert('Du må fylle inn alle feltene');
    }
  }
}
export class AddBike extends Component {
  bike = [];
  submitting = false;
  render() {
    if (this.submitting)
      return (
        <Modal show={this.props.modal} onHide={this.props.toggle} centered>
          <Modal.Body>
            <ReactLoading type="spin" className="logging fade-in" color="#A9A9A9" height={200} width={200} />
          </Modal.Body>
        </Modal>
      );

    return (
      <div>
        <Modal show={this.props.modal} onHide={this.props.toggle} centered>
          <Modal.Body>
            <Form>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Antall gir</Form.Label>
                  <Form.Control type="number" placeholder="Gir" onChange={e => (this.bike.gear = e.target.value)} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Hjulstørrelse</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Hjul"
                    onChange={e => (this.bike.wheel_size = e.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Lagersted (nedtrekksboks)</Form.Label>
                  <Form.Control type="text" placeholder="Sted" onChange={e => (this.bike.storage = e.target.value)} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Bagasjebrett: Ja eller nei?</Form.Label>
                  <Form.Control type="text" placeholder="Brett" onChange={e => (this.bike.luggage = e.target.value)} />
                </Form.Group>
              </Form.Row>
              <Button variant="outline-primary" onClick={this.add}>
                Legg til
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  add() {
    if (this.bike.gear && this.bike.wheel_size && this.bike.storage && this.bike.luggage) {
      this.submitting = true;
    } else {
      alert('Du må fylle inn alle feltene');
    }
  }
}
