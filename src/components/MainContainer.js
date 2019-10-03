import React from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import OptionSelectModal from './OptionSelectModal';
import Navbar from 'react-bootstrap/Navbar';
import ResultTable from './ResultTable';
import DedupeActions from '../actions/DedupeActions';
import { bindActionCreators } from 'redux';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'

import LoadingOverlay from 'react-loading-overlay';
import LoadingBar from 'react-top-loading-bar';

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
      fileName: 'Choose File',
      downloadFile: null,
      csvData:[],
      thresholdValues : [0.5,0.55,0.60,0.65,0.70,0.75,0.80,0.85,0.90,0.95,1],
      threshold : 0.75
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
    this.setState({ fileName: 'Choose File' });
  }

  onChange(e) {
    this.setState({
      file: e.target.files && e.target.files[0],
      fileName: e.target.files && e.target.files[0] && e.target.files[0].name
    });
  }

  fileUpload(file) {
    if(file) {
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
      csvData:dataParse[0]
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
          const keys = Object.keys(finalData)
          let user = {};
          keys.forEach((key) => {
            user[key] = finalData[key].value;
          })
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
    setTimeout(()=>{
      this.setState({
        isLoading: false
      })
    }, 500)
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
        })
      }, 300)
    } else {
      this.setState({
        loadingBarProgress
      })
    }
  }

  onLoaderFinished = () => {
    this.setState({ loadingBarProgress: 0 });
  };

  undoAction() {
    let undoObject = {
      version : this.props.initialTransaction && this.props.initialTransaction.version - 1,
      transactionId : this.props.initialTransaction && this.props.initialTransaction.transactionId
    }
   // this.props.DedupeActions.setCurrentVersion(undoObject);
    this.props.DedupeActions.getTransactionStateUndoRedo(undoObject);
    this.forceUpdate();
  }

  redoAction() {
    let redoObject = {
      version : this.props.initialTransaction && this.props.initialTransaction.version + 1,
      transactionId : this.props.initialTransaction && this.props.initialTransaction.transactionId
    }
   // this.props.DedupeActions.setCurrentVersion(redoObject);
    this.props.DedupeActions.getTransactionStateUndoRedo(redoObject);
    this.forceUpdate();
  }

  exportExcel(data) {
     console.log("in download", data)
      let fd = new FormData();
      fd.append('transactionId', data.transactionId)
      fd.append('version', data.version)
      fetch('https://otobots.otomashen.com:6969/dedupe/downloadFile', {
        method: 'POST',
        body: fd
      }).then(response => {
      //  console.log("in download response", response)
        response.blob()
        .then(blob => {
					let url = window.URL.createObjectURL(blob);
					let a = document.createElement('a');
					a.href = url;
					a.download = 'export.csv';
					a.click();
				})
      })
      }

      thresholdChange(input){
        this.setState({
          threshold:input
        });
      }
  

  render() {
console.log("initialobject",this.props.initialTransaction)
console.log("current",this.props.currentVersion)

    const { responseData } = this.state;
    return (
      <>
        <LoadingBar
          progress={this.state.loadingBarProgress}
          height={7}
          color='red'
          onLoaderFinished={() => this.onLoaderFinished()}
        />
        <LoadingOverlay
          active={this.state.isLoading}
          className='loader-spiner'
          spinner={true}
          fadeSpeed={300}
          text='Loading...'
        > 
          <div className={`container-fluid ${this.state.isLoading && 'container-without-scroll' || ''}`}>

            <Navbar bg="dark" variant="dark" sticky="top" expand="lg">
              <Navbar.Brand href="#home">Dedupe Api Caller</Navbar.Brand>

              <div className="input-group ">
                <div className="input-group-prepend">
                  &nbsp; &nbsp; &nbsp;
              <br />
                  <span
                    onClick={this.onFormSubmit}
                    className="input-group-text"
                    id="inputGroupFileAddon01"
                  >
                    Upload
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
                  <label className="custom-file-label" htmlFor="inputGroupFile01">
                    {this.state.fileName}{' '}
                  </label>
                </div>
                &nbsp; &nbsp; &nbsp;
          </div>
              <div>
              </div>

    <DropdownButton size = "sm" id="dropdown-item-button" title={"Threshold: "+this.state.threshold}>
      {this.state.thresholdValues.map((eachValue) => {
        return(
          <Dropdown.Item onClick = {() => this.thresholdChange(eachValue)} as="button">{eachValue}</Dropdown.Item>
        )
      })}

</DropdownButton>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button variant="primary" 
          disabled = {this.props.initialTransaction && this.props.initialTransaction.version == 0 ? true : false }
          className=" fa fa-undo " size="lg" style={{ color: "#FFF" }}  onClick = {this.undoAction}>&nbsp;Undo
         
          </Button>&nbsp;
          <Button variant="primary" className=" fa fa-repeat " size="lg" style={{ color: "#FFF" }}
          disabled = {(this.props.initialTransaction && this.props.initialTransaction.version) < (this.props.currentVersion && this.props.currentVersion.version)
            ? false : true }
          onClick = {this.redoAction}
          >&nbsp;Redo</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button variant="success" className=" fa fa-download " size="lg" style={{ color: "#FFF" }
         }
         disabled = {this.props.initialTransaction && this.props.initialTransaction.version == 0 ? true : false}
          onClick = {() => this.exportExcel(this.props.initialTransaction)}
          >&nbsp;Export</Button>


            </Navbar>
            <div className="row justify-content-md-center"></div>
            <div >
              {this.state.displayTable ? (
                <ResultTable
                  data={responseData}
                  afterMerge={params => {
                    this.afterMerge(params);
                  }}
                />
              ) : null}
            </div>
          </div>
         </LoadingOverlay> 
         <OptionSelectModal threshold = {this.state.threshold} file = {this.state.file} csvData = {this.state.csvData} />
      </>
    );
  }
}

// Maps state from store to props
const mapStateToProps = (state, ownProps) => {
  return {
    // You can now say this.props.books
    dedupeData: state.DedupeReducer.dedupeData,
    loadingBarProgress: state.DedupeReducer.percentage,
    initialTransaction : state.DedupeReducer.initialTransaction,
    currentVersion : state.DedupeReducer.currentVersion
  }
};

// Maps actions to props
const mapDispatchToProps = (dispatch) => {
  return {
    postTransaction: (formData) => dispatch(DedupeActions.postTransaction(formData)),
    DedupeActions: bindActionCreators(DedupeActions, dispatch)

    //getTransactionState: (formData) => dispatch(DedupeActions.getTransactionState(formData))
  }
};

// Use connect to put them together
export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);