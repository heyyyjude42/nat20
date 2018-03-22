import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts.css';
import srd from "./data/srdnew.json"
import ReactTable from "react-table"
import 'react-table/react-table.css'

function header() {
  return (<h3 class="head">Nat20</h3>);
}

function getRegExp(target) {
  target = target.replace(/ /g, "");
  let arr = target.split("");
  let regexp = "";
  arr.forEach(function(char) {
    regexp += ".*" + char;
  });
  regexp += ".*";
  return RegExp(regexp, "i");
}

function search(target) {
  let regexp = getRegExp(target);
  return dfs(target.toLowerCase(), srd, regexp);
}

function dfs(target, d, regexp) {
  let results = {matches: [], partials: []}
  for (var key in d) {
    if (key.toLowerCase().includes("content/") || key.toLowerCase().includes("table/")) {
      continue;
    }
    if (key.toLowerCase().includes(target)) {
      results.matches.push({ title: key, content: d[key]});
    } else if (regexp.test(key)) {
      results.partials.push({ title: key, content: d[key]});
    } else {
      if (typeof d[key] === "object" && !Array.isArray(d[key])) {
        let next = dfs(target, d[key], regexp);
        if (next.matches.length || next.partials) {
          results.matches = results.matches.concat(next.matches);
          results.partials = results.partials.concat(next.partials);
        }
      }
    }
  }
  return results;
}

function title(str) {
  str = str.substring(0, str.length-1);
  return (
    <div>
      <h3 class="title">{str.substring(str.lastIndexOf("/")+1, str.length)}</h3>
      <h4 class="sub">{str.substring(0, str.lastIndexOf("/"))}</h4>
    </div>
  );
}

function subtitle(str) {
  str = parseLastLevel(str);
  return (
    <div class="categoryhead"><h4>{str}</h4></div>
  )
}

function parseLastLevel(str) {
  if (str.lastIndexOf("/") === str.length-1) {
    str = str.substring(0, str.length-1);
  }
  return str.substring(str.lastIndexOf("/")+1, str.length);
}

function tableMaker(obj) {
  let columns = [];
  let data = [];

  for (var key in obj) {
    const parsedKey = parseLastLevel(key);
    let style = { Header: parsedKey, accessor: key, style: { "white-space": "normal", "text-align": "center", "vertical-align": "middle", "word-wrap": "break-word" },
      headerStyle: { "overflow": "unset", "word-wrap": "break-word", "white-space": "normal"} };

    if (parsedKey.length <= 3) {
      style["minWidth"] = 40;
    } else {
      style["minWidth"] = 110;
    }

    columns.push(style);

    if (data.length === 0) {
      obj[key].forEach(function(element) {
        let newObj = {};
        newObj[key] = element;
        data.push(newObj);
      })
    } else {
      for (var i = 0; i < obj[key].length; i++) {
        data[i][key] = obj[key][i];
      }
    }
  }

  return (
    <ReactTable sortable={false} data={data} columns={columns}
      showPagination={false} minRows={0}/>)
  ;
}

function content(obj) {
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return(
          <div>
            {obj.map(element => (
              <div>{content(element)}</div>
            ))}
          </div>
      )
    } else {
      return(
        <div>
          {Object.keys(obj).map(function(key) {
            if (key.toLowerCase().includes("content/")) {
              return(<div>{content(obj[key])}</div>)
            } else if (key.toLowerCase().includes("table/") || key.toLowerCase() === "table") {
              return(<div>{tableMaker(obj[key])}</div>)
            }
            return (
              <div>
                {subtitle(key)}
                <ul>{content(obj[key])}</ul>
              </div>
            );
          })}
        </div>
      )
    }
  } else {
    return(
      <div class="text" dangerouslySetInnerHTML={getRawMarkup(obj)}/>
    )
  }
}

function getRawMarkup(text) {
  var Remarkable = require('remarkable');
  const md = new Remarkable();
  return { __html: md.render(text)};
}

class List extends React.Component {
  render() {
    var data = this.props.data;
    var list = data.matches.concat(data.partials);

    return (
      <div>
        {Object.keys(list).map(function(key) {
          return (
            <div class="result">
              {title(list[key].title)}
              {content(list[key].content)}
            </div>
          );
        })}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      results: { matches: [], partials: []}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      text: e.target.value,
    });
    if (e.target.value) {
      this.setState({
        results: search(e.target.value)
      });
    } else {
      this.setState({
        results: { matches: [], partials: []}
      });
    }
  }

  render() {
    return (
      <div>
        {header()}
        <input type="text" placeholder="type anything..." class="searchbar"
          onChange={this.handleChange} value={this.state.text}/>
        <div class="page">
          <List data={this.state.results}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
