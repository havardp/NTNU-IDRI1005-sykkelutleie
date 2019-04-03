import * as React from 'react';
import { Component } from 'react-simplified';
import { Link } from 'react-router-dom';

//Bootstrap imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

//import the logout method from login.js
import { loginHandler } from './login.js';

export class Menu extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand className="clickable" onClick={() => history.push('/home')}>
          Sykkelutleie AS
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link onClick={() => history.push('/neworder')}>Ny ordre</Nav.Link>
          <Nav.Link onClick={() => history.push('/orders')}>Finn ordre</Nav.Link>
          <Nav.Link onClick={() => history.push('/storagestatus')}>Lager</Nav.Link>
          <Nav.Link onClick={() => history.push('/customers')}>Kunde</Nav.Link>
          <Nav.Link onClick={() => history.push('/employees')}>Ansatte</Nav.Link>
        </Nav>
        <DropdownButton
          id="dropdown-item-button"
          alignRight
          title={sessionStorage.getItem('userName')}
          variant="outline-secondary"
        >
          <Dropdown.Item onClick={() => history.push('/employees/' + sessionStorage.getItem('userName'))}>
            Min side
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              loginHandler.logout();
            }}
          >
            Logg ut
          </Dropdown.Item>
        </DropdownButton>
      </Navbar>
    );
  }
}

export class SideNav extends Component {
  render() {
    return (
      <div className="sidenav">
        <p>
          <Nav.Link className="sidenavpart"onClick={() => history.push('/reparations')}>&#128736; Reperasjoner</Nav.Link>
          <Nav.Link className="sidenavpart">&#128666;Transportering</Nav.Link>
        </p>
      </div>
    );
  }
}
