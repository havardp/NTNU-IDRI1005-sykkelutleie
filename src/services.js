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

  addCustomer(user, success) {
    connection.query(
      'insert into Customer values (null, ?, ?, ?, ?, ?, ?)',
      [user.fname, user.lname, user.email, user.tlf, user.address, user.zip],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  deleteCustomers(id, success) {
    connection.query('delete from Customer where c_id = ?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
}

class OrderService {
  getOrders(success) {
    connection.query(
      'select order_nr, Customer.c_id, c_lname, c_fname from Orders, Customer where Orders.c_id = Customer.c_id',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getOrder(order_nr, success) {
    connection.query('select * from Customer where order_nr = ?', [order_nr], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }
}

class StorageService {
  getBikeModels(success) {
    connection.query(
      'SELECT Product_Type.model, description, hour_price, day_price, count(*) as "countBikes" FROM `Bike`, Product_Type where Bike.model = Product_Type.model Group by Product_Type.model',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
  getEquipmentModels(success) {
    connection.query(
      'SELECT Product_Type.model, description, hour_price, day_price, count(*) as "countEquipment" FROM `Equipment`, Product_Type where Equipment.model = Product_Type.model Group by Product_Type.model',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
  getBike(id, success) {
    connection.query('select * from Bike where model = ?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
  getEquipment(id, success) {
    connection.query('select * from Equipment where model = ?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
}

export let employeeService = new EmployeeService();
export let customerService = new CustomerService();
export let storageService = new StorageService();
export let orderService = new OrderService();
