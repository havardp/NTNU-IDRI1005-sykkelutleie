import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//node modules
import ReactLoading from 'react-loading';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { locationService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Location extends Component {
  pickup = null;
  dropoff = null;
  newLocation = {};
  render() {
    if (!this.pickup || !this.dropoff)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <Card title="Lokasjoner">
          <div>Nåværende hentesteder: {this.pickup.map(location => location.l_name + ', ')}</div>
          <br />
          <div>Nåværende avleveringssteder: {this.dropoff.map(location => location.l_name + ', ')}</div>
          <br />
          <label>Legg til sted</label>
          <input type="text" placeholder="..." onChange={e => (this.newLocation.name = e.target.value)} />
          <br />
          <label>Lager </label>
          <input type="checkbox" onChange={e => (this.newLocation.storage = e.target.checked)} />
          <br />
          <button onClick={this.add}>Legg til</button>
        </Card>
      </>
    );
  }

  mounted() {
    locationService.getPickupLocation(pickup => {
      this.pickup = pickup;
    });
    locationService.getDropoffLocation(dropoff => {
      this.dropoff = dropoff;
    });
    this.newLocation.storage = 0;
  }

  add() {
    locationService.addLocation(this.newLocation, () => this.mounted());
  }
}
