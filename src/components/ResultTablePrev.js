import Button from 'react-bootstrap/Button';
import DedupeActions from '../actions/DedupeActions';
import MergeModal from './MergeModal';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Navbar from "react-bootstrap/Navbar";
import Draggable from 'react-draggable';
import { Dropdown } from 'semantic-ui-react'
import LoadingBar from "react-top-loading-bar";
const bg = require("./bg.jpg");

class ResultTablePrev extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchData: '',
      userData: '',
      loadingBarProgress: 0,
      isLoading: false,
      matchFound: 0,
      isChecked: false,
      selectedRows: [],
      background: bg,
      checkLength: 0,
      showFinal: false,
      availableVersions : {},
      searchTerm: null
    };
    this.getRowsData = this.getRowsData.bind(this);
  }

  componentWillMount() {
    const { match: { params } } = this.props;
    let data = {
      transactionId: params.transactionId,
      version: params.version
    }

    this.props.DedupeActions.getTransactionStateUndoRedo(data);
    this.props.DedupeActions.getTransactionVersions(data);
    
    
  }


  getColor(value) {
    //value from 0 to 1
    var hue = ((value) * 120).toString(10);
    return ["hsl(", hue, ",90%,40%)"].join("");
  }

  toggleCheckboxChange = (e, index, rowData) => {
    if (e.target.checked) {
      document.getElementById('row' + index).disabled = false;
    }

    const checkboxes = document.getElementsByClassName('checkbox-' + index);
    const checked = [...checkboxes].filter(checkbox => checkbox.checked);
    if (!(checked && checked.length)) {
      document.getElementById('row' + index).disabled = true;
    }
  };

  action = (row, matchedData, rowData) => {
    return (
      <>

      </>
    );
  };

  createRow = row => {
    return row.matches.map((match, index1) => {
      let a = JSON.parse(row.data);
      let b = JSON.parse(match);
      const items = this.props.data;
      const item = items[items.findIndex(items => items.id == b.index)]
      let parsed = JSON.parse(
        item && item.data || null

      );
      if (!parsed) return <></>
      let dynamicMatch = Object.values(parsed);
      return (
        <tr key={index1}>
          {/*  <td>{b.index}</td> */}
          {dynamicMatch.map((heads) => {
            return <td>{heads}</td>
          })
          }

          {/*  <td>{b.rating.toFixed(2)}</td> */}
          <td>
            {this.action(row.id, b, parsed)}
            &nbsp;
          </td>
        </tr>
      );
    });
  };


  toProperCase = function (txt) {
    return txt.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };

  getRowsData = () => {
    const items = this.props.dedupeData;
    const buttonstyle = { paddingTop: '5%' };
    return items.map((row, index) => {
      const user = JSON.parse(row.data);
      let yoyo = [];
      yoyo = Object.keys(user);
      let tabData = Object.values(user);
      return (
        <tr key={index}>
          {/* <td>{row.id}</td> */}
          <td>
            <Table style={{ tableLayout: 'auto' }} className="ui table"  >
              <thead>

                <tr>
                  <th><strong style={{ color: "black" }}>ID</strong></th>
                  {
                    yoyo.map((heads) => {
                      return <th style={{ color: "black" }}><strong style={{ color: "black" }}>{this.toProperCase(heads.replace("_", " "))}</strong></th>
                    })
                  }
                  <th style={{ color: "black" }} ><strong style={{ color: "black" }}>Rating</strong></th>

                </tr>
              </thead>
              <tbody>
                <tr className={row.matches.length === 0 ? null : "tr border_bottom"}>
                  <td>{row.id}</td>
                  {
                    tabData.map((heads) => {
                      return (
                        <td>{heads} </td>
                      )
                    })
                  }

                  <td style={{ justifyContent: "center" }}>---</td>


                </tr>
                {/*  {row.matches.length === 0 ? null :<ColoredLine color="red" />} */}
                {row.matches.sort((a, b) => (JSON.parse(b)).rating - (JSON.parse(a)).rating).map((match, index1) => {

                  let a = JSON.parse(row.data);
                  let b = JSON.parse(match);
                  const items = this.props.dedupeData;
                  const item = items[items.findIndex(items => items.id == b.index)]
                  let parsed = JSON.parse(
                    item && item.data || null

                  );

                  if (!parsed) return <></>
                  let dynamicMatch = Object.values(parsed);
                  return (
                    <tr key={index1}>
                      <td style={{ color: "black" }}>{b.index}</td>
                      {dynamicMatch.map((heads) => {
                        return <td style={{ color: "black" }}>{heads}</td>
                      })
                      }

                      <td style={{ color: "black", backgroundColor: this.getColor(b.rating.toFixed(2)) }}>{b.rating.toFixed(2)}</td>

                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </td>



        </tr>

      );

    });
  };

  exportExcel(data) {
    let fd = new FormData();
    fd.append("transactionId", data.transactionId);
    fd.append("version", data.version);
    fetch("https://otobots.otomashen.com:6969/dedupe/downloadFile", {
      method: "POST",
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('user'),
      }),
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

  componentWillReceiveProps(newProps) {
    const { dedupeData, loadingBarProgress } = newProps;
    if (loadingBarProgress === 100) {
      this.setState({
        loadingBarProgress: 100
      });

      setTimeout(() => {
        this.setState({
          responseData: dedupeData,
          isLoading: true,
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
    this.setState({
      loadingBarProgress: 0,
      showFinal: true
    });
    //this.props.history.push('/dedupeTable');
  };

  versionExplorerChange(versiondata) {
    const { match: { params } } = this.props;
    this.props.history.replace('/dedupePrev/'+params.transactionId+'/'+versiondata)
    window.location.reload();
    }


  versionExplorer() {
    const { match: { params } } = this.props;
    return function (dispatch) {
      const fd = new FormData();
      fd.append('transactionId', params.transactionId)
      fd.append('version', params.version)
      fetch('https://otobots.otomashen.com:6969/dedupe/getTransactionState', {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'Bearer ' + localStorage.getItem('user'),
        }),
        body: fd
      }).then((response) => response.json())
        .then((response) => {
          this.setState({
            vailableVersions :
              response.message &&
              response.message.dedupeData
          })
         
        }
        )
    }
  }

  render() {
    const { match: { params } } = this.props;
    console.log("last response", this.props.versionData)
    return (

      <div className="container-fluid" style={{

        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        overflow: "hidden"

      }}>

        <div>
          <LoadingBar
            progress={this.state.loadingBarProgress}
            height={7}
            color="red"
            onLoaderFinished={() => this.onLoaderFinished()}
          />

          {this.state.showFinal ?
            <Table style={{ marginTop: "6px" }} className="ui inverted blue table"  >
              <thead className="sticky">
                <tr>
                  {/*  <th>ID</th> */}
                  <th className="col-md-12">Data With Matches</th>

                </tr>
              </thead>
              <tbody>{this.getRowsData()}</tbody>
            </Table>
            : null}
          <div style={{
            position: "fixed",
            left: "50%",
            top: "95%",
            transform: "translate(-50%, -90%)"

          }} className="ui inverted compact menu sticky">

{/* 
<div className="ui compact menu inverted">
  <div className="ui  simple dropdown item">
    Dropdown
    <i className="dropdown  upward icon"></i>
    <div className="menu">
      <div className="item">Choice 1</div>
      <div className="item">Choice 2</div>
      <div className="item">Choice 3</div>
    </div>
  </div>
</div> */}
<div className="item ">
<i className="info icon"></i>
 <Dropdown  text={'Version: '+ params.version}>
 
    <Dropdown.Menu>
    {this.props.versionData ? this.props.versionData.map((each) => {
      return (
        <Dropdown.Item onClick = {() => this.versionExplorerChange(each['version'])} text = {each['version']} />
      )
    }) : null}
    
      
    </Dropdown.Menu>
  </Dropdown>
  </div>

            <a className="item" onClick={() =>
              this.exportExcel(this.props.initialTransaction)
            }>
              <i className="download icon"></i>
              Export
  </a>
          </div>

        </div>

      </div>

    );
  }
}

function mapStateToProps(state) {
  return {
    versionData: state.DedupeReducer.versionData,
    showDedupe: state.DedupeReducer.showDedupe,
    inputResponse: state.DedupeReducer.inputResponse,
    loadingBarProgress: state.DedupeReducer.percentage,
    initialTransaction: state.DedupeReducer.initialTransaction,
    currentVersion: state.DedupeReducer.currentVersion,
    dedupeData: state.DedupeReducer.dedupeData

  };
}

function mapDispatchToProps(dispatch) {
  return {

    DedupeActions: bindActionCreators(DedupeActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultTablePrev);
