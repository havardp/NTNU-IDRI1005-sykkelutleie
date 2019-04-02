import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
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

export class Employees extends Component {
  employees = null;
  modal = false;

  render() {
    return (
      <>
        <VerticalTableComponent
          tableBody={this.employees}
          tableHead={'employee'}
          deleteButton={true}
          delete={this.delete}
          whereTo={history.location.pathname}
        />
        <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
          &#10010;
        </button>
        {this.modal && <AddEmployee modal={true} toggle={this.toggleModal} />}
      </>
    );
  }
  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
  }

  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }

  delete(id) {
    employeeService.deleteEmployee(id, () => this.mounted());
  }
}

export class EmployeeDetail extends Component {
  user = null;

  render() {
    if (!this.user || typeof this.user.DOB == 'object')
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <Card title="Personalia">
        <HorizontalTableComponent tableBody={this.user} tableHead={'employee'} />
      </Card>
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
