import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class StudioChart extends Component {
  constructor(){
    super()
    this.darwBars = this.drawBars.bind(this);
  }

  componentDidMount(){
    this.drawBars();
  }

  drawBars(){
    const { data, selectedTitle, setupFunc } = this.props;     
    const studio = data.filter(d => d.title === selectedTitle); // get the data that contains the selectedTitle
    d3.select(".studioinfo").append("html")
      .html(`<em>*Highlighting studio ${studio[0].studio} that released ${selectedTitle}</em>`);

    d3.csv("/data/gross_by_studio.csv", (err, data) => {
      if(err) throw err;

      data.forEach(d => {
        d.openingGross = +d.opening_gross;
        d.totalGross = +d.total_gross;
      })

      const { dateFormat, margin, width, height, svg, g, tooltip } = setupFunc("studiochart", 400);
      const x = d3.scaleBand().range([0, width]).padding(0.1), y = d3.scaleLinear().range([height, 0]);

      x.domain(data.map(d => d.studio));
      y.domain([0, d3.max(data, d =>  d.totalGross)]);

      g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "#000")
        .attr("x", width/2)
        .attr("dy", "3em")
        .attr("text-anchor", "middle")
        .text("Studio Name");

      g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .html("Gross ($)");

      g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.studio))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.totalGross))
        .attr("height", d => height - y(d.totalGross))
        .attr("fill", d => {
          return d.studio === studio[0].studio ? "#f54e56" : "#3ebdb2";
        })
        .on("mouseover", function(d) {
          d3.select(this).transition().ease(d3.easeCubicInOut)
            .duration(500).style("fill", "#f54e56");
          tooltip.html(`<span>${d.studio}</span><br />
              Total gross: $${Math.round(d.totalGross/1000000)}M`)
            .style("opacity", 0.7)
            .style("left", (d3.event.pageX)+0 + "px") 
            .style("top", (d3.event.pageY)-0 + "px");
        })
        .on("mouseout", function(d) {
          tooltip.style("opacity", 0);
          d3.select(this).transition().ease(d3.easeCubicInOut)
            .duration(500).style("fill", "#3ebdb2");
        });
    });
  }
  
  render(){
    return(
      <div className="content studios">
        <div className="row">
          <div className="col-md-4 text">
            <h3>Which studio did well and how did it perform against others?</h3>
            <p>Many of the major money-generating movies seem to come out of BV, followed by Universal, Fox, and WB. 
            BV was particularly doing well thanks to all the popularity of Star Wars, which in total generated nearly $1.5B.
            <span className="studioinfo"></span>(change hightlight by selecting another movie on bubble chart)
            </p>
          </div> 
          <div className="col-md-8 studiochart"></div>
        </div>
      </div>
    )
  }
}

export default StudioChart;