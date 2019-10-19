import React from 'react';
import Dashboard from "./components/Dashboard"
import Login from './components/Login'
import MainContainer from './components/MainContainer';
import OtoJobsMain from './components/OtoJobsMain';
import { Route, Link, Redirect, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";



class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };

        //this.onChange = this.onChange.bind(this);

    }

    render() {
        console.log("loggedin",this.props.isAuth)
        return (
            <Switch>
                <Route exact path="/" component={MainContainer} />
                <Route exact path="/login" component={Login} />
                 <Route exact path="/Otojobs" component={OtoJobsMain} /> 
                <Route path="/dashboard/:tranId" component={Dashboard} />
             {/*    <ProtectedRoute loggedIn={this.props.isAuth} path="/Otojobs" component={OtoJobsMain} /> */}
            </Switch>
        )
    }
}

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
    return (
        <Route
            path={path}
            {...rest}
            render={props => {
                return loggedIn ? (
                    <Comp {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {
                                    prevLocation: path,
                                    error: "You need to login first!",
                                },
                            }}
                        />
                    );
            }}
        />
    );
};

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
  )(Router);
  