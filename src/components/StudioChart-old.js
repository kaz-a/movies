import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class StudioChart extends Component {
  constructor(){
    super();
    this.drawForceLayout = this.drawForceLayout.bind(this);
  }

  componentDidMount(){
    this.drawForceLayout();
  }

  drawForceLayout (){
    const { data, selectedTitle } = this.props;
    console.log('data', data)

    const margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 700 - margin.left - margin.right, 
      height = 700 - margin.top - margin.bottom;

    const padding = 1.5, // separation between same-color circles
      clusterPadding = 6, // separation between different-color circles
      maxRadius = 20;

    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);  

    const n = data.length, // total number of circles
        m = new Set(data.map(d => d.studio)).size; // number of distinct clusters

    const color = d3.scaleOrdinal(d3.schemeCategory20c)
      .domain(d3.range(m))

    // The largest node for each cluster.
    const clusters = new Array(m);

    const nodes = d3.range(n).map(function() {
      const i = Math.floor(Math.random() * m),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        d = {cluster: i, radius: r};
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    });

    const forceCollide = d3.forceCollide()
      .radius(d => d.radius + 1.5)
      .iterations(1);

    var force = d3.forceSimulation()
      .nodes(nodes)
      .force("center", d3.forceCenter())
      .force("collide", forceCollide)
      .force("cluster", forceCluster)
      .force("gravity", d3.forceManyBody(30))
      .force("x", d3.forceX().strength(.7))
      .force("y", d3.forceY().strength(.7))
      .on("tick", tick);

    const svg = d3.select(".studio-chart").append("svg").attr("class", "studio-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

    const circle = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", d => d.radius)
      .style("fill", d => color(d.cluster))
       

    circle.on("mouseover", function(d) {
      console.log(d)
      // d3.select(this).transition().ease(d3.easeCubicInOut)
      //   .duration(500).style("stroke-width", "1em")
      // tooltip.html(`<span>${d.data.title}</span><br />
      //     Total gross: $${Math.round(d.data.totalGross/1000000)}M<br/>
      //     Genre: ${d.data.genre}<br/>
      //     Opened: ${d.data.open_date}`)
      //   .style("opacity", 0.8)
      //   .style("left", (d3.event.pageX)+0 + "px") 
      //   .style("top", (d3.event.pageY)-0 + "px");
    })
    .on("mouseout", function(d) {
      tooltip.style("opacity", 0);
      d3.select(this).transition().ease(d3.easeCubicInOut)
        .duration(500).style("stroke-width", 0);
    })

    function tick() {
      circle.attr("cx", d => d.x).attr("cy", d => d.y);
    }

    function forceCluster(alpha) {
      for (let i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
        node = nodes[i];
        cluster = clusters[node.cluster];
        node.vx -= (node.x - cluster.x) * k;
        node.vy -= (node.y - cluster.y) * k;
      }
    }

  }

  render(){
    return(
      <div className="content">
        <div className="row">
          <div className="col-md-4 text">
            <h3>Which studio did well and how did it perform against others?</h3>
            <p></p>
          </div> 
          <div className="col-md-8 studio-chart"></div>
        </div>
      </div>
    )
  }
}

export default StudioChart;