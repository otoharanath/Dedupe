import React from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import OptionSelectModal from "./OptionSelectModal";
import Navbar from "react-bootstrap/Navbar";
import { Nav, Form, FormControl, NavItem } from 'react-bootstrap';
import ResultTable from "./ResultTable";
import DedupeActions from "../actions/DedupeActions";
import { bindActionCreators } from "redux";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import LoadingOverlay from "react-loading-overlay";
import LoadingBar from "react-top-loading-bar";
import SideBar from "./sidebar";
import Table from "react-bootstrap/Table";
import lines from 'svg-patterns/p/lines';
import stringify from 'virtual-dom-stringify';
const bg = require("./bg.jpg");
const divStyle = {
  width: "100%",
  height: "80%",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat"
};
const pattern = lines({
  stroke: '#9c92ac',
  background: '#dfdbe5',
  orientations: [45]
});

var Papa = require("papaparse/papaparse.min.js");

class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      displayTable: false,
      isLoading: false,
      responseData: null,
      loadingBarProgress: 0,
      fileName: "Choose File",
      downloadFile: null,
      csvData: [],
      thresholdValues: [
        0.5,
        0.55,
        0.6,
        0.65,
        0.7,
        0.75,
        0.8,
        0.85,
        0.9,
        0.95,
        1
      ],
      threshold: 0.75
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.undoAction = this.undoAction.bind(this);
    this.redoAction = this.redoAction.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
    this.updateData = this.updateData.bind(this);
    this.thresholdChange = this.thresholdChange.bind(this);
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

  updateData(result) {
    var dataParse = result.data;
    this.setState({
      csvData: dataParse[0]
    });
    this.props.DedupeActions.setShowSelectModal(true);
    this.forceUpdate();
  }

  afterMerge = params => {
    this.setState({
      isLoading: true
    });
    const { responseData } = this.state;
    const { finalData, rows, unCheckedIds } = params;
    const parentId = rows[0].id;
    const mergedData = responseData
      .map(item => {
        // remove the row if it matchs with the main merge row.
        let matches = item.matches.map(match => JSON.parse(match));
        const index = matches.findIndex(match => match.index === parentId);

        if (index !== -1 && !(unCheckedIds && unCheckedIds.length)) {
          return false;
        } else if (index !== -1 && unCheckedIds.indexOf(item.id) === -1) {
          return false;
        }

        // update the main row data after merging the selection.
        if (item.id === parentId) {
          const keys = Object.keys(finalData);
          let user = {};
          keys.forEach(key => {
            user[key] = finalData[key].value;
          });
          item.data = JSON.stringify(user);
        }

        // remove matches if all checkboxes are checked.
        if (item.id === parentId && !(unCheckedIds && unCheckedIds.length)) {
          item.matches = [];
        } else if (item.id === parentId) {
          const filteredMatches = matches
            .filter(match => unCheckedIds.indexOf(match.index) !== -1)
            .map(match => {
              return JSON.stringify(match);
            });

          // remove matches of all checked checkboxes.
          item.matches = filteredMatches;
        }
        return item;
      })
      .filter(item => item);

    this.setState({
      responseData: mergedData
    });
    setTimeout(() => {
      this.setState({
        isLoading: false
      });
    }, 500);
  };

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

  onLoaderFinished = () => {
    this.setState({ loadingBarProgress: 0 });
  };

  undoAction() {
    let undoObject = {
      version:
        this.props.initialTransaction &&
        this.props.initialTransaction.version - 1,
      transactionId:
        this.props.initialTransaction &&
        this.props.initialTransaction.transactionId
    };
    // this.props.DedupeActions.setCurrentVersion(undoObject);
    this.props.DedupeActions.getTransactionStateUndoRedo(undoObject);
    this.forceUpdate();
  }

  redoAction() {
    let redoObject = {
      version:
        this.props.initialTransaction &&
        this.props.initialTransaction.version + 1,
      transactionId:
        this.props.initialTransaction &&
        this.props.initialTransaction.transactionId
    };
    // this.props.DedupeActions.setCurrentVersion(redoObject);
    this.props.DedupeActions.getTransactionStateUndoRedo(redoObject);
    this.forceUpdate();
  }

  exportExcel(data) {
    let fd = new FormData();
    fd.append("transactionId", data.transactionId);
    fd.append("version", data.version);
    fetch("https://otobots.otomashen.com:6969/dedupe/downloadFile", {
      method: "POST",
      body: fd
    }).then(response => {
      //  console.log("in download response", response)
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "export.csv";
        a.click();
      });
    });
  }

  thresholdChange(input) {
    this.setState({
      threshold: input
    });
  }

  toProperCase = function (txt) {
    return txt.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };

  render() {
    const { responseData } = this.state;
    return (
      <div className="container-flex container-without-scroll wrapper"
     
      style={{
        backgroundImage: `url(${bg})`,
        width: "100%",
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overFlow:'hidden'
      }}
    >
 

            <div
              className={`container-fluid `}>

            
              <LoadingBar
                progress={this.state.loadingBarProgress}
                height={7}
                color="red"
                onLoaderFinished={() => this.onLoaderFinished()}
              />
              {this.state.displayTable ? (
                <Navbar

                  style={{
                    position: "fixed",
                    left: "50%",
                    top: "95%",
                    transform: "translate(-50%, -90%)",
                    backgroundColor: 'black'
                  }}
                  sticky="bottom"
                >
                   <br />
                  <Navbar.Collapse className="justify-content-end">
                   
                    <Button
                      variant="primary"
                      disabled={
                        this.props.initialTransaction &&
                          this.props.initialTransaction.version == 0 &&
                          this.props.initialTransaction
                          ? true
                          : false
                      }

                      size="sm"
                      style={{ color: "#FFF" }}
                      onClick={this.undoAction}
                    >
                      <span className=" fa fa-undo "></span>
                      &nbsp;Undo
                  </Button>
                    &nbsp;  &nbsp;
  
                  <Button
                      variant="primary"

                      size="sm"
                      style={{ color: "#FFF" }}
                      disabled={
                        (this.props.initialTransaction &&
                          this.props.initialTransaction.version) <
                          (this.props.currentVersion &&
                            this.props.currentVersion.version)
                          ? false
                          : true
                      }
                      onClick={this.redoAction}
                    >
                      <span className=" fa fa-repeat "></span>
                      &nbsp;Redo
                  </Button>
                    &nbsp;  &nbsp;
                  <Button
                      variant="success"

                      size="sm"
                      style={{ color: "#FFF" }}
                      disabled={
                        this.props.initialTransaction &&
                          this.props.initialTransaction.version == 0
                          ? true
                          : false
                      }
                      onClick={() =>
                        this.exportExcel(this.props.initialTransaction)
                      }
                    >
                      <span className=" fa fa-download "></span>
                      &nbsp;Export
                  </Button>
                  
                  </Navbar.Collapse>
                  <br/>
                </Navbar>
              ) : null}

              {this.state.displayTable ? null : (
                <div
                  className="col-md-4 col-md-offset-4"
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

                    <div className="input-group col-md-9">
                      &nbsp;&nbsp;
                      <div className="input-group-prepend">
                        <span
                        style={{ cursor: 'pointer' }}
                          onClick={this.onFormSubmit}
                          className="input-group-text"
                          id="inputGroupFileAddon01"
                        >
                          {" "}
                          Upload{" "}
                        </span>
                      </div>
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="inputGroupFile01"
                          onChange={this.onChange}
                          aria-describedby="inputGroupFileAddon01"
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="inputGroupFile01"
                        >
                          {this.props.active && this.props.active.filename}
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <DropdownButton
                        size="md"
                        id="dropdown-item-button"
                        title={this.state.threshold}
                      >&nbsp;
                        {this.state.thresholdValues.map(eachValue => {
                        return (
                          <Dropdown.Item
                            onClick={() => this.thresholdChange(eachValue)}
                            as="button"
                          >
                            {eachValue}
                          </Dropdown.Item>

                        );
                      })}
                      </DropdownButton>
                      
                    </div>

                  </div>
                  <br />
                </div>

              )}

          

                <div >
                  {this.state.displayTable ? (
                    <div className = "container-flex" style = {{overflowY:'scroll', maxHeight:'80vh'}}>
                    <ResultTable
                      data={responseData}
                      afterMerge={params => {
                        this.afterMerge(params);
                      }}
                    />
                    </div>
                  ) : null}
                </div>
              </div>
          
             <OptionSelectModal
              threshold={this.state.threshold}
              file={this.state.file}
              csvData={this.state.csvData}
            /> 
     
        </div>
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
        active: state.DedupeReducer.active
      };
    };
    
    // Maps actions to props
const mapDispatchToProps = dispatch => {
  return {
          postTransaction: formData =>
          dispatch(DedupeActions.postTransaction(formData)),
        DedupeActions: bindActionCreators(DedupeActions, dispatch)
    
        //getTransactionState: (formData) => dispatch(DedupeActions.getTransactionState(formData))
      };
    };
    
    // Use connect to put them together
    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(MainContainer);
