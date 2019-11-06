import React, { Component } from "react";
import { Container, Nav } from "./styled-components";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import ReactFC from "react-fusioncharts";
import "./charts-theme";
import Dropdown from "react-dropdown";
import { connect } from "react-redux";
import DedupeActions from "../actions/DedupeActions";
import OtoJobsActions from "../actions/OtoJobsActions";
import { bindActionCreators } from "redux";
ReactFC.fcRoot(FusionCharts, Charts);

const bg = require("./bg3.jpg");

class HomePageDashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      dropdownOptions: [],
      selectedValue: null,
      amRevenue: null,
      ebRevenue: null,
      etRevenue: null,
      totalRevenue: null,
      productViews: null,
      purchaseRate: " ",
      checkoutRate: " ",
      abandonedRate: " ",
      ordersTrendStore: [
        {label: "Append",
        value: 400,
        displayValue: `${400} rows`},
        {label: "Standardize",
        value: 310,
        displayValue: `${310} rows`},
        {label: "Validate",
        value: 280,
        displayValue: `${280} rows`},
        {label: "Format",
        value: 100,
        displayValue: `${100} rows`},



      ],

      dData: {}

    };
  }
  componentDidMount() {
    const fd = new FormData();
    fd.append('customerId', localStorage.getItem('customerId'))
    fetch('https://otobots.otomashen.com:6969/transaction/getTransactionStatistics', {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('user'),
      }),
      body: fd
    })
      .then((data) => (data.json()))
      .then((data) => {
        this.setState({
          dData: data
        })
      })


  }

  updateDashboard = event => {
    this.getData(event.value);
    this.setState({ selectedValue: event.value });
  };

  render() {
    let transactionCount = this.state.dData && this.state.dData.message && this.state.dData.message.transactionCount
    let validateCount = this.state.dData && this.state.dData.message && this.state.dData.message.validateCount
    let standardizeCount = this.state.dData && this.state.dData.message && this.state.dData.message.standardizeCount
    let appendCount = this.state.dData && this.state.dData.message && this.state.dData.message.appendCount
    console.log("transactionCount", this.state.dData)
    return (
      <Container className = "body-db">
        
        {/* content area start */}
        <Container className="container-fluid pr-5 pl-5 pt-5 pb-5">
          {/* row 1 - revenue */}
          <Container className="row">
            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Total Transactions
                  </Container>
                </Container>
                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">#</span>
                  640
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Total Dedupe Transactions
                  </Container>
                </Container>
                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">#</span>
                  240
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Total Otojobs Transactions
                  </Container>
                </Container>

                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">#</span>
                  400
                </Container>
              </Container>
            </Container>

            <Container className="col-lg-3 col-sm-6 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Live Transactions
                  </Container>

                </Container>

                <Container className="card-value pt-4 text-x-large">
                  <span className="text-large pr-1">#</span>
                 12
                </Container>
              </Container>
            </Container>
          </Container>
    





        <Container className="row">
            <Container className="col-md-4 col-lg-3 is-light-text mb-4">
              <Container className="card grid-card is-card-dark">
                <Container className="card-heading mb-3">
                  <Container className="is-dark-text-light letter-spacing text-small">
                    Total Deduped data
                  </Container>
                </Container>
                <Container className="card-value pt-4 text-x-large">
                  56.3k
                  <span className="text-medium pl-2 is-dark-text-light">
                    rows
                  </span>
                </Container>
              </Container>
            </Container>
           
            <Container className="col-md-8 col-lg-9 is-light-text mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="row full-height">
                  <Container className="col-sm-4 full height">
                    <Container className="chart-container full-height">
                      <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "100%",
                          height: "100%",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Completed Transactions",
                              theme: "ecommerce",
                              defaultCenterLabel: `56%`,
                              paletteColors: "#3B70C4, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `56`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${100 - 56}`
                              }
                            ]
                          }
                        }}
                      />
                    </Container>
                  </Container>
                  <Container className="col-sm-4 full-height border-left border-right">
                    <Container className="chart-container full-height">
                    <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "100%",
                          height: "100%",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Active Transactions",
                              theme: "ecommerce",
                              defaultCenterLabel: `44%`,
                              paletteColors: "#41B6C4, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `44`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${100 - 44}`
                              }
                            ]
                          }
                        }}
                      />
                    </Container>
                  </Container>
                  <Container className="col-sm-4 full-height">
                    <Container className="chart-container full-height">
                    <ReactFC
                        {...{
                          type: "doughnut2d",
                          width: "100%",
                          height: "100%",
                          dataFormat: "json",
                          containerBackgroundOpacity: "0",
                          dataSource: {
                            chart: {
                              caption: "Failed Transactions",
                              theme: "ecommerce",
                              defaultCenterLabel: `8%`,
                              paletteColors: "#EDF8B1, #000000"
                            },
                            data: [
                              {
                                label: "active",
                                value: `16`
                              },
                              {
                                label: "inactive",
                                alpha: 5,
                                value: `${100 - 16}`
                              }
                            ]
                          }
                        }}
                      />
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Container>
          </Container>
          

{/* row 3 - orders trend */}
          <Container className="row" style={{ minHeight: "400px" }}>
            <Container className="col-md-6 mb-4">
              <Container className="card is-card-dark chart-card">
                <Container className="chart-container large full-height">
                  <ReactFC
                    {...{
                      type: "bar2d",
                      width: "100%",
                      height: "100%",
                      dataFormat: "json",
                      containerBackgroundOpacity: "0",
                      dataEmptyMessage: "Loading Data...",
                      dataSource: {
                        chart: {
                          theme: "ecommerce",
                          caption: "Performed Operations",
                          subCaption: "By Rows"
                        },
                        data: this.state.ordersTrendStore
                      }
                    }}
                  />
                </Container>
              </Container>
            </Container>
            </Container>
            </Container>

        {/* content area end */}
      </Container>
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
)(HomePageDashboard);
