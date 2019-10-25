import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import DedupeActions from '../actions/DedupeActions';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
//import { threadId } from 'worker_threads';
class OptionSelectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: [],
      colorOption: {}
    };
  }

  closePopUp = () => {
    this.props.DedupeActions.setShowSelectModal(false);
  };

  handleClick(item) {
    let found = this.state.selectedOptions.findIndex((each) => each == item);
    if (found < 0) {
      this.state.selectedOptions.push(item);
      // this.state.colorOption.item = 'color-green'
    }
    else {
      this.state.selectedOptions.splice(found, 1);
      //  this.state.colorOption.item = ''
    }
    this.forceUpdate();
  }
  toProperCase = function (txt) {
    return txt.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };

  onSave() {
    let form = new FormData();
    form.append('upload_file', this.props.file);
    form.append('threshold', this.props.threshold);
    form.append('selectedFields', this.state.selectedOptions.toString());
    this.props.DedupeActions.setShowSelectModal(false);
    this.props.DedupeActions.dedupeColumns(this.state.selectedOptions);
    this.props.DedupeActions.postTransaction(form)
    this.state.selectedOptions = []
  }
  render() {

    return (
      <div>
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{
            width: 'auto',
            height: 'auto',
            position: "fixed",
            left: "50%",
            top: "25%",
            transform: "translate(-50%, -50%)"
          }}

          show={this.props.showSelect} onHide={console.log}>
          <Modal.Header closeButton onClick={() => this.closePopUp()}>
            <Modal.Title>Select Dedupe Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div style={{ width: '100%' }}>
                      <Box display="flex" justifyContent="center" m={1} p={1} flexWrap="wrap">
                        {this.props.csvData.map((item) => {
                          return (
                            <Box style={{ cursor: 'pointer' }} bgcolor={this.state.selectedOptions.includes(item) ? "green" : "white"}
                              onClick={() => this.handleClick(item)} color={this.state.selectedOptions.includes(item) ? "white" : "black"} p={1} m={0.5} display='flex'
                              justifyContent='center'>{this.toProperCase(item.replace("_", " "))}</Box>)
                        })
                        }
                      </Box>
                    </div>

            {/* <div className="row" style={{ justifyContent: 'center', alignItems: 'center' }}>
              {this.props.csvData ? this.props.csvData.map((eachItem) => {
                return (
                  <div>
                    <div className="list-group-item" style={{ padding: '5px' }}>
                      <input type="checkbox" onChange={() => this.handleClick(eachItem)} />
                      <strong style={{ color: 'black' }}>{this.toProperCase(eachItem.replace("_", " "))} </strong>

                    </div>
                    &nbsp;  &nbsp;
                      </div>
                )
              }
              ) : null}
            </div> */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={this.state.selectedOptions.length === 0 ? true : false}
              centered={true}
              variant="success"
              onClick={() => {
                this.onSave();
              }}
            >
              Upload
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
    showSelect: state.DedupeReducer.showSelect
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
)(OptionSelectModal);
