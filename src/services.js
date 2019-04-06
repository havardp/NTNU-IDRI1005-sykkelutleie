import { connection } from './mysql_connection';

class EmployeeService {
  getEmployee(username, success, failure) {
    connection.query('select password, department from Employee where e_id = ?', [username], (error, results) => {
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

  getEmployeeSearch(success) {
    connection.query(
      'select e_id, concat(e_id, " - ", fname, " ",lname) as "fullname" from Employee',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
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

  deleteEmployee(id, success) {
    connection.query('delete from Employee where e_id = ?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  updateEmployee(key, value, id, success) {
    connection.query('update Employee set ??=? where e_id=?', [key, value, id], (error, result) => {
      if (error) return console.error(error);
      success();
    });
  }
}

class CustomerService {
  getCustomers(success) {
    connection.query(
      'select Customer.c_id, c_fname, c_lname, count(order_nr) as nrorder from Customer left  join Orders on Customer.c_id = Orders.c_id group by Customer.c_id',
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
      'SELECT O.order_nr, O.c_id, count(distinct chassis_id) as nrbikes, count(distinct eq_id) as nrequipment FROM Orders O left join Bike_Order BO on O.order_nr = BO.order_nr left join Equipment_Order EO on O.order_nr = EO.order_nr left join Customer C on O.c_id = C.c_id WHERE O.c_id = ? GROUP by O.order_nr',
      [id],
      (error, orders) => {
        if (error) return console.error(error);
        success(orders);
      }
    );
  }

  updateCustomer(key, value, id, success) {
    connection.query('update Customer set ??=? where c_id=?', [key, value, id], (error, result) => {
      if (error) return console.error(error);
      success();
    });
  }
}

class OrderService {
  getOrders(success) {
    connection.query(
      'SELECT O.order_nr, O.c_id, concat(c_fname, " ", c_lname) as "fullname", count(distinct chassis_id) as nrbikes, count(distinct eq_id) as nrequipment, from_date, to_date FROM Orders O left join Bike_Order BO on O.order_nr = BO.order_nr left join Equipment_Order EO on O.order_nr = EO.order_nr left join Customer C on O.c_id = C.c_id GROUP by O.order_nr',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getOrderDetails(order_nr, success) {
    connection.query(
      'select * from Orders where order_nr = ?; SELECT B.model, B.chassis_id, PT.day_price FROM Product_Type PT, Orders O, Bike B, Bike_Order BO WHERE B.chassis_id = BO.chassis_id AND BO.order_nr = O.order_nr AND B.model = PT.model AND O.order_nr = ?; SELECT E.model, E.eq_id, PT.day_price FROM Product_Type PT, Orders O, Equipment E, Equipment_Order EO WHERE E.eq_id = EO.eq_id AND EO.order_nr = O.order_nr AND E.model = PT.model AND O.order_nr = ?',
      [order_nr, order_nr, order_nr],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getOrderSearch(success) {
    connection.query(
      'select O.order_nr, concat(O.order_nr, " - ", c_fname, " " ,c_lname," - ", from_date, "/", to_date) as "fullname" from Orders O, Customer C where O.c_id = C.c_id',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  makeOrder(e_id, c_id, details, success) {
    connection.query(
      'insert into Orders values (null, ?, ?, ?, ?, ?, ?, ?)',
      [
        e_id,
        c_id,
        details.fromDate,
        details.toDate,
        details.pickupLocation,
        details.dropoffLocation,
        details.totalPrice
      ],
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

  deleteOrder(id, success) {
    connection.query(
      'delete from Bike_Order where order_nr = ?; delete from Equipment_Order where order_nr = ?; delete from Orders where order_nr = ?',
      [id, id, id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  updateOrder(key, value, id, success) {
    connection.query('update Orders set ??=? where order_nr=?', [key, value, id], (error, result) => {
      if (error) return console.error(error);
      success();
    });
  }
}

class StorageService {
  getModels(success) {
    connection.query(
      'SELECT PT.model, description, day_price, count(B.model) as "countBikes" FROM Product_Type PT left join Bike B on B.model = PT.model where PT.bike=1 group by PT.model; SELECT PT.model, description,  day_price, count(E.model) as "countEquipment" FROM Product_Type PT left join Equipment E on E.model = PT.model where PT.bike= 0 Group by PT.model',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getBike(id, success, failure) {
    connection.query(
      'select chassis_id, gear, wheel_size, stolen, storage, luggage from Bike where Bike.model = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);
        if (results.length == 0) return;

        success(results);
      }
    );
  }

  getBikeDetails(id, success) {
    connection.query(
      'select chassis_id, model, gear, wheel_size, stolen, storage, luggage from Bike B where chassis_id = ?',
      [id],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
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

  getDistinctModel(success) {
    connection.query(
      'SELECT B.model, count(*) as "max",day_price from Bike B, Product_Type PT where B.model=PT.model group by B.model; SELECT E.model, count(*) as "max", day_price from Equipment E, Product_Type PT where E.model=PT.model group by model',
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  getCountModel(from, to, success) {
    connection.query(
      'Select B.model, count(B.chassis_id) as "max", day_price from Bike B, Product_Type PT where B.chassis_id not in  (SELECT B.chassis_id from Bike B left outer join Bike_Order BO on B.chassis_id=BO.chassis_id left outer join Orders O on BO.order_nr = O.order_nr WHERE (? >= O.from_date and ? <= O.to_date) OR (? <= O.from_date and ? <= O.to_date and ? >= O.from_date) OR (? >= O.from_date and ? >= O.to_date and ? <= O.to_date) OR (? <= O.from_date and ? >= O.to_date)) and B.model = PT.model group by B.model; Select E.model, count(E.eq_id) as "max", day_price from Equipment E, Product_Type PT where E.eq_id not in  (SELECT E.eq_id from Equipment E left outer join Equipment_Order EO on E.eq_id=EO.eq_id left outer join Orders O on EO.order_nr = O.order_nr WHERE (? >= O.from_date and ? <= O.to_date) OR (? <= O.from_date and ? <= O.to_date and ? >= O.from_date) OR (? >= O.from_date and ? >= O.to_date and ? <= O.to_date) OR (? <= O.from_date and ? >= O.to_date)) and E.model = PT.model group by E.model',
      [from, to, from, to, to, from, to, from, from, to, from, to, from, to, to, from, to, from, from, to],
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
  addProductType(model, bike, success) {
    connection.query(
      'INSERT INTO Product_Type VALUES (?, ?, ?, ?)',
      [model.model, model.description, model.day_price, bike],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  addBike(model, bikeDetails, success) {
    connection.query(
      'INSERT INTO Bike VALUES (null, ?, ?, ?,null, 0,?,?)',
      [model, bikeDetails.gear, bikeDetails.wheel_size, bikeDetails.location, bikeDetails.luggage],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  addEquipment(model, success) {
    connection.query('INSERT INTO Equipment VALUES (null, ?)', [model], (error, results) => {
      if (error) return console.error(error);
      success();
    });
  }

  updateBike(key, value, id, success) {
    connection.query('update Bike set ??=? where chassis_id=?', [key, value, id], (error, result) => {
      if (error) return console.error(error);
      success();
    });
  }

  deleteModel(id, success) {
    connection.query('delete from Product_Type where model = ?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  deleteBike(id, success) {
    connection.query(
      'delete from Bike_Order where chassis_id = ?;delete from Reparations where chassis_id = ?;delete from Transportation where chassis_id=?;delete from Bike where chassis_id = ?',
      [id, id, id, id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }

  deleteEquipment(id, success) {
    connection.query(
      'delete from Equipment_Order where eq_id = ?; delete from Equipment where eq_id = ?',
      [id, id],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      }
    );
  }
}

class ReparationService {
  getReparations(success) {
    connection.query('select rep_id, chassis_id, r_fdate, r_tdate from Reparations', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getReparationDetails(rep_id, success, failure) {
    connection.query(
      'select rep_id, chassis_id, r_fdate, r_tdate, r_expenses, r_description from Reparations where rep_id = ?',
      [rep_id],
      (error, results) => {
        if (error) {
          return console.error(error);
        }
        success(results[0]);
      }
    );
  }

  addReparation(rep, id, success) {
    connection.query(
      'INSERT INTO Reparations VALUES (null, ?, ?, ?, ?, ?)',
      [id, rep.r_fdate, rep.r_tdate, rep.expenses, rep.r_description],
      (error, results) => {
        if (error) return console.error(error);

        success();
      }
    );
  }

  updateRep(key, value, id, success) {
    connection.query('update Reparations set ??=? where rep_id=?', [key, value, id], (error, result) => {
      if (error) return console.error(error);
      success();
    });
  }
}

class TransportationService {
  getTransportations(success) {
    connection.query('SELECT DISTINCT T.t_id, T.order_nr, T.chassis_id, O.to_place, B.storage FROM Transportation T, Bike B, Orders O WHERE T.order_nr = O.order_nr and T.chassis_id = B.chassis_id and T.t_complete = 0', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
  updateTransport(id,success) {
    connection.query('UPDATE Transportation SET t_complete = 1 WHERE t_id = ?',[id], (error, results) => {
      if (error) return console.error(error);

      success();
    });
  }
}

export let transportationService = new TransportationService();
export let reparationService = new ReparationService();
export let employeeService = new EmployeeService();
export let customerService = new CustomerService();
export let storageService = new StorageService();
export let orderService = new OrderService();
