import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddEmployee } from '../components/adduser.js';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//Imports for sql queries
import { employeeService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class EmployeeDetail extends Component {
  user = null;
  tableHead = ['Ansatt id', 'Fornavn', 'Etternavn', 'Avdeling', 'Email', 'Telefon', 'Adresse', 'Fødselsdato'];

  render() {
    if (!this.user)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <div className="main">
        <Card title="Personalia">
          <HorizontalTableComponent tableBody={this.user} tableHead={this.tableHead} />
        </Card>
      </div>
    );
  }

  mounted() {
    employeeService.getEmployeeDetails(
      this.props.match.params.id,
      result => {
        this.user = result;
        this.user.DOB = result.DOB.getDate() + '-' + (result.DOB.getMonth() + 1) + '-' + result.DOB.getFullYear();
      },
      () => console.log('failure')
    );
  }
}

export class Employees extends Component {
  employees = null;
  tableHead = ['Ansatt id', 'Fornavn', 'Etternavn', 'X'];
  modal = false;

  render() {
    if (!this.employees)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <div className="main">
        <VerticalTableComponent tableBody={this.employees} tableHead={this.tableHead} deleteButton={true} />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        {this.modal && <AddEmployee modal={true} toggle={this.toggleModal} />}
      </div>
    );
  }
  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }

  delete(id) {
    customerService.deleteCustomers(id, () => {
      this.mounted();
    });
  }

  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }
}
