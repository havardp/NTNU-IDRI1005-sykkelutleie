import { connection } from './mysql_connection';

class EmployeeService {
  getEmployee(username, success, failure) {
    connection.query('select password from Employee where e_id = ?', [username], (error, results) => {
      if (error) {
        return console.error(error);
      }
      if (results.length == 0) return failure();

      success(results[0]);
    });
  }

  getEmployeeDetails(username, success, failure) {
    connection.query(
      'select e_id, fname, lname, department, email, tlf, address, DOB  from Employee where e_id = ?',
      [username],
      (error, results) => {
        if (error) {
          return console.error(error);
        }
        if (results.length == 0) return failure();

        success(results[0]);
      }
    );
  }

  getEmployees(success) {
    connection.query('select e_id, fname, lname from Employee', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  addEmployee(user, success) {
    connection.query(
      'insert into Employee values (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user.fname, user.lname, user.email, user.tlf, user.address, user.zip, user.password, user.DOB, user.role],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

class CustomerService {
  getCustomers(success) {
    connection.query(
      'select Customer.c_id, c_fname, c_lname, count(order_nr) from Customer left  join Orders on Customer.c_id = Orders.c_id group by Customer.c_id',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getCustomerDetails(c_id, success) {
    connection.query(
      'select c_id, c_fname, c_lname, c_email, c_tlf, c_address from Customer where c_id = ?',
      [c_id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      }
    );
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
      'SELECT O.order_nr, O.c_id, concat(c_fname, " ", c_lname) as "fullname", count(distinct chassis_id) as nrbikes, count(distinct eq_id) as nrequipment FROM Orders O left join Bike_Order BO on O.order_nr = BO.order_nr left join Equipment_Order EO on O.order_nr = EO.order_nr left join Customer C on O.c_id = C.c_id GROUP by O.order_nr',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getOrder(order_nr, success) {
    connection.query('select * from Orders where order_nr = ?', [order_nr], (error, results) => {
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
  getBike(id, success, failure) {
    connection.query(
      'select chassis_id, gear, wheel_size, broken, location, storage, luggage from Bike where Bike.model = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);
        if (results.length == 0) return;

        success(results);
      }
    );
  }
  getEquipment(id, success) {
    connection.query(' select * from Equipment where Equipment.model = ?;', [id], (error, results) => {
      if (error) return console.error(error);
      if (results.length == 0) return;

      success(results);
    });
  }
}

export let employeeService = new EmployeeService();
export let customerService = new CustomerService();
export let storageService = new StorageService();
export let orderService = new OrderService();
