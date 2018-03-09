import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Badge from 'material-ui/Badge';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import StudioChart from './StudioChart';

class BubbleChart extends Component {
  constructor(){
    super()
    this.state = {
      bubbleClicked: false,
      selectedTitle: "",
      majorGenres: {},
      allGenres: {},
      colorRange: [],
    }
    this.drawBubbles = this.drawBubbles.bind(this);
    this.getGenreInfo = this.getGenreInfo.bind(this);
    this.handleBubbleclick = this.handleBubbleClick.bind(this);
  }

  componentDidMount(){
    this.drawBubbles();
  }

  handleBubbleClick(data){
    if(this.state.bubbleClicked){
      this.setState({ bubbleClicked: false, selectedTitle: "" })
    }
    this.setState({ bubbleClicked: true, selectedTitle: data })
  }

  drawBubbles(){
    const { data, selectedDate } = this.props;
    const { selectedGenre } = this.state;
    const dateFormat = d3.timeFormat("%-m/%-d/%y")

    const margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = 700 - margin.left - margin.right, 
      height = 700 - margin.top - margin.bottom;
    
    const svg = d3.select(".bubblechart").append("svg").attr("class", "bubblechart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // console.log(new Set(data.map(d => d.genre)).size) // 42 unque genres

    let genres = {};
    data.forEach(d => {
      if(genres[d.genre]){
        genres[d.genre] ++;
      } else {
        genres[d.genre] = 1;
      }
    })

    const majorGenres = Object.keys(genres).filter(genre => genres[genre] >= 9) 
    const colorRange8 = ["#b1457b", "#56ae6c", "#5d398b", "#a8a53f", "#6c81d9", "#b86b35", "#ca73c6", "#ba464e"];

    this.setState({majorGenres, allGenres: genres, colorRange: colorRange8}) 
    
    const color = d3.scaleOrdinal().domain(majorGenres).range(colorRange8);
    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);  
    const pack = d3.pack().size([width, height]).padding(1.5);
    const root = d3.hierarchy({ children: data }).sum(d => d.totalGross)

    const node = svg.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
      .attr("id", d => d.data.title)
      .attr("r", d => d.r)
      .attr("class", "bubble")
      .style("fill", d => {
        return majorGenres.indexOf(d.data.genre) < 0 ? "#000" : color(d.data.genre);
      })
      .style("opacity", d => {
        return dateFormat(d.data.openDate) === dateFormat(selectedDate) ? 1 : 0.2;
      })
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
          .duration(200).style("opacity", 0.2);
      })
      .on("click", d => this.handleBubbleClick(d.title))

    // add bubble labels on selected circles
    node.append("text")
      .attr("class", "bubble-label")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(d => {
        return dateFormat(d.data.openDate) === dateFormat(selectedDate) ? d.data.title : ""
      });

    d3.select(".info").append("html").html(`<em>Highlighting movies opened on ${dateFormat(selectedDate)}</em>`)
 
  } 

  getGenreInfo(){
    const { majorGenres, allGenres, colorRange } = this.state;
    
    function getColor(genreArr, colorArr){
      let returnData = [];
      for(let i=0; i<genreArr.length; i++){
        let _genres = {};
        _genres['genre'] = genreArr[i]
        _genres['color'] = colorArr[i]
        _genres['count'] = getCounts(allGenres, genreArr[i])
        returnData.push(_genres)
      }
      return returnData;
    }

    function getCounts(genreTable, genreName){
      let count = 0;
      for(let key in genreTable){
        if(key === genreName){
          count += genreTable[key]
        }
      }
      return count;
    }

    const dataTable = getColor(majorGenres, colorRange);
    const otherCount = Object.keys(allGenres).length - dataTable.length;
    dataTable.push({"genre": "Others", "color": "#000", "count": otherCount})
    dataTable.sort((a, b) => b.count - a.count)
    return dataTable;
  }

  render(){
    const { bubbleClicked, selectedTitle } = this.state;
    const { data } = this.props;
    const genres = this.getGenreInfo();

    return (
      <div>
        <div className="content">
          <div className="row">
            <div className="col-md-4 text">
              <h3>What movies were doing well during these 3 years?</h3>
              <p>While <em>Star Wars: The Force Awakens</em> had the largest revenue,
                it was one of the rarest genre of movie made during this period. 
                Each circle is a movie title, sized by total gross $ and colored by genre.
                Genres with less than 9 releases are categorized as "Others".  
                Click on a circle to learn which studio released this movie and 
                how this studio did against others.
                <span className="info"></span>
              </p>
              
              <div className="genres">
              {
                genres && genres.map(genre => {
                  const style = {backgroundColor: genre.color, margin: 3};
                  return (
                    <div key={genre.genre} style={{display: "flex"}}>
                      <Chip style={style} labelColor="#fff">
                        <Avatar size={18} backgroundColor={genre.color} style={{opacity: 0.5}}>
                          {genre.count}</Avatar>{genre.genre}
                      </Chip>
                    </div>
                  )
                })
              }
              </div>
            </div> 
            <div className="col-md-8 bubblechart"></div>
          </div>
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