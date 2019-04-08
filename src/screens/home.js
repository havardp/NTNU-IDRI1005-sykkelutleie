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
import { overviewService } from '../services';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Home extends Component {
  info = null;
  render() {
    if (!this.info)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <div className="row">
          <div className="col-6">
            <Card title="Velkommen">
              <div>
                Her i sykkelutleie AS har vi {this.info.nrEmployees} ansatte og vi har registrert {this.info.nrCustomer}{' '}
                kunder
              </div>
              <br />
              <div>
                Per dags dato har vi et sortement på {this.info.nrBikes} sykler og {this.info.nrEquipment} utstyr
              </div>
            </Card>
          </div>
          <div className="col-6">
            <Card title="Salgsinnteker">
              Til nå har våre kunder lagt inn {this.info.nrOrders} ordre, og vi har en inntekt på {this.info.nrRevenue}
              kr på disse ordrene
            </Card>
          </div>
        </div>
        <center>
          <img src="../src/media/cycle.gif" height="400px" width="600px" style={{ marginTop: '50px' }} />
        </center>
      </>
    );
  }

  mounted() {
    overviewService.getOverview(result => {
      this.info = result;
    });
  }
}
