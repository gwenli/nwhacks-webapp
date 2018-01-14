import React, { Component } from 'react';
import ListItem from './ListItem';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    renderListItem(val, key) {
    return <ListItem key={key} value={val} />
  }

  render() {
    const stringList = [[1,3,4,5], [1,2,3,4], [1,2,3,4]];

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
      </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {stringList.map(this.renderListItem)}
      </div>
    );
  }
}

export default App;
