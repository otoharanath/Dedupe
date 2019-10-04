import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import DedupeActions from '../actions/DedupeActions';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class MergeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      finalData: {},
      inProgress: false,
      actionData : {
        primaryId : null,
        matchedIds : [],
        function : 'merge',
        finalRecord : {},
        timestamp : Date.now()
      },
      sendData: {}
    };
  }

  closePopUp = () => {
    this.setState({
      inProgress: false
    })
    this.props.DedupeActions.setShowModal(false);
  };

  selectedValue = (value, key, index, isInput = false) => {
    const { finalData, sendData } = this.state;
    //const { sendData } = this.state;
    finalData[key]['value'] = value;
    finalData[key]['isInput'] = isInput;
    finalData[key]['index'] = index;
    sendData[key] = value;

    const inValidFields = Object.keys(finalData).filter(
      key => !finalData[key].value
    );
    this.setState({
      finalData,   
      isValid: !(inValidFields && inValidFields.length)
    });

    //sendData[key][]
  };

  getHeader(colomn){
    const colomnArray = colomn.split('_');
    const colomnName = colomnArray.map((colomnText) => {
      return colomnText[0].toUpperCase() + colomnText.substr(1, colomnText.length)
    })
    return colomnName.join(" ");
  }

  createRows() {
    const { rows } = this.props;
    const rowsData = rows.rows;
    const colomns =
      rowsData && rowsData.length && Object.keys(rowsData[0].data);
    const { finalData,sendData } = this.state;

    return (
      colomns &&
      colomns.length &&
      colomns.map((key, index) => {
        finalData[key] = finalData[key] || {
          value: '',
          isInput: false,
          index: -1
        };
        sendData[key] = sendData[key] || {
          value: ''
        }
          
        return (
          <tr key={index}>
            <th>{this.getHeader(colomns[index])}</th>
            {rowsData.map((row, idx) => {
              return (
                <td
                  className={
                    (!finalData[key].isInput &&
                      finalData[key].index === idx &&
                      'color-green') ||
                    ''
                  }
                  onClick={e => {
                    this.selectedValue(row['data'][key], key, idx);
                  }}
                  key={idx}
                >
                  {row['data'][key]}
                </td>
              );
            })}
            <td
              className={
                (finalData[key].isInput &&
                  finalData[key].index === -1 &&
                  'color-green') ||
                ''
              }
            >
              <input className = "modal-input"
                onChange={({ target: { value } }) =>
                  this.selectedValue(value, key, -1, true)
                }
              />
            </td>
          </tr>
        );
      })
    );
  }

  onSave = () => {
    const { finalData,sendData, isValid } = this.state;

  /*   this.setState({
      inProgress: true
    })
    const { finalData, isValid } = this.state;
    const {
      rows: { afterMerge, markDisabledAllMergeButtons }
    } = this.props;

    if (isValid) {
      afterMerge({
        finalData,
        rows: this.props.rows.rows,
        unCheckedIds: this.props.rows.unCheckedIds
      });
      markDisabledAllMergeButtons() */
      let stringified = JSON.stringify(sendData)
      
        this.state.actionData.primaryId = this.props.rows && this.props.rows.rows && this.props.rows.rows[0] && this.props.rows.rows[0].id
        this.state.actionData.matchedIds = this.props.rows && this.props.rows.rows && this.props.rows.rows.slice(1).map((ids) => ids.id)
        this.state.actionData.function = 'merge'
        this.state.actionData.finalRecord = stringified
        this.state.actionData.timestamp = Date.now()
    
  let finalSend = JSON.stringify(this.state.actionData)
    let tid = this.props.initialTransaction

    console.log("before",finalSend)
    //console.log("after",JSON.stringify(JSON.stringify(sendData)))

   this.props.DedupeActions.updateTransaction(finalSend,tid)
      this.setState({
        finalData: {},
        isValid: false
      });
      this.closePopUp();
      this.forceUpdate();
    }
  

  render() {
    return (
      <div>
        <Modal 
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
        size="lg"

        show={this.props.showDedupe} onHide={console.log}>
          <Modal.Header closeButton onClick={() => this.closePopUp()}>
            <Modal.Title>Merge Records</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr></tr>
              </thead>
              <tbody>{this.createRows()}</tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={this.state.inProgress}
              centered={true}
              variant="success"
              onClick={() => {
                this.onSave();
              }}
            >
              Save
            </Button>
            <Button
              centered={true}
              variant="danger"
              onClick={() => {
                this.closePopUp();
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showDedupe: state.DedupeReducer.showDedupe,
    rows: state.DedupeReducer.rows,
    initialTransaction:state.DedupeReducer.initialTransaction
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
)(MergeModal);
