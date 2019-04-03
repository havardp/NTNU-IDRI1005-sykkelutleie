import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

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
          <NavLink className="navbarlink" to="/orders">
            Finn ordre
          </NavLink>
          <NavLink className="navbarlink" to="/customers">
            Kunde
          </NavLink>
          <NavLink className="navbarlink" to="/employees">
            Ansatte
          </NavLink>
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
        <NavLink className="sidebarlink" to="/neworder">
          &#57642; Ny ordre
        </NavLink>
        <NavLink className="sidebarlink" to="/storagestatus">
          &#57709; Lager
        </NavLink>
        <NavLink className="sidebarlink" to="/reparations">
          &#57694; Reperasjoner
        </NavLink>
        <NavLink className="sidebarlink" to="/transport">
          &#57660; Transportering
        </NavLink>
      </div>
    );
  }
}
