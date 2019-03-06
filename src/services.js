import { connection } from './mysql_connection';

class EmployeeService {
  getEmployee(username, success) {
    connection.query('select password from Employee where e_id = ?', [username], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }
}

export let employeeService = new EmployeeService();
// class StudentService {
//   getStudents(success) {
//     connection.query('select * from Students', (error, results) => {
//       if (error) return console.error(error);
//
//       success(results);
//     });
//   }
//
//   getStudent(id, success) {
//     connection.query('select * from Students where id=?', [id], (error, results) => {
//       if (error) return console.error(error);
//
//       success(results[0]);
//     });
//   }
//
//   updateStudent(student, success) {
//     connection.query(
//       'update Students set name=?, email=? where id=?',
//       [student.name, student.email, student.id],
//       (error, results) => {
//         if (error) return console.error(error);
//
//         success();
//       }
//     );
//   }
//
//   deleteStudent(id, success) {
//     connection.query('delete from Students where id=?', [id], (error, results) => {
//       if (error) return console.error(error);
//
//       success(results[0]);
//     });
//   }
//
//   addStudent(student, success) {
//     connection.query(
//       'insert into Students (name, email) values (?,?)',
//       [student.navn, student.email],
//       (error, results) => {
//         if (error) return console.error(error);
//
//         success();
//       }
//     );
//   }
//
//   getSubjects(id, success) {
//     connection.query(
//       'select Emne.emnekode, emnenavn, Emne.id from Emne, Emne_student where Emne_student.id=? and Emne.emnekode = Emne_student.emnekode',
//       [id],
//       (error, results) => {
//         if (error) return console.error(error);
//
//         success(results);
//       }
//     );
//   }
//
//   getNotSubjects(id, success) {
//     connection.query(
//       'select emnekode, emnenavn, id from Emne where emnekode not in (select Emne.emnekode from Emne, Emne_student where Emne_student.id=? and Emne.emnekode = Emne_student.emnekode)',
//       [id],
//       (error, results) => {
//         if (error) return console.error(error);
//
//         success(results);
//       }
//     );
//   }
//
//   addSubject(id, emnenavn, success) {
//     connection.query(
//       'insert into Emne_student (id, emnekode) values (?,(select emnekode from Emne  where emnenavn = ?))',
//       [id, emnenavn],
//       (error, results) => {
//         if (error) return console.error(error);
//
//         success();
//       }
//     );
//   }
//
//   removeSubject(emnekode, id, success) {
//     connection.query('delete from Emne_student where emnekode=? and id=?', [emnekode, id], (error, results) => {
//       if (error) return console.error(error);
//
//       success(results[0]);
//     });
//   }
// }
//
// class SubjectService {
//   getSubjects(success) {
//     connection.query('select * from Emne', (error, results) => {
//       if (error) return console.error(error);
//
//       success(results);
//     });
//   }
//
//   getSubject(id, success) {
//     connection.query('select * from Emne where id=?', [id], (error, results) => {
//       if (error) return console.error(error);
//
//       success(results[0]);
//     });
//   }
//
//   updateSubject(subject, success) {
//     connection.query(
//       'update Emne set emnenavn=?, emnekode=? where id=?',
//       [subject.emnenavn, subject.emnekode, subject.id],
//       (error, results) => {
//         if (error) return console.error(error);
//
//         success();
//       }
//     );
//   }
//
//   deleteSubject(id, success) {
//     connection.query('delete from Emne where id=?', [id], (error, results) => {
//       if (error) return console.error(error);
//
//       success(results[0]);
//     });
//   }
//
//   addSubject(subject, success) {
//     connection.query(
//       'insert into Emne (emnenavn, emnekode) values (?,?)',
//       [subject.emnenavn, subject.emnekode],
//       (error, results) => {
//         if (error) return console.error(error);
//
//         success();
//       }
//     );
//   }
// }
//
// export let subjectService = new SubjectService();
// export let studentService = new StudentService();
