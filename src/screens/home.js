import * as React from 'react';
import { Component } from 'react-simplified';

//Bootstrap imports
import { Card } from '../widgets';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

//reusable components
import { VerticalTableComponent, HorizontalTableComponent } from '../components/tables.js';

//Imports for sql queries
import { reparationService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Home extends Component {
  render() {
    return <div><Reparations /></div>
  }
}

class Reparations extends Component {
  reparations = null;
  tableHead = ['Reprasjons id', 'Ramme id', 'Fra-dato', 'Til-dato'];
  ready=false
  render() {

      console.log(history.location.pathname)
    if (!this.ready)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (<>
     <Card title="Oversikt over reparasjoner">
     <VerticalTableComponent
        tableBody={this.reparations}
        tableHead={this.tableHead}
        checkDate={true}
        deleteButton={false}
        whereTo={"reparations"}
      />
      </Card></>
    );
  }
  mounted() {
    reparationService.getReparations(reparations => {
      this.reparations = reparations;
      this.reparations.map(rep => {
        rep.r_fdate = rep.r_fdate.getDate() + '-' + (rep.r_fdate.getMonth() + 1) + '-' + rep.r_fdate.getFullYear();
        rep.r_tdate = rep.r_tdate.getDate() + '-' + (rep.r_tdate.getMonth() + 1) + '-' + rep.r_tdate.getFullYear();
      })
      this.ready = true
    });

  }

}

export class ReparationDetails extends Component {

    reparation = null;
    tableHead = ['Reparasjons id', 'Ramme id', 'Fra-dato', 'Til-dato', 'Reparasjons kostnad', 'Beskrivelse'];

    render() {
      if (!this.reparation)
        return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
      return (
        <Card title="Reparasjonsdetaljer">
          <HorizontalTableComponent tableBody={this.reparation} tableHead={this.tableHead} checkDate={true} />
        </Card>
      );
    }

    mounted() {
      console.log("repartions")
      reparationService.getReparationDetails(
        this.props.match.params.id,
        result => {
          this.reparation = result;
          this.reparation.r_fdate = result.r_fdate.getDate() + '-' + (result.r_fdate.getMonth() + 1) + '-' + result.r_fdate.getFullYear();
          this.reparation.r_tdate = result.r_tdate.getDate() + '-' + (result.r_tdate.getMonth() + 1) + '-' + result.r_tdate.getFullYear();
        },
        () => console.log('failure')
      );
    }

}
