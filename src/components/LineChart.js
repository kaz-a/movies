import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class LineChart extends Component {
  constructor(){
    super()
    this.drawLine = this.drawLine.bind(this)
  }

  drawLine(){
    const { grossByDate } = this.props;

    
    const margin = { top: 20, right: 20, bottom: 100, left: 70 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const svg = d3.select(".linechart").append("svg").attr("class", "linechart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    
    const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime().range([0, width]),
      y = d3.scaleLinear().range([height, 0]); 

    console.log('grossByDate', grossByDate)
   
    var line = d3.line()
      .x(d => x(d.key))
      .y(d => y(d.value.openingSum))

    x.domain(d3.extent(grossByDate, d => d.key));
    y.domain(d3.extent(grossByDate, d => d.value.openingSum));

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

    g.append("path")
      .datum(grossByDate)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);


  }

  render(){
    return (
      <div className="linechart">
        <h3>How has the movie business been in general over the last 3 years?</h3>
        { this.drawLine() }

      </div>
    )
  }
  
}

export default LineChart;