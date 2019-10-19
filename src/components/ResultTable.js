import Button from 'react-bootstrap/Button';
import DedupeActions from '../actions/DedupeActions';
import MergeModal from './MergeModal';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Navbar from "react-bootstrap/Navbar";
import { Nav, Form, FormControl, NavItem } from 'react-bootstrap';
import { isUserWhitespacable } from '@babel/types';
import Checkbox from 'react-simple-checkbox';



const bg = require("./bg.jpg");
const divStyle = {
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundRepeat: "repeat"
};

const ColoredLine = ({ color }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: 5
      }}
  />
);

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
      checkLength:0,
      searchTerm:null
    };
    this.getRowsData = this.getRowsData.bind(this);
    this.handleSearch  = this.handleSearch.bind(this);
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
        checkLength:items.length
      })
      if (items[i].type == 'checkbox')
        items[i].checked = false;
    }
  }

 getColor(value){
    //value from 0 to 1
    var hue=((value)*120).toString(10);
    return ["hsl(",hue,",90%,40%)"].join("");
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
          className = "checkmark"
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
    const { data, afterMerge } = this.props;
    const checkboxes = document.getElementsByClassName('checkbox-' + row.id);
    const checkedIds = [...checkboxes]
      .filter(checkbox => checkbox.checked)
      .map(checkbox => +checkbox.className.split('matched-')[1]);
    const unCheckedIds = [...checkboxes]
      .filter(checkbox => !checkbox.checked)
      .map(checkbox => +checkbox.className.split('matched-')[1]);

    let rows = row.matches.map(match => {
      let b = JSON.parse(match);
      const index = data.findIndex(item => item.id === b.index);
      try {
        return {
          data: JSON.parse(data[index] && data[index].data || '{}'),
          id: data[index].id,
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
    const items = this.props.data;
    const buttonstyle = { paddingTop: '5%' };
    let fil =[]
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
   console.log("yoyoyoy",fil)
    return final.map((row, index) => {
      const user = JSON.parse(row.data);
      let yoyo = [];
      yoyo = Object.keys(user);
      let tabData = Object.values(user);
    

      return (
       
        <tr key={index}>
          {/* <td>{row.id}</td> */}
          <td>
            <Table className = "ui  table"  >
              <thead>

                <tr>
                  <th  ><strong style={{color: "black" }}>ID</strong></th>
                  {
                    yoyo.map((heads) => {
                      return <th style={{color: "black" }}><strong style={{color: "black" }}>{this.toProperCase(heads.replace("_", " "))}</strong></th>
                    })
                  }
                  <th style={{color: "black" }} ><strong style={{color: "black" }}>Rating</strong></th>
                  <th style={{color: "black" }}><strong style={{color: "black" }}>Select</strong></th>
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
                  <td style={{justifyContent:"center"}}>---</td>
                  <td style={{justifyContent:"center"}}>---</td>


                </tr>
               {/*  {row.matches.length === 0 ? null :<ColoredLine color="red" />} */}
                {row.matches.sort((a,b) => (JSON.parse(b)).rating - (JSON.parse(a)).rating).map((match, index1) => {
                  
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
                    <tr style={{backgroundColor: this.getColor(b.rating.toFixed(2)) }} key={index1}>
                      <td style = {{color:"black"}}>{b.index}</td>
                      {dynamicMatch.map((heads) => {
                        return <td style = {{color:"black"}}>{heads}</td>
                      })
                      }

                      <td style = {{color:"black"}}>{b.rating.toFixed(2)}</td>
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
handleSearch(event){
  this.setState({
  searchTerm: event.target.value
  }) 
}
searchCl(){
  this.forceUpdate();
}
  render() {
    console.log("selected",this.state.checkLength)
    return (
      <div
        className="cComponent"
        style={divStyle}
        style={{
          backgroundImage: `url(${this.state.background})`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-y"
        }}
      >

        <Table className = "ui inverted blue table"  >
          <thead>
            <tr>
              {/*  <th>ID</th> */}
              <th className = "col-md-10">Data With Matches &nbsp;&nbsp;&nbsp;
              <strong>First Name</strong>&nbsp;<input type="text" name="searchTerm" value = {this.state.searchTerm || ""} onChange = {this.handleSearch}/>&nbsp;&nbsp;&nbsp;
              <strong>Last Name</strong>&nbsp;<input type="text" name="searchTerm" value = {this.state.searchTerm || ""} onChange = {this.handleSearch}/>&nbsp;&nbsp;&nbsp;
              <strong>Company Name</strong>&nbsp;<input type="text" name="searchTerm" value = {this.state.searchTerm || ""} onChange = {this.handleSearch}/></th>
              {/*  <th>Matches</th> */}
              <th className = "col-md-2">Actions</th>
            </tr>
          </thead>
          <tbody>{this.getRowsData()}</tbody>
        </Table>
        <MergeModal />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showDedupe: state.DedupeReducer.showDedupe,
    inputResponse: state.DedupeReducer.inputResponse

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
