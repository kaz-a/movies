import React, { Component } from 'react';
import reactDOM from 'react-dom';
import * as d3 from 'd3';

import LineChart from './LineChart';

class Main extends Component {
  constructor(){
    super()
    this.state = { grossByDate: [], dataByOpening$: [], dataByTotal$: [] }
  }
  componentDidMount(){
    d3.csv('/data/movies.csv', (err, data) => {
      if(err) throw err;

      data.forEach(d => {
        d.id = +d[''];
        d.openDate = d.open_date
        d.openingGross = +d.opening_gross.replace(/\$|,/g, '').trim();
        d.theaters = +d.theaters;
        d.totalGross = +d.total_gross.replace(/\$|,/g, '').trim();
      })

      console.log('data:', data)

      const grossByDate = d3.nest().key(d => d.openDate)
        .rollup(d => {
          return {
            openingSum: d3.sum(d, e => e.openingGross),
            totalSum: d3.sum(d, e => e.totalGross)
          }
        })
        .entries(data)
       

      // const dataByDateAndStudio = d3.nest().key(d => d.openDate).key(d => d.studio).entries(data)
      const dataByOpening$ = d3.nest().key(d => d.openingGross).entries(data);
      const dataByTotal$ = d3.nest().key(d => d.totalGross).entries(data);

      this.setState({ grossByDate, dataByOpening$, dataByTotal$ })
    })
  }

  render(){
    const { grossByDate, dataByOpening$, dataByTotal$ } = this.state;

    return (
      <div className="container">
        <LineChart grossByDate={ grossByDate } />
      </div>
    )
  }
  
  
}

export default Main;