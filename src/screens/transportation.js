import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//node modules
import ReactLoading from 'react-loading';
import arraySort from 'array-sort';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { transportationService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Transportations extends Component {
  transportations = null;
  ready = false;
  sortedBy = 't_id';
  render() {
    if (!this.ready)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Sykler som trenger transport">
          <VerticalTableComponent
            tableBody={this.transportations}
            tableHead={'transportations'}
            checkDate={false}
            deleteButton={false}
            whereTo={this.props.match.path}
            sort={this.sort}
          />
        </Card>
      </>
    );
  }
  mounted() {
    transportationService.getTransportations(transportations => {
      this.transportations = transportations;
      this.ready = true;
    });
  }

  sort(sort) {
    if (sort == this.sortedBy) {
      arraySort(this.transportations, sort, { reverse: true });
      this.sortedBy = '';
    } else {
      arraySort(this.transportations, sort);
      this.sortedBy = sort;
    }
  }
}
