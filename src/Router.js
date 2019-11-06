import React from 'react';
import Dashboard from "./components/Dashboard"
import MainContainer from './components/MainContainer';
import OtoJobsMain from './components/OtoJobsMain';
import { Route, Link, Redirect, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ResultTable from './components/ResultTable';
import ResultTablePrev from './components/ResultTablePrev';
import HomePageDashboard from './components/HomePageDashboard';
import Signin from './components/Signin';
import OtojobsRecent from './components/OtojobsRecent';
import DedupeRecent from './components/DedupeRecent';
import requireAuth from './components/require_auth';
import noRequireAuth from './components/no_require_auth';




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
                
                <Route exact path="/" component={requireAuth(MainContainer)} />
               
                <Route exact path="/Otojobs" component={requireAuth(OtoJobsMain)} /> 
                
                <Route exact path="/Login" component={noRequireAuth(Signin)} /> 
                <Route exact path="/Home" component={requireAuth(HomePageDashboard)} /> 
            
                <Route path="/dashboard/:tranId" component={requireAuth(Dashboard)} />
                <Route path="/dedupePrev/:transactionId/:version" component={requireAuth(ResultTablePrev)} />
                
                <Route path="/dedupeTable" component={requireAuth(ResultTable)} />
                <Route path="/otojobsRecent" component={requireAuth(OtojobsRecent)} />
                <Route path="/dedupeRecent" component={requireAuth(DedupeRecent)} />
             {/*    <ProtectedRoute loggedIn={this.props.isAuth} path="/Otojobs" component={OtoJobsMain} /> */}
            </Switch>
            </div>
        )
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
  
    };
  };
  
  // Use connect to put them together
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Router);
  