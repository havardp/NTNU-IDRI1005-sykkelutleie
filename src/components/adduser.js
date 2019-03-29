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
import { Radio, ControlLabel, ButtonGroup } from 'react-bootstrap';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

import { Customers, Employees } from '../components/adduser.js';

//Imports for sql queries
import { customerService, employeeService, storageService } from '../services';

const bcrypt = require('bcryptjs');
//TODO validering av data og input
export class AddCustomer extends Component {
  user = [];
  submitting = false;
  validated = false;

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    this.validated = true;
  }

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
      <Modal show={this.props.modal} onHide={this.props.toggle} centered>
        <Modal.Body>
          <Form noValidate validated={this.validated} onSubmit={e => this.handleSubmit(e)}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridFname">
                <Form.Label>Fornavn</Form.Label>
                <Form.Control
                  autoFocus
                  required
                  type="text"
                  placeholder="Ola"
                  onChange={e => (this.user.fname = e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Skriv inn fornavn.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridLname">
                <Form.Label>Etternavn</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Normann"
                  onChange={e => (this.user.lname = e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Skriv inn etternavn.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridAddress">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Adressegata 1"
                  required
                  onChange={e => (this.user.address = e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Skriv inn adresse.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridTlf">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="1234 5678"
                  isInvalid={this.user.tlf && this.validated ? this.user.tlf.length != 8 : false}
                  onChange={e => {
                    if (e.target.value > 99999999) e.target.value = e.target.value.slice(0, 8);
                    this.user.tlf = e.target.value;
                  }}
                />
                <Form.Control.Feedback type="invalid">Skriv inn telefon.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  placeholder="ola@ntnu.no"
                  isInvalid={this.user.email && this.validated ? !this.ValidateEmail(this.user.email) : false}
                  onChange={e => {
                    this.user.email = e.target.value;
                  }}
                />
                <Form.Control.Feedback type="invalid">Skriv inn Email.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Postnummer</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="1234"
                  isInvalid={this.user.zip && this.validated ? this.user.zip.length != 4 : false}
                  onChange={e => {
                    if (e.target.value > 9999) e.target.value = e.target.value.slice(0, 4);
                    this.user.zip = e.target.value;
                  }}
                />
                <Form.Control.Feedback type="invalid">Skriv inn Postnummer.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button variant="outline-primary" type="submit" onClick={this.add}>
              Registrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  add() {
    if (
      this.user.fname &&
      this.user.lname &&
      this.user.address &&
      this.user.tlf.length == 8 &&
      this.ValidateEmail(this.user.email) &&
      this.user.zip.length == 4
    ) {
      this.submitting = true;
      customerService.addCustomer(this.user, () => {
        this.submitting = false;
        this.props.toggle();
      });
    }
  }

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }
}

export class AddEmployee extends Component {
  user = [];
  role = ['Admin', 'Salg', 'Lager', 'Sekretær'];
  submitting = false;
  validated = false;

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    this.validated = true;
  }
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
      <Modal show={this.props.modal} onHide={this.props.toggle} centered>
        <Modal.Body>
          <Form noValidate validated={this.validated} onSubmit={e => this.handleSubmit(e)}>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Fornavn</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ola"
                  required
                  onChange={e => (this.user.fname = e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Skriv inn fornavn.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Etternavn</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Normann"
                  required
                  onChange={e => (this.user.lname = e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Skriv inn etternavn.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="Adressegata 1"
                  onChange={e => (this.user.address = e.target.value)}
                />
                <Form.Control.Feedback type="invalid">Skriv inn adresse.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  type="number"
                  required
                  placeholder="1234 5678"
                  isInvalid={this.user.tlf && this.validated ? this.user.tlf.length != 8 : false}
                  onChange={e => {
                    if (e.target.value > 99999999) e.target.value = e.target.value.slice(0, 8);
                    this.user.tlf = e.target.value;
                  }}
                />
                <Form.Control.Feedback type="invalid">Skriv inn telefon.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  required
                  placeholder="ola@ntnu.no"
                  isInvalid={this.user.email && this.validated ? !this.ValidateEmail(this.user.email) : false}
                  onChange={e => {
                    this.user.email = e.target.value;
                  }}
                />
                <Form.Control.Feedback type="invalid">Skriv inn email.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Postnummer</Form.Label>
                <Form.Control
                  type="number"
                  required
                  placeholder="1234"
                  isInvalid={this.user.zip && this.validated ? this.user.zip.length != 4 : false}
                  onChange={e => {
                    if (e.target.value > 9999) e.target.value = e.target.value.slice(0, 4);
                    this.user.zip = e.target.value;
                  }}
                />
                <Form.Control.Feedback type="invalid">Skriv inn postnummer.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Fødselsdato</Form.Label>
                <Form.Control type="date" required onChange={e => (this.user.DOB = e.target.value)} />
                <Form.Control.Feedback type="invalid">Skriv inn fødselsdato.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Passord</Form.Label>
                <Form.Control type="password" required onChange={e => (this.user.password = e.target.value)} />
                <Form.Control.Feedback type="invalid">Skriv inn passord.</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Rolle</Form.Label>
                <Form.Control as="select" required onChange={e => (this.user.role = e.target.value)}>
                  {this.role.map(role => (
                    <option key={role}>{role}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Button variant="outline-primary" type="submit" onClick={this.add}>
              Registrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  add() {
    if (!this.user.role) this.user.role = 'Admin';
    if (
      this.user.fname &&
      this.user.lname &&
      this.user.address &&
      this.user.tlf.length == 8 &&
      this.ValidateEmail(this.user.email) &&
      this.user.zip.length == 4 &&
      this.user.DOB != '' &&
      typeof this.user.DOB != 'undefined' &&
      this.user.password
    ) {
      this.submitting = true;
      this.user.password = bcrypt.hashSync(this.user.password, 10);
      employeeService.addEmployee(this.user, () => {
        this.submitting = false;
        this.props.toggle();
      });
    }
  }

  ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }
}
export class AddModel extends Component {
  model = {};
  submitting = false;
  bike = null;
  render() {
    console.log(this.model);
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
