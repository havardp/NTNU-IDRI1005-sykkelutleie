import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//node modules
import ReactLoading from 'react-loading';
import arraySort from 'array-sort';
import Select from 'react-select';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { orderService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Orders extends Component {
  orders = null;
  ready = false;
  sortedBy = 'order_nr';

  //variables for the select searchbar
  selectedOption = null;
  temporaryOptions = [];
  searchbarOptions = null;
  temporary = null;

  render() {
    if (!this.ready)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        {this.searchbarOptions && (
          <div className="row">
            <div className="col-10">
              <Select
                value={this.selectedOption}
                placeholder="Søk ordre..."
                onChange={e => {
                  this.selectedOption = e;
                  history.push('/orders/' + e.value);
                }}
                options={this.searchbarOptions}
              />
            </div>
            <div className="col-2">
              <button className="btn btn-info btn-lg" onClick={() => history.push('/neworder')}>
                &#10010;
              </button>
            </div>
          </div>
        )}
        <VerticalTableComponent
          tableBody={this.orders}
          tableHead={'order'}
          deleteButton={true}
          delete={this.delete}
          whereTo={this.props.match.path}
          sort={this.sort}
          className={'clickable'}
        />
      </>
    );
  }
  mounted() {
    orderService.getOrders(orders => {
      this.orders = orders;
      this.orders.map(order => {
        order.from_date =
          order.from_date.getFullYear() +
          '-' +
          ((order.from_date.getMonth() + 1).toString().length == 1
            ? '0' + (order.from_date.getMonth() + 1)
            : order.from_date.getMonth() + 1) +
          '-' +
          (order.from_date.getDate().toString().length == 1
            ? '0' + order.from_date.getDate()
            : order.from_date.getDate());
        order.to_date =
          order.to_date.getFullYear() +
          '-' +
          ((order.to_date.getMonth() + 1).toString().length == 1
            ? '0' + (order.to_date.getMonth() + 1)
            : order.to_date.getMonth() + 1) +
          '-' +
          (order.to_date.getDate().toString().length == 1 ? '0' + order.to_date.getDate() : order.to_date.getDate());
      });
      this.ready = true;
    });
    orderService.getOrderSearch(result => {
      this.temporaryOptions = [];
      result.map(e => {
        this.temporaryOptions.push({ value: e.order_nr, label: e.fullname });
      });
      this.searchbarOptions = this.temporaryOptions;
    });
  }

  delete(id) {
    if (window.confirm('Er du sikker på at du vil slette denne orderen?'))
      orderService.deleteOrder(id, () => {
        this.ready = false;
        this.mounted();
      });
  }

  sort(sort) {
    if (sort == this.sortedBy) {
      arraySort(this.orders, sort, { reverse: true });
      this.sortedBy = '';
    } else {
      arraySort(this.orders, sort);
      this.sortedBy = sort;
    }
  }
}

export class OrderDetail extends Component {
  order = null;
  orderBikes = null;
  orderEquipment = null;
  sortedByBike = 'model';
  sortedByEquipment = 'model';
  editable = false;
  render() {
    if (!this.order || typeof this.order.from_date == 'object' || typeof this.order.to_date == 'object')
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Ordredetaljer">
          <HorizontalTableComponent
            tableBody={this.order}
            tableHead={'order'}
            editable={this.editable}
            sendStateToParent={this.updateOrder}
          />
          <button onClick={() => (this.editable ? (this.editable = false) : (this.editable = true))}>
            &#57604; Endre
          </button>
        </Card>
        <Card title="Sykler og utstyr">
          <div className="row">
            <div className="col-6">
              <VerticalTableComponent
                tableBody={this.orderBikes}
                tableHead={'orderBike'}
                deleteButton={false}
                whereTo={this.props.match.path}
                sort={this.sortBike}
                className={'clickable'}
              />
            </div>
            <div className="col-6">
              <VerticalTableComponent
                tableBody={this.orderEquipment}
                tableHead={'orderEquipment'}
                deleteButton={false}
                whereTo={this.props.match.path}
                sort={this.sortEquipment}
                className={'clickable'}
              />
            </div>
          </div>
        </Card>
      </>
    );
  }

  mounted() {
    orderService.getOrderDetails(this.props.match.params.id, result => {
      this.orderBikes = result[1];
      this.orderEquipment = result[2];
      this.order = result[0][0];
      this.order.from_date =
        this.order.from_date.getFullYear() +
        '-' +
        ((this.order.from_date.getMonth() + 1).toString().length == 1
          ? '0' + (this.order.from_date.getMonth() + 1)
          : this.order.from_date.getMonth() + 1) +
        '-' +
        (this.order.from_date.getDate().toString().length == 1
          ? '0' + this.order.from_date.getDate()
          : this.order.from_date.getDate());
      this.order.to_date =
        this.order.to_date.getFullYear() +
        '-' +
        ((this.order.to_date.getMonth() + 1).toString().length == 1
          ? '0' + (this.order.to_date.getMonth() + 1)
          : this.order.to_date.getMonth() + 1) +
        '-' +
        (this.order.to_date.getDate().toString().length == 1
          ? '0' + this.order.to_date.getDate()
          : this.order.to_date.getDate());
    });
  }

  updateOrder(value, key) {
    orderService.updateOrder(key, value, this.props.match.params.id, () => console.log('Ordre endret'));
  }

  sortBike(sort) {
    if (sort == this.sortedByBike) {
      arraySort(this.orderBikes, sort, { reverse: true });
      this.sortedByBike = '';
    } else {
      arraySort(this.orderBikes, sort);
      this.sortedByBike = sort;
    }
  }
  sortEquipment(sort) {
    if (sort == this.sortedByEquipment) {
      arraySort(this.orderEquipment, sort, { reverse: true });
      this.sortedByEquipment = '';
    } else {
      arraySort(this.orderEquipment, sort);
      this.sortedByEquipment = sort;
    }
  }
}
