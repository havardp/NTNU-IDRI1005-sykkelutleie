// @flow

import { connection } from './mysql_connection';

export class Student {
  id: number = 0;
  name: string = '';
  email: string = '';
}

class StudentService {
  getStudents(success: (Student[]) => mixed) {
    connection.query('select * from Students', (error: ?Error, results: Student[]) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudent(id: number, success: Student => mixed) {
    connection.query('select * from Students where id=?', [id], (error: ?Error, results: Student[]) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateStudent(student: Student, success: () => mixed) {
    connection.query(
      'update Students set name=?, email=? where id=?',
      [student.name, student.email, student.id],
      (error: ?Error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }
}
export let studentService = new StudentService();
