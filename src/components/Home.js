import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';

const Home = () => {
  return (
    <div className="content home">
      <h1>Visualizing<br/>Movies Data</h1><br/>
      <p>If I was a film maker, would I stay in this field based on the business trend?<br/>
      What kind of movies should I make so I can make more money?<br/>
      And what studio should I belong in order to be successful?<br/>
      </p>
      <RaisedButton label="Enter" primary={true} style={{margin:12}} />
    </div>
  )
}

export default Home;