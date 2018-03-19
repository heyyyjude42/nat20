import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './fonts.css';
import shortcuts from './shortcuts.json';
import codes from './keycodes.json';
import colors from './colors.json';

function header() {
  return <h3 class="head">| SHORTCUTS |</h3>;
}

class NavBar extends React.Component {
  renderItem(app, desc) {
    return(
      <div class="navItem" onClick={() => this.props.onClick(app)}>
          <button id={app} class="navButton" onClick={() => this.props.onClick(app)}>
            <rectangle>{app}</rectangle>
          </button>
          <rectangle id={app+"_desc"} float="right" class="navDescriptor">{desc}</rectangle>
      </div>
    );
  }

  render(){
    return(
      <div class="bottomnav">
        {this.renderItem("Ps", "PhotoShop")}
        {this.renderItem("Ai", "Illustrator")}
        {this.renderItem("Id", "InDesign")}
        {this.renderItem("Pr", "Premiere")}
        {this.renderItem("Dw", "DreamWeaver")}
        {this.renderItem("Lr", "Lightroom")}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentApp: "Ps",
      currentKeys: [],
      comboStatus: [],
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  resetColors() {
    const app = this.state.currentApp;
    document.getElementById("footer").style.borderBottom;
  }

  handleKeyDown(event) {
    event.preventDefault();
    event.stopPropagation();

    if (event.repeat) {
      return;
    }

    /* redo these each time to maintain order */
    let mods = [];
    mods = event.metaKey ? mods.concat("Meta") : mods;
    mods = event.shiftKey ? mods.concat("Shift") : mods;
    mods = event.altKey ? mods.concat("Alt") : mods;
    mods = event.ctrlKey ? mods.concat("Control") : mods;

    let pressed = event.code;
    /* only strips the key but too lazy to put in json*/
    pressed = pressed.replace("Key", "");

    if (codes[pressed]) {
      pressed = codes[pressed];
    }
    mods = mods.indexOf(pressed) > -1 ? mods : mods.concat(pressed);

    this.setState({
      currentKeys: mods,
      comboStatus: mods
    });
  }

  handleKeyUp(event) {
    const last = this.state.currentKeys[this.state.currentKeys.length -1];
    if (last != "Shift" && last != "Alt" && last != "Meta" && last != "Control") {
      let combo = this.state.currentKeys;
      this.setState({
        comboStatus: combo
      });

    // } else {
    //   this.setState( {
    //     currentKeys: [],
    //     comboStatus: []
    //   })
    }
  }

  formatCombo() {
      let str = Array.prototype.join.call(this.state.comboStatus, " + ");
      str = str.replace("Key", "");
      str = str.replace("Meta", "Cmd");
      str = str.replace("Control", "Ctrl");
      return str;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, true);
    document.addEventListener("keyup", this.handleKeyUp, true);
    this.resetColors();
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyDown, true);
    document.removeEventListener("keyup", this.handleKeyUp, true);
  }

  handleClick(app) {
    this.setState({
      currentApp: app,
      currentKeys: [],
      comboStatus: []
    });
    this.resetColors();
  }

  render() {
    let str = this.formatCombo();
    let parsed = str.toLowerCase();
    parsed = parsed.split(" ").join("");
    try {
      var desc = shortcuts[this.state.currentApp][parsed]["shortcut"];
    } catch(err) {
      var desc = "";
    }

    return (
      <div>
        {header()}
        <NavBar onClick={app => this.handleClick(app)}/>
        <rectangle class="shortcut">{str}</rectangle>
        <p class="desc">{desc}</p>
        <p id="footer">{shortcuts[this.state.currentApp]["fullname"]}</p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
