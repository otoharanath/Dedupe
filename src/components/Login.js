import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DedupeActions from "../actions/DedupeActions";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
    
this.login=this.login.bind(this);
this.logout=this.logout.bind(this);
}

login() {
 this.props.DedupeActions.isAuth(true);
  const { state = {} } = this.props.location;
  const { prevLocation } = state;

  this.setState(
    {
      loggedIn: true,
    },
    () => {
      this.props.history.push(prevLocation || "/");
    },
  );
};


logout() {
  this.props.DedupeActions.isAuth(false);
  this.forceUpdate();
}

  render() {

    return (
      <div>
      <p>Login page yo</p>
      <button onClick={this.logout}>Logout</button>
      <button onClick={this.login}>Login</button>
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
    DedupeActions: bindActionCreators(DedupeActions, dispatch)
  };
};

// Use connect to put them together
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
