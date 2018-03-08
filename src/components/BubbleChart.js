import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

class BubbleChart extends Component {
  constructor(){
    super()
    this.drawBubbles = this.drawBubbles.bind(this);
  }

  componentDidMount(){
    this.drawBubbles();
  }

  drawBubbles(){
    const { data, selectedData } = this.props;
    console.log('selectedData:', selectedData)
    
  }

  render(){
    return (
      <div className="content">
        <div className="row">
          <div className="col-md-4 text">
            <h3>What movies/genres were doing well during these 3 years?</h3>
            <p></p>
          </div> 
          <div className="col-md-8 bubblechart"></div>
        </div>
      </div>

    )
  }
}

export default BubbleChart;