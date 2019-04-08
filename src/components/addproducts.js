import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormCheck from 'react-bootstrap/FormCheck';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//Imports for sql queries
import { storageService, locationService } from '../services';

export class AddModel extends Component {
  model = [];
  submitting = false;
  bike = null;
  bikeDetails = [];
  location = ['Haugastøl', 'Finse'];

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
                <Form.Group as={Col}>
                  <Form.Label>Dagspris</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="X kr"
                    onChange={e => (this.model.day_price = e.target.value)}
                  />
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
              {this.bike == 1 && (
                <>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>Antall gir</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Gir"
                        onChange={e => (this.bikeDetails.gear = e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Hjulstørrelse</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Hjul"
                        onChange={e => (this.bikeDetails.wheel_size = e.target.value)}
                      />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <select
                          onChange={e => {
                            this.bikeDetails.location = e.target.value;
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
                          onChange={e => (this.bikeDetails.luggage = e.target.value)}
                        />{' '}
                        Ja
                      </div>
                      <div>
                        <input
                          type="radio"
                          value="0"
                          name="bikevalue"
                          onChange={e => (this.bikeDetails.luggage = e.target.value)}
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
    if (this.model.model && this.model.description && this.model.day_price) {
      this.submitting = true;
      storageService.addProductType(this.model, this.bike, () => {
        this.bike == 1
          ? storageService.addBike(this.model.model, this.bikeDetails, () => {
              this.submitting = false;
              this.props.toggle();
            })
          : storageService.addEquipment(this.model.model, () => {
              this.submitting = false;
              this.props.toggle();
            });
      });
    } else {
      alert('Du må fylle inn alle feltene');
    }
  }
}
export class AddBike extends Component {
  bikeDetails = [];
  submitting = false;
  location = null;
  render() {
    if (this.submitting || !this.location)
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
                <Form.Group>
                  <select
                    required
                    value={this.bikeDetails.location || ''}
                    onChange={e => {
                      this.bikeDetails.location = e.target.value;
                    }}
                  >
                    <option hidden value="">
                      Velg sted...
                    </option>
                    {this.location.map(location => (
                      <option key={location.l_name}>{location.l_name}</option>
                    ))}
                  </select>
                </Form.Group>
              </Form.Row>
              <Button variant="outline-primary" type="submit" onClick={this.add}>
                Legg til
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  mounted() {
    locationService.getPickupLocation(location => {
      this.location = location;
    });
    this.bikeDetails = JSON.parse(JSON.stringify(this.props.bikeDetails)); //deep copy
    this.bikeDetails.location = null;
  }

  add() {
    if (this.bikeDetails.location) {
      this.submitting = true;
      storageService.addBike(this.props.model, this.bikeDetails, () => {
        this.submitting = false;
        this.props.toggle();
      });
    }
  }
}
