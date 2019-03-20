import * as React from 'react';
import { Component } from 'react-simplified';
import SearchField from "react-search-field";

//Bootstrap imports
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

//Imports for sql queries
import { customerService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class CustomerAdd extends Component {
  user = [];
  //TODO legg til validering av data
  render() {
    return (
      <div className="main">
        <Card>
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

            <Button variant="outline-primary" onClick={this.add}>
              Registrer
            </Button>
          </Form>
        </Card>
      </div>
    );
  }

  mounted() {}

  add() {
    console.log(this.user.length);
    customerService.addCustomer(this.user, () => {
      history.push('/customers');
    });
  }
}
