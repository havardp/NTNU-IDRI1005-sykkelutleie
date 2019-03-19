import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import Collapse from 'react-bootstrap/Collapse';
import Alert from 'react-bootstrap/Alert';
import Fade from 'react-bootstrap/Fade';

//Imports for sql queries
import { employeeService } from '../services';

//To be able to call main.js to change window size
const electron = require('electron');
let { ipcRenderer } = electron;

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';
const bcrypt = require('bcryptjs');

export class Login extends Component {
  user = [];
  collapseShow = false;
  modalShow = false;

  modalClose() {
    this.modalShow = false;
  }

  collapseClose() {
    this.collapseShow = false;
  }

  modalOpen() {
    this.modalShow = true;
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 mx-auto">
              <div className="card card-signin my-3">
                <div className="card-body">
                  <h5 className="card-title text-center">Sykkelutleie AS</h5>
                  <div className="form-signin">
                    <div className="form-label-group">
                      <input
                        type="text"
                        id="inputName"
                        className="form-control"
                        placeholder="Username"
                        required
                        onChange={e => (this.user.name = e.target.value)}
                      />
                      <label htmlFor="inputName">Brukernavn</label>
                    </div>
                    <div className="form-label-group">
                      <input
                        type="password"
                        id="inputPassword"
                        className="form-control"
                        placeholder="Password"
                        required
                        onChange={e => (this.user.password = e.target.value)}
                      />
                      <label htmlFor="inputPassword">Passord</label>
                    </div>
                    <Fade in={this.collapseShow}>
                      <div onClick={this.collapseClose} id="loginError">
                        <Alert variant="danger"> Du har skrevet inn feil brukernavn eller passord </Alert>
                      </div>
                    </Fade>
                    <hr className="my-3" />
                    <button className="btn btn-lg btn-secondary btn-block text-uppercase" onClick={this.login}>
                      Logg inn
                    </button>
                    <button className="btn btn-lg btn-secondary btn-block text-uppercase" onClick={this.modalOpen}>
                      Hjelp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={this.modalShow} onHide={this.modalClose} centered>
          <Modal.Body>Hvis du er usikker på passord eller brukernavn, kontakt en administrator</Modal.Body>
        </Modal>
      </div>
    );
  }

  login() {
    if (this.user.name && this.user.password) {
      employeeService.getEmployee(
        this.user.name,
        result => {
          if (bcrypt.compareSync(this.user.password ? this.user.password : '', result.password)) {
            sessionStorage.setItem('userName', this.user.name);
            sessionStorage.setItem('userLoggedIn', true);
            history.push('/home');
            ipcRenderer.send('maximize');
          } else {
            this.collapseShow = true;
          }
        },
        () => {
          this.collapseShow = true;
        }
      );
    } else {
      this.collapseShow = true;
    }
  }

  logout() {
    sessionStorage.clear();
    history.push('/');
    ipcRenderer.send('minimize');
  }
}

export let loginHandler = new Login();
