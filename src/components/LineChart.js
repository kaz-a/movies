import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import RaisedButton from 'material-ui/RaisedButton';
import BubbleChart from './BubbleChart';

class LineChart extends Component {
  constructor(){
    super();
    this.state = {
      circleClicked: false,
      selectedDate: ""
    }
    this.drawLines = this.drawLines.bind(this);
    this.handleCircleClick = this.handleCircleClick.bind(this);
  }

  componentDidMount(){
    this.drawLines();
  }

  handleCircleClick(data){
    if(this.state.circleClicked){
      this.setState({ circleClicked: false, selectedDate: "" });
    }
    this.setState({ circleClicked: true, selectedDate: data });

    const scrollHeight = $(".home").height() + $(".timetrend").height() + 100;
    $("html, body").animate({ scrollTop: scrollHeight }, 600);
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

      const { dateFormat, margin, width, height, svg, g, tooltip } = this.props.setupFunc("linechart", 400);
      const x = d3.scaleTime().range([0, width]), y = d3.scaleLinear().range([height, 0]); 
      const min = d3.min(data, d => d.totalGross), max = d3.max(data, d => d.totalGross);

      const xExtent = d3.extent(data, d => d.openDate), yExtent = d3.extent(data, d => d.totalGross);
      x.domain(xExtent);
      y.domain(d3.extent([0, max]));

      const totalLine = d3.line().x(d => x(d.openDate)).y(d => y(d.totalGross));
      const openingLine = d3.line().x(d => x(d.openDate)).y(d => y(d.openingGross));

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

      d3.select(".line-btn").on("click", d => {
        g.append("path")
          .datum(data)
          .attr("class", "linechart-opening")
          .attr("fill", "none")
          .attr("stroke", "#f54e56")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", openingLine);
      })
      
      g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        // .filter(d => d.totalGross >= 300000000)
        .attr("class", "linechart-circle")
        .attr("r", 3.5)
        .attr("cx", d => x(d.openDate))
        .attr("cy", d => y(d.totalGross))  
        // .attr("fill", "#3ebdb2")
        .attr("fill", d => d.totalGross >= 300000000 ? "#3ebdb2" : d.totalGross >= 100000000 ? "#b49a3d" : "#023460")
        .attr("stroke", "#3ebdb2")
        .on("mouseover", function(d) {
          d3.select(this).transition().ease(d3.easeCubicInOut)
            .duration(500).style("stroke-width", "1em")
          tooltip.html(`<span>${dateFormat(d.openDate)}</span><br />
              Total gross: $${Math.round(d.totalGross/1000000)}M`)
            .style("opacity", 0.7)
            .style("left", (d3.event.pageX)+0 + "px") 
            .style("top", (d3.event.pageY)-0 + "px");
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0);
          d3.select(this).transition().ease(d3.easeCubicInOut)
            .duration(500).style("stroke-width", 0);
        })
        .on("click", d => this.handleCircleClick(d.openDate)); 
    })
  }

  render(){
    const { data, setupFunc } = this.props;
    const { circleClicked, selectedDate } = this.state;

    return (
      <div>
        <div className="content timetrend">
          <div className="row">
            <div className="col-md-4 text">
              <h3>How was the movie business in general between 2014 and 2016?</h3>
              <p>Generally the total gross peaked in June and December of each year. 
              <span className="color-text"> Blue cicles</span> are placed on the days when the total gross $ was greater than $300M, 
              <span className="color-text"> yellow circles</span> on days greater than $100M, and 
              <span className="color-text"> dark circles</span> on less than $100M.
              Click on a circle to show which movies/genres were doing well on these peak days.</p>
              <RaisedButton className="line-btn" label="Show Opening Gross $" default={true} style={{margin:12}} />
            </div> 
            <div className="col-md-8 linechart"></div>
          </div>
        </div>
        <div>
        {
          circleClicked ? <BubbleChart data={ data } selectedDate={ selectedDate } setupFunc={ setupFunc } /> : ""
        }
        </div>
      </div>
    )
  }
}

export default LineChart;