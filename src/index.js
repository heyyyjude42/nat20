import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts.css';

function header() {
  return (<h3 class="head">Nat20</h3>);
}

function SearchBar(props) {
  return(
    <input type="text" placeholder="type anything..." class="searchbar" onkeyup={() => this.props.onKeyUp()}/>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSearch: ""
    };
  }

  handleClick(text) {
    this.setState({
      currentSearch: text
    });
    this.resetColors();
  }

  render() {
    return (
      <div>
        {header()}
        <SearchBar onKeyUp={text => this.handleClick(text)}/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
