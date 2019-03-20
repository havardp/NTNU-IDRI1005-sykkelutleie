import * as React from 'react';
import { Component } from 'react-simplified';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';
import { CustomerAdd } from './customers.js';

//make it not show if loading is fast?
import ReactLoading from 'react-loading';

export class NewOrder extends Component {
  render() {
    return <ReactLoading type="spin" className="main spinner fade-in" color="#A9A9A9" height={200} width={200} />;
  }
}
