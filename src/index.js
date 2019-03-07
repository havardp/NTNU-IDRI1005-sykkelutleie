import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { employeeService } from './services';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import Table from 'react-bootstrap/Table';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
const bcrypt = require('bcryptjs');

class Menu extends Component {
  //"&#128100;" profil ikon
  render() {
    return (
      <NavBar brand="Sykkelutleie AS">
        {localStorage.getItem('userLoggedIn') == 'true' ? (
          <ButtonGroup vertical>
            <DropdownButton
              id="dropdown-item-button"
              alignRight
              title={localStorage.getItem('userName')}
              variant="secondary"
            >
              <Dropdown.Item onClick={() => history.push('/myPage')}>Mn side</Dropdown.Item>
              <Dropdown.Item onClick={() => history.push('/home')}>Hovedside</Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  history.push('/');
                  localStorage.clear();
                }}
              >
                {' '}
                Logg ut
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        ) : (
          ''
        )}
      </NavBar>
    );
  }
}

class Login extends Component {
  user = [];
  state = { errorMessage: false, modalShow: false };

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    return (
      <div>
        <Card title="Login">
          <List>
            <Form.Input type="text" placeholder="Brukernavn" onChange={e => (this.user.name = e.target.value)} />
            <Form.Input type="password" placeholder="Passord" onChange={e => (this.user.password = e.target.value)} />
            <Form.Label>
              {this.state.errorMessage ? (
                <Alert variant="danger"> Du har skrevet inn feil brukernavn eller passord </Alert>
              ) : (
                ''
              )}
            </Form.Label>
          </List>
          <Row>
            <Column>
              <Button.Light onClick={this.login}>Logg inn</Button.Light>
            </Column>
            <Column right>
              <Button.Light onClick={this.help}>Hjelp &#x2753;</Button.Light>
            </Column>
          </Row>
        </Card>
        <Modal show={this.state.show} onHide={this.handleClose} centered>
          <Modal.Body>Hvis du er usikker på passord eller brukernavn, kontakt en administrator</Modal.Body>
        </Modal>
      </div>
    );
  }

  mounted() {
    if (localStorage.getItem('userLoggedIn') == 'true') {
      history.push('/home');
    }
  }

  login() {
    employeeService.getEmployee(
      this.user.name,
      result => {
        if (bcrypt.compareSync(this.user.password, result.password)) {
          localStorage.setItem('userName', this.user.name);
          localStorage.setItem('userLoggedIn', true);
          history.push('/home');
        } else {
          this.setState({ errorMessage: true });
        }
      },
      () => {
        this.setState({ errorMessage: true });
      }
    );
  }

  help() {
    this.setState({ show: true });
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <Card>
          <List>
            <Button.Info onClick={this.newOrder}>Ny ordre</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.findOrder}>Finn ordre</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.customer}>Kunde</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.storageStatus}>Lagerstatus</Button.Info>
          </List>
          <List>
            <Button.Info onClick={this.employee}>Ansatte</Button.Info>
          </List>
        </Card>
      </div>
    );
  }
  newOrder() {
    console.log(localStorage.getItem('userLoggedIn'));
  }
  findOrder() {}
  customer() {}
  storageStatus() {}
  employee() {}
}

class MyPage extends Component {
  state = { e_id: ' ', fname: ' ', lname: ' ', department: ' ', email: ' ', tlf: ' ', adress: ' ', dob: ' ' };
  render() {
    return (
      <Card title="Personalia">
        <Table striped bordered hover>
          <tbody>
            <tr>
              <td>Ansatt id</td>
              <td>{this.state.e_id}</td>
            </tr>
            <tr>
              <td>Fornavn</td>
              <td>{this.state.fname}</td>
            </tr>
            <tr>
              <td>Etternavn</td>
              <td>{this.state.lname}</td>
            </tr>
            <tr>
              <td>Avdeling</td>
              <td>{this.state.department}</td>
            </tr>
            <tr>
              <td>Telefon</td>
              <td>{this.state.tlf}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{this.state.email}</td>
            </tr>
            <tr>
              <td>Adresse</td>
              <td>{this.state.adress}</td>
            </tr>
            <tr>
              <td>Fødselsdato</td>
              <td>{this.state.dob}</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    );
  }
  mounted() {
    employeeService.getEmployee(
      localStorage.getItem('userName'),
      result => {
        this.setState({ e_id: result.e_id });
        this.setState({ fname: result.fname });
        this.setState({ lname: result.lname });
        this.setState({ department: result.department });
        this.setState({ email: result.email });
        this.setState({ tlf: result.tlf });
        this.setState({ adress: result.adress });
        this.setState({
          dob: result.DOB.getDate() + '-' + (result.DOB.getMonth() + 1) + '-' + result.DOB.getFullYear()
        });
      },
      () => {
        console.log('failure, ingen bruker logget inn');
      }
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/myPage" component={MyPage} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
