import React from 'react';
import Dashboard from "./components/Dashboard"
import Login from './components/Login'
import MainContainer from './components/MainContainer';
import OtoJobsMain from './components/OtoJobsMain';
import { Route, Link, Redirect, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ResultTable from './components/ResultTable';
import OtojobsRecent from './components/OtojobsRecent';



class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };

        //this.onChange = this.onChange.bind(this);

    }

    render() {

        return (
            <div >
            <Switch>
                
                <Route exact path="/" component={MainContainer} />
                <Route exact path="/login" component={Login} />
                 <Route exact path="/Otojobs" component={OtoJobsMain} /> 
                <Route path="/dashboard/:tranId" component={Dashboard} />
                <Route path="/dedupeTable" component={ResultTable} />
                <Route path="/otojobsRecent" component={OtojobsRecent} />
             {/*    <ProtectedRoute loggedIn={this.props.isAuth} path="/Otojobs" component={OtoJobsMain} /> */}
            </Switch>
            </div>
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
  