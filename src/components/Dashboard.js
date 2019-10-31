import React from "react";
import { connect } from "react-redux";
import DedupeActions from "../actions/DedupeActions";
import OtoJobsActions from "../actions/OtoJobsActions";
import { bindActionCreators } from "redux";
//import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OtoLiquidGauge from 'react-liquid-gauge';
//import OtoLiquidGauge from '../atoms/liquid-gauge';
import Card from 'react-bootstrap/Card'
import OtoBarChart from '../atoms/oto-bar-chart';
import Col from 'react-bootstrap/Col'
import DonutChart from 'react-donut-chart';
import CountUp from 'react-countup';
import * as d3 from 'd3';
import { withStyles } from '@material-ui/core/styles';
import { color } from 'd3-color';
import USMap from './us-states-map/index';

import { interpolateRgb } from 'd3-interpolate';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const bg = require("./bg3.jpg");

var Papa = require("papaparse/papaparse.min.js");

const styles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      responseData: {}

    };


  }
  componentDidMount() {

    const { match: { params } } = this.props;

    const fd = new FormData();
    fd.append('transactionId', params.tranId)
    fetch('https://otobots.otomashen.com:6969/transaction/getDetails', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('user'),
    }),
      body: fd
    })
      .then((data) => (data.json()))
      .then((data) => {
        this.setState({
          responseData: data
        })
      })


  }

  getPercentage = (value = 0, outOf = 100) => {
    return Math.round((value / outOf) * 100);
  };
  render() {
    const radius = 60;
    let { responseData } = this.state;
    let jobDetails = responseData && responseData.message;
    let numberOfRecords = responseData && responseData.message && responseData.message.numberOfRecords
    console.log("numberOfRecords", numberOfRecords)
    let industryStats = responseData && responseData.message &&
      responseData.message.dashboardStats && responseData.message.dashboardStats[0] && responseData.message.dashboardStats[0].industryStats

    let finalObj = []
    industryStats && Object.keys(JSON.parse(industryStats)).map((keys) => {
      finalObj.push({
        label: keys,
        value: JSON.parse(industryStats)[keys]
      })
    })

    const appendData =
      (jobDetails &&
        jobDetails.appendFunction &&
        jobDetails.appendFunction[0]) ||
      {};

    const validateData =
      (jobDetails &&
        jobDetails.validateFunction &&
        jobDetails.validateFunction[0]) ||
      {};
    const standardizeData =
      (jobDetails &&
        jobDetails.standardizeFunction &&
        jobDetails.standardizeFunction[0]) ||
      {};
    const formatData =
      (jobDetails &&
        jobDetails.formatFunction &&
        jobDetails.formatFunction[0]) ||
      {};
    const dashboardData =
      (jobDetails &&
        jobDetails.dashboardStats &&
        jobDetails.dashboardStats[0]) ||
      null;
    return (
      <div className="container-fluid " style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        overFlowY: "hidden"
      }}>

        <br />
        <div>
          <div className="row ">
            <Col style={{backgroundcolor: 'rgba(255, 255, 255, 0.36)'}}>
              <Card bg="light"  >
                <Card.Header>Progress Overview</Card.Header>
                <Card.Body>
                  <div className="row " >
                    <div className="col-md-3">

                      <OtoLiquidGauge
                        style={{ margin: '0 auto' }}
                        width={radius * 2}
                        height={radius * 2}
                        value={this.getPercentage(
                          appendData.currentIndex,
                          numberOfRecords
                        )}
                        startColor="red"
                        endColor="yellow"
                      />
                    </div>

                    <div className="col-md-3" >

                      <OtoLiquidGauge
                        style={{ margin: '0 auto' }}
                        width={radius * 2}
                        height={radius * 2}
                        value={this.getPercentage(
                          standardizeData.currentIndex,
                          numberOfRecords
                        )}
                        startColor="red"
                        endColor="purple"
                      />

                    </div>

                    <div className="col-md-3">

                      <OtoLiquidGauge
                        style={{ margin: '0 auto' }}
                        width={radius * 2}
                        height={radius * 2}
                        value={this.getPercentage(
                          formatData.currentIndex,
                          numberOfRecords
                        )}
                        startColor="red"
                        endColor="maroon"
                      />
                    </div>

                    <div className="col-md-3">

                      <OtoLiquidGauge
                        style={{ margin: '0 auto' }}
                        width={radius * 2}
                        height={radius * 2}
                        value={this.getPercentage(
                          validateData.currentIndex,
                          numberOfRecords
                        )}
                        startColor="red"
                        endColor="blue"
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row " >
                    <div className="col-md-3">
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Append</p>
                    </div>
                    <div className="col-md-3">
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Standardize</p>

                    </div>
                    <div className="col-md-3">
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Format</p>

                    </div>
                    <div className="col-md-3">
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Validate</p>

                    </div>
                  </div>




                </Card.Body>
              </Card>

              <br />


              <Card bg="light">
                <Card.Header>Statistics</Card.Header>
                <Card.Body>
                  <div className="row " >
                    <div className="col-md-4">
                      <Col style={{ color: "black" }}>
                        <br />
                        <br />
                        <br />
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  
                <strong style={{ fontSize: '40px' }}><CountUp start={0} end={57} /></strong>
                        <br />
                        <br />
                        <br />

                      </Col>

                    </div>

                    <div className="col-md-4" style={{ maxHeight: '10px' }}>
                      <div style={{ width: 150 }}>
                        <CircularProgressbar value={this.getPercentage(
                          appendData.currentIndex,
                          numberOfRecords
                        )} text={`${this.getPercentage(
                          appendData.currentIndex,
                          numberOfRecords
                        )}%`} />
                      </div>

                    </div>

                    <div className="col-md-4" style={{ maxHeight: '10px' }}>
                      <div style={{ width: 150 }}>
                        <CircularProgressbar value={this.getPercentage(
                          appendData.affectedRows,
                          numberOfRecords
                        )}
                          styles={buildStyles({
                            textColor: 'green',
                            pathColor: 'green',

                          })}
                          text={`${this.getPercentage(
                            appendData.affectedRows,
                            numberOfRecords
                          )}%`} />
                      </div>

                    </div>


                  </div>
                  <br />



                  <div className="row " >

                    <div className="col-md-4">
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Records</p>
                    </div>
                    <div className="col-md-4">
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Processed</p>

                    </div>
                    <div className="col-md-4">
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Match</p>

                    </div>
                
                  </div>




                </Card.Body>
              </Card>

            </Col>


            <Col>
              <Card bg="light" style={{ height: '40rem' }}>
                <Card.Header>Industry Segmentation</Card.Header>
                <Card.Body>

                  <div className="row " >
                    <div className="col-md-12">
                      <DonutChart
                        height='450'
                        width='700'
                        colors={['#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b']}
                        data={finalObj} />
                    </div>
                  </div>

                </Card.Body>
              </Card>
            </Col>


          </div>
          <br />
          <div className="row">
            <Col>
              <Card bg="light" style={{height:"31.60rem"}}>
                <Card.Header>Region Stats</Card.Header>
                <Card.Body>
                  <div className="row " >
                    <div className="col-md-12" style={{ height: '60', width: '80' }}>
                      {dashboardData && <USMap data={dashboardData.statesStats} />}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col >
              <Card  bg="light" >
                <Card.Header>Revenue Stats</Card.Header>
                <Card.Body>
                  <div className="row " >
                    <div className="col-md-12 "  >
                      {dashboardData && (
                        <OtoBarChart
                          data={dashboardData.revenueStats}
                          color="blue"
                          diffColor="yellow"
                        />
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col >
              <Card bg="light" >
                <Card.Header>Employee Stats</Card.Header>
                <Card.Body>
                  <div className="row " >
                    <div className="col-md-12 "  >
                      {dashboardData && (
                        <OtoBarChart
                          data={dashboardData.employeesStats}
                          color="green"
                          diffColor="yellow"
                        />
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </div>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    dashboardData: state.OtoJobsReducer.details
  };
};

// Maps actions to props
const mapDispatchToProps = dispatch => {
  return {
    postTransaction: formData => dispatch(DedupeActions.postTransaction(formData)),
    DedupeActions: bindActionCreators(DedupeActions, dispatch),
    OtoJobsActions: bindActionCreators(OtoJobsActions, dispatch)


    //getTransactionState: (formData) => dispatch(DedupeActions.getTransactionState(formData))
  };
};

// Use connect to put them together
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Dashboard));
