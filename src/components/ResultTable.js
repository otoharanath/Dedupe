import Button from 'react-bootstrap/Button';
import DedupeActions from '../actions/DedupeActions';
import MergeModal from './MergeModal';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Navbar from "react-bootstrap/Navbar";
import Draggable from 'react-draggable';
//import Navbar from "react-bootstrap/Navbar";
//import { Nav, Form, FormControl, NavItem } from 'react-bootstrap';
//import { isUserWhitespacable } from '@babel/types';
//import Checkbox from 'react-simple-checkbox';



const bg = require("./bg.jpg");


class ResultTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchData: '',
      userData: '',
      matchFound: 0,
      isChecked: false,
      selectedRows: [],
      background: bg,
      checkLength: 0,
      searchTerm: null
    };
    this.getRowsData = this.getRowsData.bind(this);
    this.undoAction = this.undoAction.bind(this);
    this.redoAction = this.redoAction.bind(this);
    this.exportExcel = this.exportExcel.bind(this);
    //this.handleSearch  = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.markDisabledAllMergeButtons();
    this.props.DedupeActions.globalResponse(this.props.data);

  }

  markDisabledAllMergeButtons = () => {
    [...document.getElementsByTagName('Button')].map(e => {
      e.disabled = true;
    });

    var items = document.getElementsByName('checkbox');
    for (var i = 0; i < items.length; i++) {
      this.setState({
        checkLength: items.length
      })
      if (items[i].type == 'checkbox')
        items[i].checked = false;
    }
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
        <input
          type="checkbox"
          name='checkbox'
          className="checkmark"
          className={'row-cb checkbox-' + row + ' matched-' + matchedData.index}
          value={matchedData.index}
          defaultChecked={this.state.isChecked}
          onChange={e => this.toggleCheckboxChange(e, row, rowData)}
        />{' '}
        &nbsp; &nbsp;
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

  showMerge = row => {
    const { dedupeData, afterMerge } = this.props;
    const checkboxes = document.getElementsByClassName('checkbox-' + row.id);
    const checkedIds = [...checkboxes]
      .filter(checkbox => checkbox.checked)
      .map(checkbox => +checkbox.className.split('matched-')[1]);
    const unCheckedIds = [...checkboxes]
      .filter(checkbox => !checkbox.checked)
      .map(checkbox => +checkbox.className.split('matched-')[1]);

    let rows = row.matches.map(match => {
      let b = JSON.parse(match);
      const index = dedupeData.findIndex(item => item.id === b.index);
      try {
        return {
          data: JSON.parse(dedupeData[index] && dedupeData[index].data || '{}'),
          id: dedupeData[index].id,
          index
        };
      } catch (e) {
        return null;
      }
    }).map((match) => match);
    const selectedRows = rows.filter(row => {
      return row && checkedIds.indexOf(row.id) !== -1;
    });

    let actualData = JSON.parse(row.data);
    rows = [
      {
        data: actualData,
        id: row.id,
        index: -1
      },
      ...selectedRows
    ];

    this.props.DedupeActions.setSelectedRowsData({
      rows,
      afterMerge,
      unCheckedIds,
      markDisabledAllMergeButtons: this.markDisabledAllMergeButtons
    });
    this.props.DedupeActions.setShowModal(true);
    this.forceUpdate();
  };

  toProperCase = function (txt) {
    return txt.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };

  getRowsData = () => {
    const items = this.props.dedupeData;
    const buttonstyle = { paddingTop: '5%' };
    /* let fil =[]
    if(!(this.state.searchTerm === null)){
      
    
    fil = items.filter((item) => {
    let x = JSON.parse(item.data)
    let searchTerm = this.state.searchTerm
    console.log("inside yo",x)
     return (
      (x && x['first_name'].includes(searchTerm.toLowerCase())) || (x && x['first_name'].includes(searchTerm.toUpperCase())) || (x && x['first_name'].includes(searchTerm))
      ||  (x && x['first_name'].includes(this.toProperCase(searchTerm)))
   )
     }
   )
    }
   let final = fil.length === 0 ? items : fil
   console.log("yoyoyoy",fil) */
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
                  <th style={{ color: "black" }}><strong style={{ color: "black" }}>Select</strong></th>
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
                      <td>
                        {this.action(row.id, b, parsed)}
                        &nbsp;
          </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </td>


          <td style={buttonstyle}>
            {
              row.matches && row.matches.length &&
              <Button
                id={'row' + row.id}
                onClick={() => {
                  this.showMerge(row);
                }}
                variant="success"
              >
                Merge Record
                </Button> || ''
            }
          </td>
        </tr>

      );

    });
  };
  /* handleSearch(event){
    this.setState({
    searchTerm: event.target.value
    }) 
  }
  searchCl(){
    this.forceUpdate();
  } */

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

  render() {
    console.log("last response",this.props.data)
    return (
       
      <div className="container-fluid"  style={{
        
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            overflow:"hidden"
           
           }}>
        {this.props.dedupeData ?
          <div>
<br/>
        <Table className="ui inverted blue table"  >
          <thead className="sticky">
            <tr>
              {/*  <th>ID</th> */}
              <th className="col-md-10">Data With Matches</th>
              <th className="col-md-2">Actions</th>
            </tr>
          </thead>
          <tbody>{this.getRowsData()}</tbody>
        </Table>
        
        {/* <Navbar
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
<div className = "button"
              variant="success"
              

              size="sm"
              style={{ color: "#FFF" }}

              onClick={() =>
                this.exportExcel(this.props.initialTransaction)
              }
            >
              <span className=" fa fa-download "></span>
              &nbsp;Export
</div>

          </Navbar.Collapse>
          <br />
        </Navbar> */}
        <div style={{
            position: "fixed",
            left: "50%",
            top: "95%",
            transform: "translate(-50%, -90%)"
            
          }} className="ui inverted compact menu sticky">
            {
    this.props.initialTransaction &&
      this.props.initialTransaction.version == 0 &&
      this.props.initialTransaction
      ?  null
      : <a 
      onClick={this.undoAction}
      className="item">
        <i className="undo icon"></i>
        Undo
      </a>
  } 
 {
                (this.props.initialTransaction &&
                  this.props.initialTransaction.version) <
                  (this.props.currentVersion &&
                    this.props.currentVersion.version)
                  ? <a className="item"  onClick={this.redoAction}>
                  <i className="redo icon"></i>
                  Redo
                </a>
                  : null
              }
  
  <a className="item"  onClick={() =>
                this.exportExcel(this.props.initialTransaction)
              }>
    <i className="download icon"></i>
    Export
  </a>
</div>
        
        <MergeModal />
        </div>
        : this.props.history.push('/')}
      </div>
      
    );
  }
}

function mapStateToProps(state) {
  return {
    showDedupe: state.DedupeReducer.showDedupe,
    inputResponse: state.DedupeReducer.inputResponse,
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
)(ResultTable);
