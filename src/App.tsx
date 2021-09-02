import React from 'react';
import ImageUpload from './components/ImageUpload';
// import './App.css';
import './index.css';

function App() {
  return (
    <div className="App min-h-screen min-w-full flex flex-col justify-center items-center">
      <header className="App-header">
        <div className=" ">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}

          <ImageUpload />
        </div>
      </header>
    </div>
  );
}

export default App;
