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
  tableHead = ['Ordrenummer', 'Kundenummer', 'Kundenavn', 'Antall sykler', 'Antall utstyr'];
  render() {
    if (!this.orders)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <VerticalTableComponent tableBody={this.orders} tableHead={this.tableHead} deleteButton={false} />
      </>
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
  tableHead = ['Ordrenummer', 'Ansatt id', 'Kunde id', 'Fra-dato', 'Til-dato', 'Utleveringsted', 'Innleveringsted'];
  render() {
    if (!this.order) return null;
    return (
      <>
        <Card title="Ordredetaljer">
          <HorizontalTableComponent tableBody={this.order} tableHead={this.tableHead} checkDate={true} />
          <button>&#9881;</button>
          <button>&#10004;</button>
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
  }
}
