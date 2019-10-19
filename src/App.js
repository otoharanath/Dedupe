import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import Navbar from "react-bootstrap/Navbar";
import { Nav, Form, FormControl, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Router from './Router';


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
    <Navbar style={{ background: 'black' }} fluid sticky="top">
      <Navbar.Brand href="/">
        <img
          alt=""
          src="./logo192.png"
          paddingTop = "20"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
         <Navbar.Text style={{ color: 'white' }}>
          <p style={{ color: 'white' }}><strong> Otomashen</strong></p>
        </Navbar.Text>
       
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



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  
    //this.onChange = this.onChange.bind(this);

  }

  render() {
    return (
      <div>
        <MainMenu />
        <Router />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isAuth: state.DedupeReducer.isAuth
  };
};

// Maps actions to props
const mapDispatchToProps = dispatch => {
  return {

  };
};

// Use connect to put them together
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
