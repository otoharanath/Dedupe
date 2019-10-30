import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { signInAction } from '../actions/LoginAction';
import { connect } from 'react-redux';
import '../../src/Login.css';
const bg = require("./bg4.jpg");

class Signin extends Component {
  submit = (values) => {
    this.props.signInAction(values, this.props.history);
  }
  errorMessage() {
    if (this.props.errorMessage) {
      return (
        <div className="info-red">
          {this.props.errorMessage}
        </div>
      );
    }
  }
  render() {
    const { handleSubmit } = this.props;
    return (
      <div  style={{
        top:"0",
        left: "0",
        width:"100%",
        height:"100%",
        position:"absolute",
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            overflow:"hidden"
           
           }}>
      <div className="center">
      <div className="card">
          <h1 style={{color:'white'}}>Login</h1>
          <form onSubmit={ handleSubmit(this.submit) }>
            <Field className="form-item" name="email"
                   component="input"
                   type="text"
                   placeholder="Email" 
            />
            <Field className="form-item" name="password" 
                   component="input"
                   type="password"
                   placeholder="Password" 
            />
            <button type="submit" className="form-submit">Sign In</button>
          </form>

      </div>
  </div>
 </div>
    );
  }
}
function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}
const reduxFormSignin = reduxForm({
  form: 'signin'
})(Signin);
export default connect(mapStateToProps, {signInAction})(reduxFormSignin);