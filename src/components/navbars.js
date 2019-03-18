import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';
import { loginHandler } from './login.js';

export class Menu extends Component {
  //"&#128100;" profil ikon
  render() {
    if (sessionStorage.getItem('userLoggedIn') != 'true') return null;
    return (
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="#home">Sykkelutleie AS</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#neworder">Ny ordre</Nav.Link>
          <Nav.Link href="#orders">Finn ordre</Nav.Link>
          <Nav.Link href="#storagestatus">Lager</Nav.Link>
          <Nav.Link href="#customers">Kunde</Nav.Link>
          <Nav.Link href="#employees">Ansatte</Nav.Link>
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
    if (sessionStorage.getItem('userLoggedIn') != 'true') return null;
    return (
      <div className="sidenav">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>
    );
  }
}