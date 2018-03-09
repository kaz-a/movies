import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';

const animate = () => {
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
      <RaisedButton label="Play" className="home-button" primary={true} style={{margin:12}} onClick={animate()} />
    </div>
  )
}

export default Home;