import * as React from 'react';
import { Component } from 'react-simplified';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';
import { CustomerAdd } from './customers.js';

//Bootstrap imports
import { Card } from '../widgets';

//Imports for sql queries
import { storageService, orderService } from '../services';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

export class NewOrder extends Component {
  distinctBikeModels = null;
  distinctEquipmentModels = null;
  render() {
    if (!this.distinctBikeModels || !this.distinctEquipmentModels)
      return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
    return (
      <>
        <div className="row">
          <Card title="Sykkel" className="col-6">
            {this.distinctBikeModels.map(model => (
              <>
                {Object.values(model).map(data => (
                  <div key={data}>
                    {data} <input type="number" value="0" />
                  </div>
                ))}
              </>
            ))}
          </Card>
          <div className="col-6">
            <Card title="Utstyr" className="col-6">
              {this.distinctEquipmentModels.map(model => (
                <>
                  {Object.values(model).map((data, index) => (
                    <div key={data + index}>
                      {data} <input type="number" value="0" />
                    </div>
                  ))}
                </>
              ))}
            </Card>
          </div>
        </div>
        <Card>
          <div>
            Fra-dato <input type="date" />
          </div>
          <div>
            Til-dato <input type="date" />
          </div>
          <div>
            Hentested <input type="text" />
          </div>
          <div>
            Avleveringssted <input type="text" />
          </div>
        </Card>
      </>
    );
  }

  mounted() {
    storageService.getDistinctBikeModel(result => {
      this.distinctBikeModels = result;
    });
    storageService.getDistinctEquipmentModel(result => {
      this.distinctEquipmentModels = result;
    });
  }
}
