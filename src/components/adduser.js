import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import { Radio, ControlLabel } from 'react-bootstrap';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

import { Customers, Employees } from '../components/adduser.js';

//Imports for sql queries
import { customerService, employeeService } from '../services';

const bcrypt = require('bcryptjs');
//TODO validering av data og input
export class AddCustomer extends Component {
  user = [];
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
      <Modal show={this.props.modal} onHide={this.props.toggle} centered>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Fornavn</Form.Label>
                <Form.Control type="text" placeholder="Ola" onChange={e => (this.user.fname = e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Etternavn</Form.Label>
                <Form.Control type="text" placeholder="Normann" onChange={e => (this.user.lname = e.target.value)} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Adressegata 1"
                  onChange={e => (this.user.address = e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Telefon</Form.Label>
                <Form.Control type="number" placeholder="1234 5678" onChange={e => (this.user.tlf = e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ola@ntnu.no"
                  onChange={e => (this.user.email = e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Postnummer</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="1234"
                  onChange={e => {
                    this.user.zip = e.target.value;
                  }}
                />
              </Form.Group>
            </Form.Row>
            <Button variant="outline-primary" onClick={this.add}>
              Registrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  add() {
    if (this.user.fname && this.user.lname && this.user.address && this.user.tlf && this.user.email && this.user.zip) {
      this.submitting = true;
      customerService.addCustomer(this.user, () => {
        this.submitting = false;
        this.props.toggle();
      });
    } else {
      alert('Du må fylle inn alle feltene');
    }
  }
}

export class AddEmployee extends Component {
  user = [];
  role = ['Admin', 'Salg', 'Lager', 'Sekretær'];
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
      <Modal show={this.props.modal} onHide={this.props.toggle} centered>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Fornavn</Form.Label>
                <Form.Control type="text" placeholder="Ola" onChange={e => (this.user.fname = e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Etternavn</Form.Label>
                <Form.Control type="text" placeholder="Normann" onChange={e => (this.user.lname = e.target.value)} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Adressegata 1"
                  onChange={e => (this.user.address = e.target.value)}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Telefon</Form.Label>
                <Form.Control type="number" placeholder="1234 5678" onChange={e => (this.user.tlf = e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="ola@ntnu.no"
                  onChange={e => (this.user.email = e.target.value)}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridZip">
                <Form.Label>Postnummer</Form.Label>
                <Form.Control type="number" placeholder="1234" onChange={e => (this.user.zip = e.target.value)} />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Fødselsdato</Form.Label>
                <Form.Control type="date" onChange={e => (this.user.DOB = e.target.value)} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Passord</Form.Label>
                <Form.Control type="password" onChange={e => (this.user.password = e.target.value)} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridCity">
                <Form.Label>Rolle</Form.Label>
                <Form.Control as="select" onChange={e => (this.user.role = e.target.value)}>
                  {this.role.map(role => (
                    <option key={role}>{role}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Button variant="outline-primary" onClick={this.add}>
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
      this.user.tlf &&
      this.user.email &&
      this.user.zip &&
      this.user.DOB &&
      this.user.password
    ) {
      this.submitting = true;
      this.user.password = bcrypt.hashSync(this.user.password, 10);
      employeeService.addEmployee(this.user, () => {
        this.submitting = false;
        this.props.toggle();
      });
    } else {
      alert('Du må fylle inn alle feltene');
    }
  }
}
export class AddModel extends Component {
  model = [];
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
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Modell</Form.Label>
                  <Form.Control type="text" placeholder="Navn" onChange={e => (this.model.model = e.target.value)} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Beskrivelse</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tekst"
                    onChange={e => (this.model.description = e.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Timepris</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="X kr"
                    onChange={e => (this.model.hour_price = e.target.value)}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridCity">
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
    if (!this.bikemodel.role) this.user.role = 'Admin';
    if (
      this.bikemodel.fname &&
      this.user.lname &&
      this.user.address &&
      this.user.tlf &&
      this.user.email &&
      this.user.zip &&
      this.user.DOB &&
      this.user.password
    ) {
      this.submitting = true;
      this.user.password = bcrypt.hashSync(this.user.password, 10);
      employeeService.addEmployee(this.user, () => {
        this.submitting = false;
        this.props.toggle();
      });
    } else {
      alert('Du må fylle inn alle feltene');
    }
  }
}
