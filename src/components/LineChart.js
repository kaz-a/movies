import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import BubbleChart from './BubbleChart';

class LineChart extends Component {
  constructor(){
    super();
    this.state = {
      clicked: false,
      selectedDate: ""
    }
    this.drawLines = this.drawLines.bind(this);
  }

  componentDidMount(){
    this.drawLines();
  }

  drawLines(){
    d3.csv('/data/gross_by_date.csv', (err, data) => {
      if(err) throw err;

      data.forEach(d => {
        d.id = d[''];
        d.openDate = new Date(d.open_date);
        d.openingGross = +d.opening_gross;
        d.totalGross = +d.total_gross;
      })
      // console.log('line chart data:', data);

      const dateFormat = d3.timeFormat("%b %d, %Y")

      const margin = { top: 20, right: 50, bottom: 50, left: 100 };
      const width = 700 - margin.left - margin.right, 
        height = 400 - margin.top - margin.bottom;

      const svg = d3.select(".linechart").append("svg").attr("class", "linechart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
      
      const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const tooltip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

      const x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]); 

      const min = d3.min(data, d => d.totalGross),
        max = d3.max(data, d => d.totalGross);

      const xExtent = d3.extent(data, d => d.openDate),
        yExtent = d3.extent(data, d => d.totalGross);

      x.domain(xExtent);
      y.domain(d3.extent([0, max]));

      const totalLine = d3.line()
        .x(d => x(d.openDate))
        .y(d => y(d.totalGross));

      const openingLine = d3.line()
        .x(d => x(d.openDate))
        .y(d => y(d.openingGross));

      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .ticks(6).tickFormat(d3.timeFormat("%m/%d/%y")))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width/2)
        .attr("dy", "3em")
        .attr("text-anchor", "middle")
        .text("Open Date");
    
      g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .html("Gross ($)");

      g.append("path")
        .datum(data)
        .attr("class", "linechart-total")
        .attr("fill", "none")
        .attr("stroke", "#3ebdb2")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", totalLine);

      g.append("path")
        .datum(data)
        .attr("class", "linechart-opening")
        .attr("fill", "none")
        .attr("stroke", "#C6BB8C")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", openingLine);

      g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .filter(d => d.totalGross >= 600000000)
        .attr("class", "linechart-circle")
        .attr("r", 10)
        .attr("cx", d => x(d.openDate))
        .attr("cy", d => y(d.totalGross))  
        .attr("fill", "#3ebdb2")
        .attr("stroke", "#3ebdb2")
        .on("mouseover", function(d) {
          d3.select(this).transition().ease(d3.easeCubicInOut)
            .duration(500).style("stroke-width", "1em")
          tooltip.html(`<span>${dateFormat(d.openDate)}</span><br />Total gross: $${Math.round(d.totalGross/1000000)}M`)
            .style("opacity", 0.7)
            .style("left", (d3.event.pageX)+0 + "px") 
            .style("top", (d3.event.pageY)-0 + "px");
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0);
          d3.select(this).transition().ease(d3.easeCubicInOut)
            .duration(500).style("stroke-width", 0);
        })
        .on("click", d => {
          this.setState({ clicked: true, selectedDate: d.openDate })
        }); 
    })
  }

  render(){
    const { data } = this.props;
    const { clicked, selectedDate } = this.state;
    const selectedData = data.filter(d => {
      console.log(d.openDate === selectedDate)
      return d.openDate == selectedDate
    })
    console.log("selectedData", selectedData)

    return (
      <div className="content">
        <div className="row">
          <div className="col-md-4 text">
            <h3>How was the movie business in general between 2014 and 2016?</h3>
            <p>It seems like the movie sales peaked in June and December. 
            Click on a circle to show which movies/genres were doing well on these high peak days.</p>
          </div> 
          <div className="col-md-8 linechart"></div>
        </div>
        <div>
        {
          clicked ? <BubbleChart data={ data } selectedData={ selectedData } /> : ""
        }
        </div>
      </div>
    )
  }
  
}

export default LineChart;