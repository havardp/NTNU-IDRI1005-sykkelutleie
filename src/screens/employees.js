import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';
import { AddEmployee } from '../components/adduser.js';

//node modules
import ReactLoading from 'react-loading';
import Select from 'react-select';
import arraySort from 'array-sort';

//Imports for sql queries
import { employeeService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Employees extends Component {
  employees = null;
  modal = false;
  sortedBy = 'e_id';

  //variables for the select searchbar
  selectedOption = null;
  temporaryOptions = [];
  searchbarOptions = null;
  temporary = null;

  render() {
    return (
      <>
        {this.searchbarOptions && (
          <div className="row">
            <div className="col-10">
              <Select
                value={this.selectedOption}
                placeholder="Søk ansatt..."
                onChange={e => {
                  this.selectedOption = e;
                  history.push('/employees/' + e.value);
                }}
                options={this.searchbarOptions}
              />
            </div>
            <div className="col-2">
              <button className="btn btn-info btn-lg" onClick={this.toggleModal}>
                &#10010;
              </button>
            </div>
          </div>
        )}
        <VerticalTableComponent
          tableBody={this.employees}
          className={'clickable'}
          tableHead={'employee'}
          deleteButton={true}
          delete={this.delete}
          whereTo={this.props.match.path}
          sort={this.sort}
        />
        {this.modal && <AddEmployee modal={true} toggle={this.toggleModal} />}
      </>
    );
  }
  mounted() {
    employeeService.getEmployees(employees => {
      this.employees = employees;
    });
    employeeService.getEmployeeSearch(result => {
      this.temporaryOptions = [];
      result.map(e => {
        this.temporaryOptions.push({ value: e.e_id, label: e.fullname });
      });
      this.searchbarOptions = this.temporaryOptions;
    });
  }

  toggleModal() {
    this.modal ? (this.modal = false) : (this.modal = true);
    this.mounted();
  }

  delete(id) {
    if (window.confirm('Er du sikker på at du vil slette denne ansatte?'))
      employeeService.deleteEmployee(id, () => this.mounted());
  }

  sort(sort) {
    if (sort == this.sortedBy) {
      arraySort(this.employees, sort, { reverse: true });
      this.sortedBy = '';
    } else {
      arraySort(this.employees, sort);
      this.sortedBy = sort;
    }
  }
}

export class EmployeeDetail extends Component {
  user = null;
  editable = false;

  render() {
    if (!this.user || typeof this.user.DOB == 'object')
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <Card title="Personalia">
        <HorizontalTableComponent
          tableBody={this.user}
          tableHead={'employee'}
          editable={this.editable}
          sendStateToParent={this.updateEmployee}
        />
        <button onClick={() => (this.editable ? (this.editable = false) : (this.editable = true))}>
          &#57604; Endre
        </button>
      </Card>
    );
  }

  mounted() {
    employeeService.getEmployeeDetails(
      this.props.match.params.id,
      result => {
        this.user = result;
        this.user.DOB =
          (result.DOB.getDate().toString().length == 1 ? '0' + result.DOB.getDate() : result.DOB.getDate()) +
          '-' +
          ((result.DOB.getMonth() + 1).toString().length == 1
            ? '0' + (result.DOB.getMonth() + 1)
            : result.DOB.getMonth() + 1) +
          '-' +
          result.DOB.getFullYear();
      },
      () => console.log('failure')
    );
  }

  updateEmployee(value, key) {
    employeeService.updateEmployee(key, value, this.props.match.params.id, () => console.log('ansatt endret'));
  }
}
