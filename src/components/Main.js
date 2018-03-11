import React, {Component} from 'react';
import reactDOM from 'react-dom';
import * as d3 from 'd3';
import Home from './Home';
import LineChart from './LineChart';

class Main extends Component {
  constructor(){
    super()
    this.state = { 
      data: [],
      setupFunc: this.setup.bind(this)
    }
  }

  // d3 chart setup to be used for all charts
  setup(classname, h){
    const dateFormat = d3.timeFormat("%b %d, %Y");
    const margin = { top: 20, right: 50, bottom: 50, left: 100 };
    const width = 700 - margin.left - margin.right, 
      height = h - margin.top - margin.bottom;

    const svg = d3.select(`.${classname}`).append("svg").attr("class", classname)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    
    const g = svg.append("g").attr("class", "g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const tooltip = d3.select("body").append("div")   
      .attr("class", "tooltip")               
      .style("opacity", 0);

    const setup = {dateFormat, margin, width, height, svg, g, tooltip};
    return setup;
  }
  
  componentDidMount(){
    d3.csv("/data/movies.csv", (err, data) => {
      if(err) throw err;

      data.forEach(d => {
        d.id = +d[""];
        d.openDate = new Date(d.open_date)
        d.openingGross = +d.opening_gross;
        d.theaters = +d.theaters;
        d.totalGross = +d.total_gross;
      })

      this.setState({data})
    })
  }

  render(){
    const {data, setupFunc} = this.state;
    
    return (
      <div>
        <Home />
        <LineChart data={data} setupFunc={setupFunc} />
      </div>
    )
  }
}

export default Main;