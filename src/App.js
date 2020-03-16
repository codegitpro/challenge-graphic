import React from 'react';
import logo from './logo.svg';
import './App.css';

import config from './config.json';

const LINKS_URL = `//${config.SERVE_HOSTNAME}:${config.SERVE_PORT}/api/links`;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Replace me with shortlinks UI</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <a
            className="App-link"
            onClick={()=> {
              fetch(LINKS_URL).then((resp)=> { 
                resp.json().then((x)=> alert(JSON.stringify(x)));
              });
            }}
          >
            Alert /api/links
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
