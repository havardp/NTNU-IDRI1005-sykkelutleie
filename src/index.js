import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { connection } from './mysql_connection';

class StudentList extends Component {
  students = [];

  render() {
    return (
      <ul>
        {this.students.map(student => (
          <li key={student.id}>
            <NavLink activeStyle={{ color: 'darkblue' }} to={'/students/' + student.id}>
              {student.name}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }

  mounted() {
    connection.query('select id, name from Students', (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      this.students = results;
    });
  }
}

class StudentDetails extends Component {
  name = '';
  email = '';

  render() {
    return (
      <ul>
        <li>Name: {this.name}</li>
        <li>Email: {this.email}</li>
      </ul>
    );
  }

  mounted() {
    connection.query('select name, email from Students where id=?', [this.props.match.params.id], (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      this.name = results[0].name;
      this.email = results[0].email;
    });
  }
}

ReactDOM.render(
  <HashRouter>
    <div>
      <StudentList />
      <Route path="/students/:id" component={StudentDetails} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
