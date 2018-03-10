import React from 'react';
import ReactDOM from 'react-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const buttonScroll = () => {
  $(".home-button").click(() => {
    const scrollHeight = $(".home").height() + 20;
    $("html, body").animate({ scrollTop: scrollHeight }, 600);
  })
}

const Home = () => {
  return (
    <div className="content home">
      <h1>Visualizing<br/>Movies Data</h1><br/>
      <p>If I was a film maker, would I stay in this field based on the business trend?<br/>
      What kind of movies should I make so I can make more money?<br/>
      And what studio should I belong in order to be successful?<br/>
      </p>
      
      <FloatingActionButton className="home-button" style={{color: "#fff"}} onCick={buttonScroll()}>
        <h4>&#9662;</h4>
      </FloatingActionButton>
    </div>
  )
}

export default Home;