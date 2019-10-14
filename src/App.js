import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import MainContainer from './components/MainContainer';
import OtoJobsMain from './components/OtoJobsMain';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import SideBar from './components/sidebar';
import Navbar from "react-bootstrap/Navbar";
import { Nav, Form, FormControl, NavItem } from 'react-bootstrap';
import './App.css';
library.add(faEnvelope, faKey);
const bg = require("./components/bg.jpg");
const divStyle = {
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundRepeat: "repeat"
};
const MainMenu = () => {
  return (
    <Navbar
      style={{ background: 'rgba(53, 48, 48, 0.77)' }}
fluid
      sticky="top"
    >
      <Navbar.Brand href="/">
        <img
          alt=""
          src="./logo192.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        <strong style={{ color: 'white' }}>&nbsp;Otomashen</strong>
      </Navbar.Brand>
    
      <Nav className="mr-auto">
        <Nav.Link style={{ color: 'white' }} href="/">Home</Nav.Link>
        <Nav.Link style={{ color: 'white' }} href="/Otojobs">Otojobs</Nav.Link>
        <Nav.Link style={{ color: 'white' }} href="/">Dedupe</Nav.Link>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
    <Navbar.Text style={{ color: 'white' }}>
      Signed in as: <a style={{ color: 'white' }} href="/"><strong>Ashrin Mathur</strong></a>
    </Navbar.Text>
  </Navbar.Collapse>
    </Navbar>
  );
};


class App extends Component {
  render() {
    return (
      <Router>
        <div className="cComponent"
        style={divStyle}
        style={{
          backgroundImage: `url(${bg})`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-y"
        }}
      >
          <header>
            <MainMenu />
          </header>
          <div>
            <Route exact path="/" component={MainContainer} />
            <Route exact path="/Otojobs" component={OtoJobsMain} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

