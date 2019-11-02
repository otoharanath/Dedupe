import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import Navbar from "react-bootstrap/Navbar";
import { Nav, Form, FormControl, NavItem, NavDropdown } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import Router from './Router';
import  { signOutAction } from './actions/LoginAction';
import './App.css';




library.add(faEnvelope, faKey);
const bg = require("./components/bg.jpg");
const divStyle = {
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundRepeat: "repeat"
};






class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  
    this.signOut = this.signOut.bind(this);

  }

  signOut() {
    this.props.signOutAction();
  }

  render() {
    return (
      <div>
         <Navbar style={{ background: 'black', color:"white" }} fluid sticky="top">
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
      {   this.props.authenticated ?
      <Nav className="mr-auto">
        <Nav.Link style={{ color: 'white' }} href="/"><strong style={{ color: 'white' }}>Home</strong></Nav.Link>
        <NavDropdown  title={<strong style={{ color: 'white' }}>Otojobs</strong>} >
        <NavDropdown.Item  href="/Otojobs">New Job</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item  href="/OtojobsRecent">Recent Transactions</NavDropdown.Item>
        </NavDropdown>

       {/*  <Nav.Link style={{ color: 'white' }} href="/Otojobs">Otojobs</Nav.Link> */}
       <NavDropdown  title={<strong style={{ color: 'white' }}>Dedupe</strong>} >
        <NavDropdown.Item  href="/">New Job</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item  href="/dedupeRecent">Recent Transactions</NavDropdown.Item>
        </NavDropdown>

        {/* <Nav.Link style={{ color: 'white' }} href="/"><strong style={{ color: 'white' }}>Dedupe</strong></Nav.Link> */}
       
      </Nav>
      :null}
      <Navbar.Collapse className="justify-content-end">
      {   this.props.authenticated ?
        <NavDropdown style={{ color: 'white' }} title={localStorage.getItem('name')} >
        <NavDropdown.Item  onClick = {this.signOut}>Sign Out</NavDropdown.Item>
        </NavDropdown>

        :
        <Navbar.Text style={{ color: 'white' }}>
        <a style={{ color: 'white' }} href="/Login"><strong>Sign In</strong></a>
      </Navbar.Text>
      }
      </Navbar.Collapse>
    </Navbar>
       
        <Router />
      
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isAuth: state.DedupeReducer.isAuth,
    authenticated: state.auth.authenticated
  };
};

// Maps actions to props
const mapDispatchToProps = dispatch => {
  return {
    signOutAction: bindActionCreators(signOutAction, dispatch)
    
  };
};

// Use connect to put them together
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
