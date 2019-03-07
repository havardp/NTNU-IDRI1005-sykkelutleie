import * as React from 'react';
import { Component } from 'react-simplified';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { employeeService } from './services';
import { Card, List, Row, Column, NavBar, Button, Form } from './widgets';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student
const bcrypt = require('bcryptjs');

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Sykkelutleie AS">
        <DropdownButton id="dropdown-item-button" title="Profil" variant="secondary">
          <Dropdown.Item onClick={() => history.push('/myPage')}>Min side</Dropdown.Item>
          <Dropdown.Item onClick={() => history.push('/home')}>Hovedside</Dropdown.Item>
          <Dropdown.Item onClick={() => history.push('/')}>Logg ut</Dropdown.Item>
        </DropdownButton>
      </NavBar>
    );
  }
}

class Login extends Component {
  user = [];
  errorMessage = '';

  render() {
    return (
      <div>
        <Card title="Login">
          <Form.Input type="text" placeholder="Brukernavn" onChange={e => (this.user.name = e.target.value)} />
          <Form.Input type="password" placeholder="Passord" onChange={e => (this.user.password = e.target.value)} />
          <Form.Label>{this.errorMessage}</Form.Label>
        </Card>
        <Row>
          <Column>
            <Button.Light onClick={this.login}>Logg inn</Button.Light>
          </Column>
          <Column right>
            <Button.Light onClick={this.help}>Hjelp &#x2753;</Button.Light>
          </Column>
        </Row>
      </div>
    );
  }

  login() {
    employeeService.getEmployee(
      this.user.name,
      result => {
        if (bcrypt.compareSync(this.user.password, result.password)) history.push('/home');
        else {
          this.errorMessage = 'Du har skrevet feil brukernavn eller passord, prøv igjen!';
          this.render();
        }
      },
      () => {
        this.errorMessage = 'Du har skrevet feil brukernavn eller passord, prøv igjen!';
        this.render();
      }
    );
  }

  help() {
    alert('Kontakt en administrator ved glemt brukernavn eller passord.');
  }
}

class Home extends Component {
  render() {
    return (
      <div>
        <Card>
          <List>
            <Button.Info onClick={this.newOrder}>Ny ordre</Button.Info>
            <br />
          </List>
          <List>
            <Button.Info onClick={this.findOrder}>Finn ordre</Button.Info>
            <br />
          </List>
          <List>
            <Button.Info onClick={this.customer}>Kunde</Button.Info>
            <br />
          </List>
          <List>
            <Button.Info onClick={this.storageStatus}>Lagerstatus</Button.Info>
            <br />
          </List>
          <List>
            <Button.Info onClick={this.employee}>Ansatte</Button.Info>
          </List>
        </Card>
      </div>
    );
  }
  newOrder() {}
  findOrder() {}
  customer() {}
  storageStatus() {}
  employee() {}
}

// class StudentList extends Component {
//   students = [];
//
//   render() {
//     return (
//       <Card title="Students">
//         <List>
//           {this.students.map(student => (
//             <List.Item key={student.id} to={'/students/' + student.id}>
//               {student.name}
//             </List.Item>
//           ))}
//         </List>
//         <List>
//           <Button.Success onClick={this.add}>Add</Button.Success>
//         </List>
//       </Card>
//     );
//   }
//
//   mounted() {
//     studentService.getStudents(students => {
//       this.students = students;
//     });
//   }
//
//   add() {
//     history.push('/students/add');
//   }
// }
//
// class StudentDetails extends Component {
//   student = null;
//   subjects = [];
//   notSubjects = [];
//   emnenavn = '';
//
//   render() {
//     if (!this.student) return null;
//
//     return (
//       <div>
//         <Card title="Student details">
//           <Row>
//             <Column width={2}>Name:</Column>
//             <Column>{this.student.name}</Column>
//           </Row>
//           <Row>
//             <Column width={2}>Email:</Column>
//             <Column>{this.student.email}</Column>
//           </Row>
//         </Card>
//         <Card title="Enrolled subjects">
//           <List>
//             {this.subjects.map(subject => (
//               <List.Item key={subject.id} to={'/subjects/' + subject.id}>
//                 {subject.emnenavn}{' '}
//                 <Button.Danger
//                   onClick={e => {
//                     e.preventDefault();
//                     this.remove(subject.emnekode);
//                   }}
//                 >
//                   X
//                 </Button.Danger>
//               </List.Item>
//             ))}
//             <List.Item>
//               <select onChange={e => (this.emnenavn = e.target.value)}>
//                 {this.notSubjects.map(subject => (
//                   <option key={subject.emnekode}>{subject.emnenavn}</option>
//                 ))}
//               </select>
//               <Button.Success onClick={this.add}>Add</Button.Success>
//             </List.Item>
//           </List>
//         </Card>
//         <Button.Light onClick={this.edit}>Edit</Button.Light>
//       </div>
//     );
//   }
//
//   mounted() {
//     studentService.getStudent(this.props.match.params.id, student => {
//       this.student = student;
//     });
//     studentService.getSubjects(this.props.match.params.id, subjects => {
//       this.subjects = subjects;
//     });
//     studentService.getNotSubjects(this.props.match.params.id, notSubjects => {
//       this.notSubjects = notSubjects;
//
//       this.emnenavn = this.notSubjects[0].emnenavn;
//     });
//   }
//
//   edit() {
//     history.push('/students/' + this.student.id + '/edit');
//   }
//
//   add() {
//     studentService.addSubject(this.props.match.params.id, this.emnenavn, () => {
//       studentService.getSubjects(this.props.match.params.id, subjects => {
//         this.subjects = subjects;
//       });
//       studentService.getNotSubjects(this.props.match.params.id, notSubjects => {
//         this.notSubjects = notSubjects;
//         this.emnenavn = this.notSubjects[0].emnenavn;
//       });
//     });
//   }
//
//   remove(id) {
//     studentService.removeSubject(id, this.props.match.params.id, () => {
//       studentService.getSubjects(this.props.match.params.id, subjects => {
//         this.subjects = subjects;
//       });
//       studentService.getNotSubjects(this.props.match.params.id, notSubjects => {
//         this.notSubjects = notSubjects;
//         this.emnenavn = this.notSubjects[0].emnenavn;
//       });
//     });
//   }
// }
//
// class StudentEdit extends Component {
//   student = null;
//
//   render() {
//     if (!this.student) return null;
//
//     return (
//       <div>
//         <Card title="Edit student">
//           <Form.Label>Name:</Form.Label>
//           <Form.Input type="text" value={this.student.name} onChange={e => (this.student.name = e.target.value)} />
//           <Form.Label>Email:</Form.Label>
//           <Form.Input type="text" value={this.student.email} onChange={e => (this.student.email = e.target.value)} />
//         </Card>
//         <Row>
//           <Column>
//             <Button.Success onClick={this.save}>Save</Button.Success>
//           </Column>
//           <Column right>
//             <Button.Danger onClick={this.delete}>Delete</Button.Danger>
//           </Column>
//         </Row>
//         <Row>
//           <Column right>
//             <Button.Light onClick={this.cancel}>Cancel</Button.Light>
//           </Column>
//         </Row>
//       </div>
//     );
//   }
//
//   mounted() {
//     studentService.getStudent(this.props.match.params.id, student => {
//       this.student = student;
//     });
//   }
//
//   save() {
//     studentService.updateStudent(this.student, () => {
//       history.push('/students/' + this.props.match.params.id);
//     });
//   }
//
//   cancel() {
//     history.push('/students/' + this.props.match.params.id);
//   }
//
//   delete() {
//     studentService.deleteStudent(this.props.match.params.id, () => {
//       history.push('/students/');
//     });
//   }
// }
//
// class StudentAdd extends Component {
//   student = [];
//
//   render() {
//     if (!this.student) return null;
//
//     return (
//       <div>
//         <Card title="Add subject">
//           <Form.Label>Name:</Form.Label>
//           <Form.Input type="text" onChange={e => (this.student.navn = e.target.value)} />
//           <Form.Label>Email:</Form.Label>
//           <Form.Input type="text" onChange={e => (this.student.email = e.target.value)} />
//         </Card>
//         <Row>
//           <Column>
//             <Button.Success onClick={this.add}>Add</Button.Success>
//           </Column>
//           <Column right>
//             <Button.Light onClick={this.cancel}>Cancel</Button.Light>
//           </Column>
//         </Row>
//       </div>
//     );
//   }
//
//   mounted() {
//     studentService.getStudents(student => {
//       this.student = student;
//     });
//   }
//
//   cancel() {
//     history.push('/students/');
//   }
//
//   add() {
//     studentService.addStudent(this.student, () => {
//       history.push('/students/');
//     });
//   }
// }

ReactDOM.render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Login} />
      <Route exact path="/home" component={Home} />
    </div>
  </HashRouter>,
  document.getElementById('root')
);
