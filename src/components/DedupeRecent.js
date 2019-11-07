import DedupeActions from "../actions/DedupeActions";
import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';



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

  tranClick(tran) {
    this.props.history.push('/dedupePrev/'+tran+'/0');
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
        <Table style={{ marginTop: "4px" }} celled className="ui white  inverted table">
          <Table.Header >
            <Table.Row>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='4'>Date & Time</Table.HeaderCell>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='4'>File Name</Table.HeaderCell>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='2'>Number of Records</Table.HeaderCell>
              <Table.HeaderCell style={{ position: "sticky" }} colSpan='2'>Completed</Table.HeaderCell>

            </Table.Row>
          </Table.Header>
          <Table.Body>

            {this.props.recentTransactions && this.props.recentTransactions.message && this.props.recentTransactions.message.map((each) => {
             let t = new Date(Number(each.timestamp))
             console.log("dat",t)
             return (
                <Table.Row>
                  <Table.Cell colSpan='4'>
                    <div onClick = {() => this.tranClick(each.transactionId)} style={{ cursor: 'pointer' }}>
                    {moment(t).format('LLL')}
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
