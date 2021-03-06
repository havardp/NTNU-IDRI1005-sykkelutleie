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
import { reparationService } from '../services';

//reusable component that is used in the storage screen when sending a bike to reparation

export class AddReparation extends Component {
  rep = [];
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
                  <Form.Label>Ramme id</Form.Label>
                  <Form.Control type="number" disabled value={this.props.chassisId.id} />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Fra dato</Form.Label>
                  <Form.Control type="date" onChange={e => (this.rep.r_fdate = e.target.value)} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Til dato</Form.Label>
                  <Form.Control type="date" onChange={e => (this.rep.r_tdate = e.target.value)} />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Reperasjonspris</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Reperasjonspris"
                    onChange={e => (this.rep.expenses = e.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Beskrivelse</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Beskrivelse av reperasjonen"
                    onChange={e => (this.rep.r_description = e.target.value)}
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
    if (this.rep.r_fdate && this.rep.r_tdate && this.rep.expenses && this.rep.r_description) {
      reparationService.addReparation(this.rep, this.props.chassisId.id, () => {
        this.submitting = false;
        this.props.toggle();
      });
    } else {
      alert('Du må fylle inn alle feltene');
    }
  }
}
