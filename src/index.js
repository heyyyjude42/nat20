import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts.css';
import races from "./data/01 races.json"

function header() {
  return (<h3 class="head">Nat20</h3>);
}

function search(text) {
  let results = [];
  for (var key in races["Races"]) {
    if (races["Races"].hasOwnProperty(text)) {
      results.push(races["Races"][key]);
    }
  }
  if (results.length > 0) {
    return results;
  }
}

function getRawMarkup(text) {
  var Remarkable = require('remarkable');
  const md = new Remarkable();
  console.log(text);
  return { __html: md.render(text)};
}

function displayArray(arr) {
  if (arr) {
    if (Array.isArray(arr)) {
      return (
        <div>
          {arr.map(text => (
            <div>
              {displayArray(text)}
            </div>
          ))}
        </div>
      )
    } else {
      return (
        <div dangerouslySetInnerHTML={getRawMarkup(arr)}/>
      );
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      results: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      text: e.target.value,
      results: search(e.target.value)
    });
  }

  render() {
    return (
      <div>
        {header()}
        <input type="text" placeholder="type anything..." class="searchbar"
          onChange={this.handleChange} value={this.state.text}/>
        {displayArray(this.state.results)}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
