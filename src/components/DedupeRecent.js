import DedupeActions from "../actions/DedupeActions";
import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const bg = require("./bg3.jpg");


class DedupeRecent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    this.props.DedupeActions.dedupeRecentTransactions();
  }

  goToResult(dat) {
    console.log("dat",dat)
  }

  render() {
    console.log("recentTransactions",this.props.recentTransactions)
    return (
      <div className="container-fluid " style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        overFlowY: "hidden"
      }}>
       
<br/>
        <Table celled className="ui white  inverted table">
          <Table.Header >
            <Table.Row>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='4'>Transaction ID</Table.HeaderCell>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='4'>File Name</Table.HeaderCell>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='2'>Number of Records</Table.HeaderCell>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='2'>Completed</Table.HeaderCell>

            </Table.Row>
          </Table.Header>
          <Table.Body>

            {this.props.recentTransactions && this.props.recentTransactions.message && this.props.recentTransactions.message.map((each) => {
              return (
                <Table.Row>
                  <Table.Cell colSpan='4'>
                    <div style={{ cursor: 'pointer' }}>
                      {each.transactionId}
                    </div>
                  </Table.Cell>
                  <Table.Cell colSpan='4'>{each.fileName}</Table.Cell>
                  <Table.Cell colSpan='2'>{each.numberOfRecords}</Table.Cell>
                  <Table.Cell colSpan='2'>{each.completed ? "Yes" : "No"}</Table.Cell>
                </Table.Row>
              )
            })}

          </Table.Body>
        </Table>
      </div>



    );
  }
}

function mapStateToProps(state) {
  return {
    recentTransactions: state.DedupeReducer.recentTransactions

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
)(DedupeRecent);
