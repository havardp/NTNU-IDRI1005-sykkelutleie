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
          order.from_date.getDate() + '-' + (order.from_date.getMonth() + 1) + '-' + order.from_date.getFullYear();
        order.to_date =
          order.to_date.getDate() + '-' + (order.to_date.getMonth() + 1) + '-' + order.to_date.getFullYear();
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
    orderService.deleteOrder(id, () => this.mounted());
  }

  sort(sort) {
    arraySort(this.orders, sort);
  }
}

export class OrderDetail extends Component {
  order = null;
  orderBikes = null;
  orderEquipment = null;
  render() {
    if (!this.order || typeof this.order.from_date == 'object' || typeof this.order.to_date == 'object')
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Ordredetaljer">
          <HorizontalTableComponent tableBody={this.order} tableHead={'order'} />
          <button>&#9881;</button>
          <button>&#10004;</button>
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
        this.order.from_date.getDate() +
        '-' +
        (this.order.from_date.getMonth() + 1) +
        '-' +
        this.order.from_date.getFullYear();
      this.order.to_date =
        this.order.to_date.getDate() +
        '-' +
        (this.order.to_date.getMonth() + 1) +
        '-' +
        this.order.to_date.getFullYear();
    });
  }

  sortBike(sort) {
    arraySort(this.orderBikes, sort);
  }
  sortEquipment(sort) {
    arraySort(this.orderEquipment, sort);
  }
}
