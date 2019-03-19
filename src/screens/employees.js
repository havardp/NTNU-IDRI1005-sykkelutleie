import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { employeeService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class EmployeeDetail extends Component {
  user = null;
  tableHead = ['Ansatt id', 'Fornavn', 'Etternavn', 'Avdeling', 'Telefon', 'Email', 'Adresse', 'Fødselsdato'];

  render() {
    if (!this.user) return null;
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
  render() {
    if (!this.employees) return null;
    return (
      <div className="main">
        <VerticalTableComponent tableBody={this.employees} tableHead={this.tableHead} deleteButton={true} />
      </div>
    );
  }
  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }
}
