import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { orderService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Orders extends Component {
  orders = null;

  render() {
    if (!this.orders)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <VerticalTableComponent
        tableBody={this.orders}
        tableHead={'order'}
        deleteButton={false}
        whereTo={history.location.pathname}
      />
    );
  }
  mounted() {
    orderService.getOrders(orders => {
      this.orders = orders;
    });
  }
}

export class OrderDetail extends Component {
  order = null;
  orderBikes = null;
  orderEquipment = null;
  render() {
    if (
      !this.order ||
      !this.orderBikes ||
      !this.orderEquipment ||
      typeof this.order.from_date == 'object' ||
      typeof this.order.to_date == 'object'
    )
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
                whereTo={history.location.pathname}
              />
            </div>
            <div className="col-6">
              <VerticalTableComponent
                tableBody={this.orderEquipment}
                tableHead={'orderEquipment'}
                deleteButton={false}
                whereTo={history.location.pathname}
              />
            </div>
          </div>
        </Card>
      </>
    );
  }

  mounted() {
    orderService.getOrder(this.props.match.params.id, result => {
      this.order = result;
      this.order.from_date =
        result.from_date.getDate() + '-' + (result.from_date.getMonth() + 1) + '-' + result.from_date.getFullYear();
      this.order.to_date =
        result.to_date.getDate() + '-' + (result.to_date.getMonth() + 1) + '-' + result.to_date.getFullYear();
    });
    orderService.getBikeOrder(this.props.match.params.id, result => {
      this.orderBikes = result;
    });
    orderService.getEquipmentOrder(this.props.match.params.id, result => {
      this.orderEquipment = result;
    });
  }
}
