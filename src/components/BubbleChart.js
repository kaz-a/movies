import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
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
      clickedGenre: "",
      chipClicked: false
    }
    this.drawBubbles = this.drawBubbles.bind(this);
    this.getGenreTable = this.getGenreTable.bind(this);
    this.handleBubbleclick = this.handleBubbleClick.bind(this);
    this.handleChipClick = this.handleChipClick.bind(this);
  }

  componentDidMount(){
    this.drawBubbles();
  }

  handleChipClick(e){
    const { data } = this.props;
    const _data = d3.nest().key(d => d.genre).rollup(f => d3.sum(f, d => +d.total_gross)).entries(data);
    
    // create others table with aggregated totals
    const genres = this.getGenreTable().map(d => d.genre);
    const others = _data.filter(d => genres.indexOf(d.key) < 0);
  
    let arr = [];
    others.forEach(i => { arr.push(i.value) });
    const othersSum = arr.reduce((a, b) => a + b);

    let sumTotal;
    if(e.genre === "Others"){
      sumTotal = othersSum;
    } else {
      sumTotal = _data.filter(d => d.key === e.genre)[0].value;
    }
    
    this.setState({ chipClicked: true, clickedGenre: e.genre });   
    d3.select(".genre-total").html(`${e.genre}'s gross total was $${Math.round(sumTotal/1000000000)}B`);
  }

  handleBubbleClick(data){
    if(this.state.bubbleClicked){
      this.setState({ bubbleClicked: false, selectedTitle: "" });
    }
    this.setState({ bubbleClicked: true, selectedTitle: data });

    const scrollHeight = $(".home").height() + $(".timetrend").height() + $(".movie-titles").height() + 100;
    $("html, body").animate({ scrollTop: scrollHeight }, 600);
  }

  drawBubbles(){
    const { data, selectedDate, setupFunc } = this.props;
    const { selectedGenre, clickedGenre, chipClicked } = this.state;
    const dateFormat = d3.timeFormat("%-m/%-d/%y");
    const { margin, width, height, svg, tooltip } = setupFunc("bubblechart", 700);

    // console.log(new Set(data.map(d => d.genre)).size) // 42 unque genres
    let genres = {};
    data.forEach(d => {
      if(genres[d.genre]){
        genres[d.genre] ++;
      } else {
        genres[d.genre] = 1;
      }
    });

    const majorGenres = Object.keys(genres).filter(genre => genres[genre] >= 9);
    const colorRange8 = ["#b1457b", "#56ae6c", "#5d398b", "#a8a53f", "#6c81d9", "#b86b35", "#ca73c6", "#ba464e"];
    this.setState({majorGenres, allGenres: genres, colorRange: colorRange8});
    
    const color = d3.scaleOrdinal().domain(majorGenres).range(colorRange8);    
    const pack = d3.pack().size([width, height]).padding(1.5);
    const root = d3.hierarchy({ children: data }).sum(d => d.totalGross);

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
          .duration(200).style("opacity", 1);

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
      .on("click", d => this.handleBubbleClick(d.data.title));

    // add bubble labels on selected circles
    node.append("text")
      .attr("class", "bubble-label")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(d => {
        return dateFormat(d.data.openDate) === dateFormat(selectedDate) ? d.data.title : "";
      });

    d3.select(".info").append("html").html(`<em>*Highlighting movies opened on ${dateFormat(selectedDate)}</em>`);
 
  } 

  // aggregate genre table with color and count, and add 'others' genre
  getGenreTable(){
    const { majorGenres, allGenres, colorRange } = this.state;
    
    function getTable(genreArr, colorArr){
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

    const dataTable = getTable(majorGenres, colorRange);
    const otherCount = Object.keys(allGenres).length - dataTable.length;
    dataTable.push({"genre": "Others", "color": "#000", "count": otherCount})
    return dataTable.sort((a, b) => b.count - a.count);
  }

  render(){
    const { bubbleClicked, selectedTitle } = this.state;
    const { data, setupFunc } = this.props;
    const genres = this.getGenreTable();

    return (
      <div>
        <div className="content movie-titles">
          <div className="row">
            <div className="col-md-4 text">
              <h3>What movies were doing well during these 3 years?</h3>
              <p>While <em>Star Wars: The Force Awakens</em> had the largest revenue,
                it was one of the rarest genre of movie made during this period. 
                Each circle is a movie title, sized by total gross $ and colored by genre.
                Genres with less than 9 releases are categorized as "Others".  
                Click on a circle to learn which studio released this movie and 
                how this studio did against others.
                <span className="info"></span>(change hightlight by selecting another date on line chart)
              </p>
              
              <div className="genres">
              {
                genres && genres.map(genre => {
                  const style = {backgroundColor: genre.color, margin: 3};
                  return (
                    <div key={genre.genre} style={{display: "inline-block"}}>
                      <Chip style={style} labelColor="#fff" onClick={(e)=>this.handleChipClick(genre)}>
                        <Avatar size={18} backgroundColor={genre.color} style={{opacity: 0.5}}>
                          {genre.count}</Avatar>{genre.genre}
                      </Chip>
                    </div>
                  )
                })
              }
              </div>
              <div className="genre-total"></div>
            </div> 
            <div className="col-md-8 bubblechart"></div>
          </div>
        </div>
        <div>
        {
          bubbleClicked ? <StudioChart data={ data } selectedTitle={ selectedTitle } setupFunc={ setupFunc } /> : ""
        }
        </div>
      </div>

    )
  }
}

export default BubbleChart;