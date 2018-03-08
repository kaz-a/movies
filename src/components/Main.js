import React, { Component } from 'react';
import reactDOM from 'react-dom';
import * as d3 from 'd3';
import Home from './Home';
import LineChart from './LineChart';

class Main extends Component {
  constructor(){
    super()
    this.state = { 
      data: [], 
      // dataByOpening$: [], dataByTotal$: [] 
    }
  }
  componentDidMount(){
    d3.csv('/data/movies.csv', (err, data) => {
      if(err) throw err;

      data.forEach(d => {
        d.id = +d[''];
        d.openDate = new Date(d.open_date)
        d.openingGross = +d.opening_gross;
        d.theaters = +d.theaters;
        d.totalGross = +d.total_gross;
      })

      // const dataByDateAndStudio = d3.nest().key(d => d.openDate).key(d => d.studio).entries(data)
      // const dataByOpening$ = d3.nest().key(d => d.openingGross).entries(data);
      // const dataByTotal$ = d3.nest().key(d => d.totalGross).entries(data);

      this.setState({ data })
    })
  }

  render(){
    const { data } = this.state;

    return (
      <div className="container">
        <Home />
        <LineChart data={ data } />
      </div>
    )
  }
  
  
}

export default Main;