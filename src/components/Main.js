import React, { Component } from 'react';
import reactDOM from 'react-dom';
import * as d3 from 'd3';

class Main extends Component {
  constructor(){
    super()
    this.state = {
      data: []
    }
  }
  componentDidMount(){
    d3.csv('/data/Copy of movies.csv', (err, data) => {
      if(err) throw err;
      console.log('data:', data)
      this.setState({ data })
    })
  }

  render(){
    const { data } = this.state;

    return (
      <div className="container">
        <h1>helloooooo</h1>
      </div>
    )
  }
  
  
}

export default Main;