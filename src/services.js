import { connection } from './mysql_connection';

class EmployeeService {
  getEmployee(username, success, failure) {
    connection.query('select * from Employee where e_id = ?', [username], (error, results) => {
      if (error) {
        return console.error(error);
      }
      if (results.length == 0) return failure();

      success(results[0]);
    });
  }

  getEmployees(success) {
    connection.query('select * from Employee', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
}

class CustomerService {
  getCustomers(success) {
    connection.query('select * from Customer', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getCustomer(c_id, success) {
    connection.query('select * from Customer where c_id = ?', [c_id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }
}

export let employeeService = new EmployeeService();
export let customerService = new CustomerService();
