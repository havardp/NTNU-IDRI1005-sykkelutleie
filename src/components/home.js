import * as React from 'react';
import { Component } from 'react-simplified';

//Import the hashistory from index.js to be able to change path
import { history } from '../index.js';

export class Home extends Component {
  render() {
    return <div className="main">HOME</div>;
  }
}