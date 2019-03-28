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

  getCustomerSearch(success) {
    connection.query(
      'select Customer.c_id, concat(c_fname, " ",c_lname, " - ",c_tlf," - ",c_email) as "fullname" from Customer',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getCustomerOrders(id, success) {
    connection.query(
      'SELECT O.order_nr, O.c_id, concat(c_fname, " ", c_lname) as "fullname", count(distinct chassis_id) as nrbikes, count(distinct eq_id) as nrequipment FROM Orders O left join Bike_Order BO on O.order_nr = BO.order_nr left join Equipment_Order EO on O.order_nr = EO.order_nr left join Customer C on O.c_id = C.c_id WHERE O.c_id = ? GROUP by O.order_nr',
      [id],
      (error, orders) => {
        if (error) return console.error(error);
        success(orders);
      }
    );
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

  makeOrder(e_id, c_id, details, success) {
    connection.query(
      'insert into Orders values (null, ?, ?, ?, ?, ?, ?)',
      [e_id, c_id, details.fromDate, details.toDate, details.pickupLocation, details.dropoffLocation],
      (error, result) => {
        if (error) return console.error(error);

        success(result.insertId);
      }
    );
  }

  makeBikeOrder(order_id, chassis_id, success) {
    connection.query('insert into Bike_Order values (?, ?)', [order_id, chassis_id], (error, result) => {
      if (error) return console.error(error);
      success();
    });
  }

  makeEquipmentOrder(order_id, eq_id, success) {
    connection.query('insert into Equipment_Order values (?, ?)', [order_id, eq_id], (error, result) => {
      if (error) return console.error(error);
      success();
    });
  }
  getBikeOrder(order_id, success) {
    connection.query('SELECT B.model, B.chassis_id, PT.day_price FROM Product_Type PT, Orders O, Bike B, Bike_Order BO WHERE B.chassis_id = BO.chassis_id AND BO.order_nr = O.order_nr AND B.model = PT.model AND O.order_nr = ?', [order_id], (error, result) => {
      if (error) return console.error(error);
      success(result);
    });
  }
  getEquipmentOrder(order_id, success) {
    connection.query('SELECT E.model, E.eq_id, PT.day_price FROM Product_Type PT, Orders O, Equipment E, Equipment_Order EO WHERE E.eq_id = EO.eq_id AND EO.order_nr = O.order_nr AND E.model = PT.model AND O.order_nr = ?', [order_id], (error, result) => {
      if (error) return console.error(error);
      success(result);
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
      'select chassis_id, gear, wheel_size, broken, storage, luggage from Bike where Bike.model = ?',
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

  getDistinctBikeModel(success) {
    connection.query(
      'SELECT B.model, count(*) as "max",day_price from Bike B, Product_Type PT where B.model=PT.model group by B.model',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
  getDistinctEquipmentModel(success) {
    connection.query(
      'SELECT E.model, count(*) as "max", day_price from Equipment E, Product_Type PT where E.model=PT.model group by model',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getCountBikeModel(from, to, success) {
    connection.query(
      'Select B.model, count(B.chassis_id) as "max", day_price from Bike B, Product_Type PT where B.chassis_id not in  (SELECT B.chassis_id from Bike B left outer join Bike_Order BO on B.chassis_id=BO.chassis_id left outer join Orders O on BO.order_nr = O.order_nr WHERE (? >= O.from_date and ? <= O.to_date) OR (? <= O.from_date and ? <= O.to_date and ? >= O.from_date) OR (? >= O.from_date and ? >= O.to_date and ? <= O.to_date) OR (? <= O.from_date and ? >= O.to_date)) and B.model = PT.model group by B.model',
      [from, to, from, to, to, from, to, from, from, to],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
  getCountEquipmentModel(from, to, success) {
    connection.query(
      'Select E.model, count(E.eq_id) as "max", day_price from Equipment E, Product_Type PT where E.eq_id not in  (SELECT E.eq_id from Equipment E left outer join Equipment_Order EO on E.eq_id=EO.eq_id left outer join Orders O on EO.order_nr = O.order_nr WHERE (? >= O.from_date and ? <= O.to_date) OR (? <= O.from_date and ? <= O.to_date and ? >= O.from_date) OR (? >= O.from_date and ? >= O.to_date and ? <= O.to_date) OR (? <= O.from_date and ? >= O.to_date)) and E.model = PT.model group by E.model',
      [from, to, from, to, to, from, to, from, from, to],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getAvailableChassisId(model, from, to, nrbikes, success) {
    connection.query(
      'Select B.chassis_id from Bike B where B.chassis_id not in (SELECT B.chassis_id from Bike B left outer join Bike_Order BO on B.chassis_id=BO.chassis_id left outer join Orders O on BO.order_nr = O.order_nr WHERE (? >= O.from_date and ? <= O.to_date) OR (? <= O.from_date and ? <= O.to_date and ? >= O.from_date) OR (? >= O.from_date and ? >= O.to_date and ? <= O.to_date) OR (? <= O.from_date and ? >= O.to_date)) and B.model=? limit ?',
      [from, to, from, to, to, from, to, from, from, to, model, nrbikes],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getAvailableEqId(model, from, to, nreq, success) {
    connection.query(
      'Select E.eq_id from Equipment E where E.eq_id not in (SELECT E.eq_id from Equipment E left outer join Equipment_Order EO on E.eq_id=EO.eq_id left outer join Orders O on EO.order_nr = O.order_nr WHERE (? >= O.from_date and ? <= O.to_date) OR (? <= O.from_date and ? <= O.to_date and ? >= O.from_date) OR (? >= O.from_date and ? >= O.to_date and ? <= O.to_date) OR (? <= O.from_date and ? >= O.to_date)) and E.model=? limit ?',
      [from, to, from, to, to, from, to, from, from, to, model, nreq],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

class ReparationService {
  getReparations(success) {
    connection.query('select rep_id, chassis_id, r_fdate, r_tdate from Reparations',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getReparationDetails(r_id, success, failure) {
    connection.query(
      'select rep_id, chassic_id, r_fdate, r_tdate, r_expenses, r_description from Reparations where r_id = ?',
      [r_id],
      (error, results) => {
        if (error) {
          return console.error(error);
        }
        success(results[0]);
      }
    );
  }
}

export let reparationService = new ReparationService();
export let employeeService = new EmployeeService();
export let customerService = new CustomerService();
export let storageService = new StorageService();
export let orderService = new OrderService();
