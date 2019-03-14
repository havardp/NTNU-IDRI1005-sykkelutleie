import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import Table from 'react-bootstrap/Table';
import { Card } from '../widgets';

//Imports for sql queries
import { employeeService } from '../services';

//Import the hashistory from index.js to be able to change path
import { historyRoute } from '../index.js';

export class EmployeeDetail extends Component {
  user = [];
  render() {
    return (
      <div className="main">
        <Card title="Personalia">
          <Table striped bordered hover>
            <tbody>
              <tr>
                <td>Ansatt id</td>
                <td>{this.user.e_id}</td>
              </tr>
              <tr>
                <td>Fornavn</td>
                <td>{this.user.fname}</td>
              </tr>
              <tr>
                <td>Etternavn</td>
                <td>{this.user.lname}</td>
              </tr>
              <tr>
                <td>Avdeling</td>
                <td>{this.user.department}</td>
              </tr>
              <tr>
                <td>Telefon</td>
                <td>{this.user.tlf}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.user.email}</td>
              </tr>
              <tr>
                <td>Adresse</td>
                <td>{this.user.address}</td>
              </tr>
              <tr>
                <td>Fødselsdato</td>
                <td>{this.user.dob}</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </div>
    );
  }

  mounted() {
    employeeService.getEmployee(
      this.props.match.params.id,
      result => {
        this.user = result;
        this.user.dob = result.DOB.getDate() + '-' + (result.DOB.getMonth() + 1) + '-' + result.DOB.getFullYear();
      },
      () => console.log('failure')
    );
  }
}

export class Employees extends Component {
  employees = [];
  render() {
    return (
      <div className="main">
        <Table striped bordered hover>
          <thead>
            <tr>
              <td>Ansatt id</td>
              <td>Fornavn</td>
              <td>Etternavn</td>
            </tr>
          </thead>
          <tbody>
            {this.employees.map(employee => (
              <tr key={employee.e_id} onClick={() => historyRoute.changePath('/employees/' + employee.e_id)}>
                <td>{employee.e_id}</td>
                <td>{employee.fname}</td>
                <td>{employee.lname}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }
}
