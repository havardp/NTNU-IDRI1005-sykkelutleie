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
import { customerService, employeeService } from '../services';

const bcrypt = require('bcryptjs');

//reusable components that are used in the customer, employee and new order screen when making new customers/employees

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
                  min="10000000"
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
                  min="1000"
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
                  min="10000000"
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
                  min="1000"
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
                <Form.Control type="date" required onChange={e => (this.user.DOB = e.target.value)} max="2002-01-01" />
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
