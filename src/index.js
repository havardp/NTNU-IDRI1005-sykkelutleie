// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { Student, studentService } from './services';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
const bcrypt = require('bcryptjs');

class Menu extends Component {
  render() {
    return (
      <NavBar brand="WhiteBoard">
        <NavBar.Link to="/students">Students</NavBar.Link>
      </NavBar>
    );
  }
}

class Home extends Component {
  render() {
    return <Card title="Welcome">Welcome to WhiteBoard</Card>;
  }
}

class StudentList extends Component {
  students: Student[] = [];

  render() {
    return (
      <Card title="Students">
        <List>
          {this.students.map(student => (
            <List.Item key={student.id} to={'/students/' + student.id}>
              {student.name}
            </List.Item>
          ))}
        </List>
      </Card>
    );
  }

  mounted() {
    studentService.getStudents(students => {
      this.students = students;
    });
    var salt = bcrypt.genSaltSync(10); //krypteringsnøkkel
    var hash = bcrypt.hashSync('test', salt); //krypterte verrsjonen av "test"
    console.log(hash); //krypterte verrsjonen av "test"
    console.log(bcrypt.compareSync('test', hash)); //true/false om hashen stemmer med startstringen
  }
}

class StudentDetails extends Component<{ match: { params: { id: number } } }> {
  student = new Student();

  render() {
    return (
      <div>
        <Card title="Student details">
          <Row>
            <Column width={2}>Name:</Column>
            <Column>{this.student.name}</Column>
          </Row>
          <Row>
            <Column width={2}>Email:</Column>
            <Column>{this.student.email}</Column>
          </Row>
        </Card>
        <Button.Light onClick={this.edit}>Edit</Button.Light>
      </div>
    );
  }

  mounted() {
    studentService.getStudent(this.props.match.params.id, student => {
      this.student = student;
    });
  }

  edit() {
    history.push('/students/' + this.student.id + '/edit');
  }
}

class StudentEdit extends Component<{ match: { params: { id: number } } }> {
  student = new Student();

  render() {
    return (
      <div>
        <Card title="Edit student">
          <Form.Label>Name:</Form.Label>
          <Form.Input type="text" value={this.student.name} onChange={e => (this.student.name = e.target.value)} />
          <Form.Label>Email:</Form.Label>
          <Form.Input type="text" value={this.student.email} onChange={e => (this.student.email = e.target.value)} />
        </Card>
        <Row>
          <Column>
            <Button.Success onClick={this.save}>Save</Button.Success>
          </Column>
          <Column right>
            <Button.Light onClick={this.cancel}>Cancel</Button.Light>
          </Column>
        </Row>
      </div>
    );
  }

  mounted() {
    studentService.getStudent(this.props.match.params.id, student => {
      this.student = student;
    });
  }

  save() {
    studentService.updateStudent(this.student, () => {
      history.push('/students/' + this.props.match.params.id);
    });
  }

  cancel() {
    history.push('/students/' + this.props.match.params.id);
  }
}

let root = document.getElementById('root');
if (root)
  ReactDOM.render(
    <div>
      <HashRouter>
        <div>
          <Menu />
          <Route exact path="/" component={Home} />
          <Route exact path="/students" component={StudentList} />
          <Route exact path="/students/:id" component={StudentDetails} />
          <Route exact path="/students/:id/edit" component={StudentEdit} />
        </div>
      </HashRouter>
    </div>,
    root
  );
