import React from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import OptionSelectModal from "./OptionSelectModal";
import Navbar from "react-bootstrap/Navbar";
import { Nav, Form, FormControl, NavItem } from 'react-bootstrap';
import ResultTable from "./ResultTable";
import DedupeActions from "../actions/DedupeActions";
import OtoJobsActions from "../actions/OtoJobsActions";
import { bindActionCreators } from "redux";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import LoadingOverlay from "react-loading-overlay";
import LoadingBar from "react-top-loading-bar";
import SideBar from "./sidebar";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Stepper from 'react-stepper-horizontal';
import Table from "react-bootstrap/Table";
import { withRouter } from "react-router-dom";


/* import Dashboard from "./Dashboard" */
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';


var Papa = require("papaparse/papaparse.min.js");

class OtoJobsMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxColorAppend: [],
      boxColorValidate: [],
      boxColorFormatMain: [],
      boxColorFormatSub: [],
      boxColorStandard: [],
      file: null,
      displayTable: false,
      isLoading: false,
      loadingBarProgress: 0,
      steps: [{
        title: 'Select File'
      }, {
        title: 'Append'
      }, {
        title: 'Validate'
      },
      {
        title: 'Format'
      }, {
        title: 'Standardize'
      }],
      currentStep: 0,

    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
    this.onClickBack = this.onClickBack.bind(this);
    this.boxClick = this.boxClick.bind(this);
    this.onClickFinish = this.onClickFinish.bind(this);
    this.dashboardCall=this.dashboardCall.bind(this);

  }

  componentWillMount() {
    this.props.OtoJobsActions.getOptionData();

  }

  onFormSubmit(e) {
    e.preventDefault();
    const { file } = this.state;
    this.fileUpload(file);
    this.setState({ fileName: "Choose File" });
  }



  onChange(e) {
    this.setState({
      file: e.target.files && e.target.files[0],
      fileName: e.target.files && e.target.files[0] && e.target.files[0].name
    });
    this.props.active.filename =
      e.target.files && e.target.files[0] && e.target.files[0].name;
  }

  fileUpload(file) {
    if (file) {
      Papa.parse(file, {
        complete: this.updateData,
        header: false
      });
      // fetch file data.
      // this.props.postTransaction(form)
    }
  }

  componentWillReceiveProps(newProps) {
    const { dedupeData, loadingBarProgress } = newProps;
    if (loadingBarProgress === 100) {
      this.setState({
        loadingBarProgress: 100
      });

      setTimeout(() => {
        this.setState({
          responseData: dedupeData,
          displayTable: true,
          isLoading: false,
          loadingBarProgress: 0
        });
      }, 300);
    } else {
      this.setState({
        loadingBarProgress
      });
    }
  }


  toProperCase = function (txt) {
    return txt.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };

  onClickNext() {
    const { steps, currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  }

  onClickBack() {
    const { steps, currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });

  }

  boxClick(item, type) {

    if (type == "append") {
      let index = this.state.boxColorAppend.findIndex(yo => yo == item)
      if (index == -1) {
        this.state.boxColorAppend.push(item)
      }
      else {
        this.state.boxColorAppend.splice(index, 1);
      }
    }

    if (type == "validate") {
      let index = this.state.boxColorValidate.findIndex(yo => yo == item)
      if (index == -1) {
        this.state.boxColorValidate.push(item)
      }
      else {
        this.state.boxColorValidate.splice(index, 1);
      }
    }

    if (type == "formatMain") {
      let index = this.state.boxColorFormatMain.findIndex(yo => yo == item)
      if (index == -1) {
        this.state.boxColorFormatMain.push(item)
      }
      else {
        this.state.boxColorFormatMain.splice(index, 1);
      }
    }

    if (type == "formatSub") {
      let index = this.state.boxColorFormatSub.findIndex(yo => yo == item)
      if (index == -1) {
        this.state.boxColorFormatSub.push(item)
      }
      else {
        this.state.boxColorFormatSub.splice(index, 1);
      }
    }

    if (type == "standard") {
      let index = this.state.boxColorStandard.findIndex(yo => yo == item)
      if (index == -1) {
        this.state.boxColorStandard.push(item)
      }
      else {
        this.state.boxColorStandard.splice(index, 1);
      }
    }



    this.forceUpdate();
  }

  onClickFinish() {
    let sendObject = {
      customerId: 1,
      action: {
        append: this.state.boxColorAppend.length == 0 ? false : true,
        standardize: this.state.boxColorStandard.length == 0 ? false : true,
        validate: this.state.boxColorValidate.length == 0 ? false : true,
        format: this.state.boxColorFormatMain.length == 0 ? false : true,
        encryptFile: false,
        selectedFields: this.state.boxColorAppend ? this.state.boxColorAppend.toString() :null,
        formattingOptions: {
          phone:this.state.boxColorFormatSub ? this.state.boxColorFormatSub.toString() :null
        },
        standardizeOptions: this.state.boxColorStandard ? this.state.boxColorStandard.toString() :null
      },
      files: this.state.file
    }
    this.props.OtoJobsActions.postTransaction(sendObject,this.state.file);
    
    
  //  this.dashboardCall();
    //this.props.transactionId  ? this.props.OtoJobsActions.getDetails(this.props.transactionId && this.props.transactionId.transactionId) :null;
    this.forceUpdate();
    //this.props.transactionId && this.props.history.push('/dashboard/'+this.props.transactionId.transactionId) 
  }

  dashboardCall() {
    this.props.transactionId && this.props.history.push('/dashboard/'+this.props.transactionId.transactionId) 

    //this.props.transactionId && this.props.history.push('/dashboard/'+this.props.transactionId && this.props.transactionId.transactionId) 
  }

  render() {

    const { steps, currentStep } = this.state;
    let appendOptions = (String(this.props.optionData && this.props.optionData.message && this.props.optionData.message.databaseFields)).split(', ')
    let validateOptions = (String(this.props.optionData && this.props.optionData.message && this.props.optionData.message.validationOptions)).split(', ')
    let formattingOptions = this.props.optionData && this.props.optionData.message && this.props.optionData.message.formattingOptions
    let formattingOptionValues = String(this.props.optionData && this.props.optionData.message && this.props.optionData.message.formattingOptions && Object.values(this.props.optionData.message.formattingOptions)).split(',')

    console.log("fsfs", this.state.file)
    console.log("udhfkdfsiughksdughkd", this.props.details)
    return (

      <div className='container-fluid'>
        <>
          <LoadingOverlay
            active={this.state.isLoading}
            className="loader-spiner"
            spinner={true}
            fadeSpeed={300}
            text="Loading..."
          >
            <div
              className="col-md-5 col-md-offset-4"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: 'rgba(14, 13, 13, 0.74)'
              }}
            >


              <br />
              <div className="row">
                <div className="col-md-12 text-center">
                  <Stepper steps={steps} activeStep={currentStep}
                    defaultColor='white'
                    circleFontColor='black'
                    activeTitleColor='white'
                    activeColor='#87ceeb'
                    completeColor='green'
                    completeTitleColor='white'
                    completeColor='white'
                    completeBarColor='green'
                    defaultTitleColor='white'
                  />
                  <br />
                  {currentStep == 0 ?
                    <FilePond onupdatefiles={(fileItems) => { this.setState({ file: fileItems[0].file }); }} />
                    : null}


                  {currentStep == 1 ?
                    <div style={{ width: '100%' }}>
                      <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                        {appendOptions.map((item) => {
                          return (
                            <Box style={{ cursor: 'pointer' }} bgcolor={this.state.boxColorAppend.includes(item) ? "green" : "white"}
                              onClick={() => this.boxClick(item, "append")} color={this.state.boxColorAppend.includes(item) ? "white" : "black"} p={1} m={0.5} display='flex'
                              justifyContent='center'>{this.toProperCase(item.replace("_", " "))}</Box>)
                        })
                        }
                      </Box>
                    </div>
                    : null}

                  {currentStep == 2 ?
                    <div style={{ width: '100%' }}>
                      <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                        {validateOptions.map((item) => {
                          return (
                            <Box style={{ cursor: 'pointer' }} bgcolor={this.state.boxColorValidate.includes(item) ? "green" : "white"}
                              onClick={() => this.boxClick(item, "validate")} color={this.state.boxColorValidate.includes(item) ? "white" : "black"} p={1} m={0.5} display='flex'
                              justifyContent='center'>{this.toProperCase(item.replace("_", " "))}</Box>)
                        })
                        }
                      </Box>
                    </div>
                    : null}

                  {currentStep == 3 ?
                    <div style={{ width: '100%' }}>
                      <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                        {Object.keys(formattingOptions).map((item) => {
                          return (
                            <Box style={{ cursor: 'pointer' }} bgcolor={this.state.boxColorFormatMain.includes(item) ? "green" : "white"}
                              onClick={() => this.boxClick(item, "formatMain")} color={this.state.boxColorFormatMain.includes(item) ? "white" : "black"} p={1} m={0.5} display='flex'
                              justifyContent='center'>{this.toProperCase(item.replace("_", " "))}</Box>)
                        })
                        }
                      </Box>

                      <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                        {this.state.boxColorFormatMain.includes(Object.keys(formattingOptions)[0]) ?
                          formattingOptionValues.map((item) => {
                            return (
                              <Box style={{ cursor: 'pointer' }} bgcolor={this.state.boxColorFormatSub.includes(item) ? "green" : "white"}
                                onClick={() => this.boxClick(item, "formatSub")} color={this.state.boxColorFormatSub.includes(item) ? "white" : "black"} p={1} m={0.5} display='flex'
                                justifyContent='center'>{item}</Box>)
                          })
                          : null}
                      </Box>
                    </div>
                    : null}


                  {currentStep == 4 ?
                    <div style={{ width: '100%' }}>
                      <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                        {["Phone", "Email"].map((item) => {
                          return (
                            <Box style={{ cursor: 'pointer' }} bgcolor={this.state.boxColorStandard.includes(item) ? "green" : "white"}
                              onClick={() => this.boxClick(item, "standard")} color={this.state.boxColorStandard.includes(item) ? "white" : "black"} p={1} m={0.5} display='flex'
                              justifyContent='center'>{this.toProperCase(item.replace("_", " "))}</Box>)
                        })
                        }
                      </Box>
                    </div>
                    : null}
                  <br />

                  <Button disabled={currentStep == 0 ? true : false} onClick={this.onClickBack}>Back</Button>&nbsp;&nbsp;
                    {steps.length == currentStep + 1 ? <Button onClick={this.onClickFinish} >Finish</Button> :
                    <Button onClick={this.onClickNext}>Next</Button>}
                    <br/>
                    <br/>
                    {this.props.transactionId &&  this.props.transactionId.transactionId != null ? 
                     steps.length == currentStep + 1 ? <Button variant = "success" onClick={this.dashboardCall} >Dashboard</Button> : null
:null}

                </div>
              </div>
              <div className="row">
                <div className="col-md-12 wrapper">
                  <br />
                </div>
              </div>

            </div>
          </LoadingOverlay>

        </>
      </div >

    );
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    dedupeData: state.DedupeReducer.dedupeData,
    loadingBarProgress: state.DedupeReducer.percentage,
    initialTransaction: state.DedupeReducer.initialTransaction,
    currentVersion: state.DedupeReducer.currentVersion,
    active: state.DedupeReducer.active,

    optionData: state.OtoJobsReducer.optionData,
    transactionId:state.OtoJobsReducer.transactionId,
    details:state.OtoJobsReducer.details
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
)(withRouter(OtoJobsMain));
