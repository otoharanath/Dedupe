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
      titles: ['First Name', 'Last Name', 'Company'],
      isValid: false,
      finalData: {
        first_name: {
          value: '',
          isInput: false,
          index: -1
        },
        last_name: {
          value: '',
          isInput: false,
          index: -1
        },
        company_name: {
          value: '',
          isInput: false,
          index: -1
        }
      }
    };
  }

  closePopUp = () => {
    this.props.DedupeActions.setShowModal(false);
  };

  selectedValue = (value, key, index, isInput = false) => {
    const { finalData } = this.state;
    finalData[key]['value'] = value;
    finalData[key]['isInput'] = isInput;
    finalData[key]['index'] = index;
    const inValidFields = Object.keys(finalData).filter(
      key => !finalData[key].value
    );
    this.setState({
      finalData,
      isValid: !(inValidFields && inValidFields.length)
    });
  };

  createRows() {
    const { rows } = this.props;
    const { titles } = this.state;
    const rowsData = rows.rows;
    const colomns =
      rowsData && rowsData.length && Object.keys(rowsData[0].data);
    const { finalData } = this.state;
    return (
      colomns &&
      colomns.length &&
      colomns.map((key, index) => {
        return (
          <tr key={index}>
            <th>{titles[index]}</th>
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
      markDisabledAllMergeButtons()
      this.setState({
        finalData: {
          first_name: {
            value: '',
            isInput: false,
            index: -1
          },
          last_name: {
            value: '',
            isInput: false,
            index: -1
          },
          company_name: {
            value: '',
            isInput: false,
            index: -1
          }
        },
        isValid: false
      });
      this.closePopUp();
      this.forceUpdate();
    }
  };

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
            centered
              variant="success"
              onClick={() => {
                this.onSave();
              }}
            >
              Save
            </Button>
            <Button
            centered
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
    rows: state.DedupeReducer.rows
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
