import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import StudioChart from './StudioChart';

class BubbleChart extends Component {
  constructor(){
    super();
    
    this.state = {
      bubbleClicked: false,
      selectedTitle: "",
      majorGenres: [],
      allGenres: {},
      colorRange: [],
      genresCutoff: 0
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

    const classname = `.bubble.${e.genre.replace(/\s|\//g, '')}`;  
    $(classname).css("opacity", 1);
    $(classname).parent().siblings().children().not(classname).css("opacity", 0.2);
    d3.select(".info").remove();
          
    d3.select(".genre-total").html(`${e.genre}'s gross total was<br/><span>$${Math.round(sumTotal/1000000000 * 100)/100}B</span>`);
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
    const dateFormat = d3.timeFormat("%-m/%-d/%y");
    const { margin, width, height, svg, tooltip } = setupFunc("bubblechart", 570);

    let genres = {};
    data.forEach(d => {
      if(genres[d.genre]){
        genres[d.genre] ++;
      } else {
        genres[d.genre] = 1;
      }
    });

    const numUniqueGenres = new Set(data.map(d => d.genre)).size; // 42 unque genres - too many to color code!
    const genresCutoff = 5;
    const majorGenres = Object.keys(genres).filter(genre => genres[genre] >= genresCutoff);
    const colorRange8 = ["#b1457b", "#56ae6c", "#5d398b", "#a8a53f", "#6c81d9", "#b86b35", "#ca73c6", "#ba464e"];
    const colorRange15 = ["#cd772c", "#6d71d8", "#92b440", "#563485", "#61c06d", "#bc72ca", "#40af7a", "#b5508f", "#49d2b7", "#bc4862", "#6a8b3c", "#5e8bd5", "#c1a43d", "#b84e39", "#ad7b3c"];
    this.setState({majorGenres, allGenres: genres, genresCutoff, colorRange: colorRange15});
    
    const color = d3.scaleOrdinal().domain(majorGenres).range(colorRange15);    
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
      .attr("class", d => majorGenres.indexOf(d.data.genre) < 0 ? "bubble Others" : `bubble ${d.data.genre.replace(/\s|\//g, '')}`)
      .style("fill", d => majorGenres.indexOf(d.data.genre) < 0 ? "#000" : color(d.data.genre))
      .style("opacity", d => dateFormat(d.data.openDate) === dateFormat(selectedDate) ? 1 : 0.2)
      .on("mouseover", function(d) {
        // d3.select(this).transition().ease(d3.easeCubicInOut)
        //   .duration(200).style("opacity", 1);
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
        // d3.select(this).transition().ease(d3.easeCubicInOut)
        //   .duration(200).style("opacity", 0.2);
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

  // aggregate genre table with color and count, and add 'others' genre for
  // genres that have less than 9 counts
  getGenreTable(){
    const { majorGenres, allGenres, colorRange } = this.state;
    const { data } = this.props;
    
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
    const otherCount = data.filter(d => majorGenres.indexOf(d.genre) < 0).length;
    dataTable.push({"genre": "Others", "color": "#000", "count": otherCount})
    return dataTable.sort((a, b) => b.count - a.count);
  }

  render(){
    const { bubbleClicked, selectedTitle, genresCutoff } = this.state;
    const { data, setupFunc } = this.props;
    const genres = this.getGenreTable();
    const text = `Each circle is a movie title, sized by total gross $ and colored by genre.
                Genres with less than ${genresCutoff} releases are categorized as "Others".  
                Click on a circle to learn which studio released this movie and 
                how this studio did against others.` 
                
    return (
      <div>
        <div className="content movie-titles">
          <div className="row">
            <div className="col-md-4 text">
              <h3>What movies were doing well during these 3 years?</h3>
              <p><em>Star Wars </em>was very popular, and Action / Adventure and Animation made the top genre. {text}
                <span className="info"></span>(change hightlight by selecting another date on line chart or selecting a genre below)
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
              
            </div> 
            
            <div className="col-md-8">
              <div className="bubblechart"></div>
              <div className="genre-total"></div>
            </div>
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