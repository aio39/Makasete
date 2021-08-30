import React from 'react';
// import './App.css';
import './index.css';
import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="w-max h-max flex flex-col  ">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p className="text-9xl ">Big</p>
      </div>
      </header>
    </div>
  );
}

export default App;
