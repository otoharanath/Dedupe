import Button from 'react-bootstrap/Button';
import DedupeActions from '../actions/DedupeActions';
import MergeModal from './MergeModal';
import React from 'react';
import Table from 'react-bootstrap/Table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isUserWhitespacable } from '@babel/types';
const bg = require("./bg.jpg");
const divStyle = {
  width: "100%",
  height: "100%",
  backgroundSize: "cover",
  backgroundRepeat: "repeat"
};
class ResultTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchData: '',
      userData: '',
      matchFound: 0,
      isChecked: false,
      selectedRows: [],
      background:bg
    };
    this.getRowsData = this.getRowsData.bind(this);
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
      if (items[i].type == 'checkbox')
        items[i].checked = false;
    }
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
          <td>{b.index}</td>
          {dynamicMatch.map((heads) => {
            return <td>{heads}</td>
          })
          }
          {/*  <td>{parsed.first_name}</td>
          <td>{parsed.last_name}</td>
          <td>{parsed.company_name}</td> */}
          <td>{b.rating.toFixed(2)}</td>
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
    return txt.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

  getRowsData = () => {
    const items = this.props.data;
    const buttonstyle = { paddingTop: '5%' };
    return items.map((row, index) => {
      const user = JSON.parse(row.data);
      let yoyo = [];
      yoyo = Object.keys(user);
      let tabData = Object.values(user);
      return (
        <tr key={index}>
          <td>{row.id}</td>
          <td>
            <Table striped bordered variant="dark">
              <thead>

                <tr>
                  {
                    yoyo.map((heads) => {
                      return <th>{this.toProperCase(heads.replace("_"," "))}</th>
                    })
                  }
                  {/*  <th>First Name</th>
                  <th>Last Name</th>
                 <th>Company</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {
                    tabData.map((heads) => {
                      return <td>{heads}</td>
                    })
                  }
                  {/* <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.company_name}</td> */}
                </tr>
              </tbody>
            </Table>
          </td>

          <td>
            {(row.matches && row.matches.length && (
              <Table striped bordered responsive style = {{color:"white"}} >
                <thead>
                  <tr>
                    <th>Matched</th>
                    {
                    yoyo.map((heads) => {
                      return <th>{this.toProperCase(heads.replace("_"," "))}</th>
                    })
                  }
                    {/* <th>First Name</th>
                    <th>Last Name</th>
                    <th>Company</th> */}
                    <th>Rating</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>{this.createRow(row)}</tbody>
              </Table>
            )) || <strong>No Matches Found</strong>}
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

  render() {
    return (
      <div
      className="cComponent"
      style={divStyle}
      style={{ backgroundImage: `url(${this.state.background})`,
      width: "100%",
      height: "100%",
      backgroundSize: "cover",
      backgroundRepeat: "repeat-y" }}
    >
      
        <Table striped bordered responsive variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data</th>
              <th>Matches</th>
              <th>Actions</th>
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
