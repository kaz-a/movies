import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
// import SearchBox from './SearchBox';
import StudioChart from './StudioChart';

class BubbleChart extends Component {
  constructor(){
    super()
    this.state = {
      bubbleClicked: false,
      selectedTitle: ''
    }
    this.drawBubbles = this.drawBubbles.bind(this);
  }

  componentDidMount(){
    this.drawBubbles();
  }

  drawBubbles(){
    const { data, selectedData } = this.props;
    console.log('selectedData:', selectedData);

    console.log('data', data)

    const margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 700 - margin.left - margin.right, 
      height = 700 - margin.top - margin.bottom;
    
    const svg = d3.select(".bubblechart").append("svg").attr("class", "bubblechart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    console.log(new Set(data.map(d => d.genre)).size) // 42 unque genres

    let genres = {};
    data.forEach(d => {
      if(genres[d.genre]){
        genres[d.genre] ++;
      } else {
        genres[d.genre] = 1;
      }
    })
    
    const majorGenres = Object.keys(genres).filter(genre => {
      return genres[genre] >= 9
    })
 
    const colorRange8 = [
      "#b1457b", "#56ae6c", "#5d398b", "#a8a53f",
      "#6c81d9", "#b86b35", "#ca73c6", "#ba464e"
    ];

    // const colorRange42 = [
    //   "#ce5399", "#44cc7c", "#bc5bba", "#5cb455", "#5858bc", "#a6bc3a", "#7283e9",
    //   "#7cb041", "#533584", "#c8aa34", "#628dd4", "#d28826", "#b883d4", "#a7b24c",
    //   "#7f2465", "#61b676", "#ac235c", "#43c8ac", "#d54a4a", "#3d7025", "#d67dc0",
    //   "#a0c36b", "#e35f8f", "#878120", "#c46b93", "#dbc767", "#832238", "#999f50",
    //   "#ce4858", "#796520", "#d86279", "#d5a24e", "#852b1b", "#d7b16d", "#bc452b",
    //   "#c4884e", "#c35f5d", "#bc772d", "#d5775e", "#894615", "#df7d52", "#be5a1f"
    // ];

    const color = d3.scaleOrdinal().domain(majorGenres).range(colorRange8);
    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);  
    const pack = d3.pack().size([width, height]).padding(1.5);
    const root = d3.hierarchy({ children: data }).sum(d => d.totalGross)

    // console.log('root', root)

    const node = svg.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
      .attr("id", d => d.data.title)
      .attr("r", d => d.r)
      .style("fill", d => {
        return majorGenres.indexOf(d.data.genre) < 0 ? "#ccc" : color(d.data.genre);
      })
      .style("opacity", 0.5)
      .on("mouseover", function(d) {
        d3.select(this).transition().ease(d3.easeCubicInOut)
          .duration(200).style("opacity", 1)

        tooltip.html(`<span>${d.data.title}</span><br />
            Total gross: $${Math.round(d.data.totalGross/1000000)}M<br/>
            Genre: ${d.data.genre}<br/>
            Opened: ${d.data.open_date}`)
          .style("opacity", 0.8)
          .style("left", (d3.event.pageX)+0 + "px") 
          .style("top", (d3.event.pageY)-0 + "px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
        d3.select(this).transition().ease(d3.easeCubicInOut)
          .duration(200).style("opacity", 0.5);
      })
      .on("click", d => {
        this.setState({ bubbleClicked: true, selectedTitle: d.title })
      })

    // node.append("text")
    //   .attr("class", "bubble-label")
    //   .attr("dy", ".3em")
    //   .style("text-anchor", "middle")
    //   .text(d => d.data.title);


    d3.select(".genres").append("text").attr("class", "genres-text")
 
  } 



  render(){
    const { bubbleClicked, selectedTitle } = this.state;
    const { data } = this.props;
    const selections = ["movies by revenue", "genre by revenue"]
    return (
      <div className="content">
        <div className="row">
          <div className="col-md-4 text">
            <h3>What movies were doing well during these 3 years?</h3>
            <p>While <em>Star Wars: The Force Awakens</em> had the largest revenue,
              it was one of the rarest genre of movie made during this period. 
              Less competition? 
              Each circle is a movie title, sized by total gross $ and colored by genre.
              Genres with less than 9 releases are shown in grey. 
              So we can say the titles in grey are rare/less significant. 
              Click on a circle to learn which studio released this movie and 
              how this studio did against others.
            </p>
            
            <div className="genres"></div>
          </div> 
          <div className="col-md-8 bubblechart"></div>
        </div>
        <div>
        {
          bubbleClicked ? <StudioChart data={ data } selectedTitle={ selectedTitle } /> : ""
        }
        </div>
      </div>

    )
  }
}

export default BubbleChart;