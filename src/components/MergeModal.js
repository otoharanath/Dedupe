import React from 'react';
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
        selectedMatches : {},
        timestamp : Date.now(),
        //checkNumber:0
      },
      sendData: {},
      sendId: {}
    };
    this.onSave = this.onSave.bind(this);
  }

  closePopUp = () => {
    this.setState({
      inProgress: false
    })
    this.props.DedupeActions.setShowModal(false);
    this.forceUpdate();
  };

  selectedValue = (id, value, key, index, isInput = false) => {
    const { finalData, sendData, sendId } = this.state;
    //const { sendData } = this.state;
    
    finalData[key]['value'] = value;
    finalData[key]['isInput'] = isInput;
    finalData[key]['index'] = index;
    finalData[key]['id'] = id;
    sendData[key] = value;
    sendId[key] = id;

    const inValidFields = Object.keys(finalData).filter(
      key => !finalData[key].value
    );
    this.setState({
      finalData,   
      isValid: !(inValidFields && inValidFields.length)
    });

    //sendData[key][]
  };

  getHeader(column){
    const columnArray = column.split('_');
    const columnName = columnArray.map((columnText) => {
      return columnText[0].toUpperCase() + columnText.substr(1, columnText.length)
    })
    return columnName.join(" ");
  }

  createRows() {
    const { rows } = this.props;
    const rowsData = rows.rows;
    let copy = rows.rows &&  rows.rows[0]
    //copy && console.log("rowsDta",copy[0])
    const columns =
      rowsData && rowsData.length && Object.keys(rowsData[0].data);
    const nonDedupe = columns && columns.filter((each) => !this.props.dedupeColumns.includes(each))
   
    const { finalData,sendData } = this.state;
    
    return (
      columns &&
      columns.length &&
      columns.map((key, index) => {
        let bgcol= nonDedupe.includes(key) ? "color-nonDedupe" : null
        
        finalData[key] = finalData[key] || {
          value: '',
          isInput: false,
          index: -1
        };
        sendData[key] = sendData[key] || {
          value: ''
        }
       
        return (
          <tr key={index} >
            <th className = {bgcol ? bgcol : ''}
            style={{ backgroundColor: 'black'}}>{this.getHeader(columns[index])}</th>
               {rowsData.map((row, idx) => {
               let perfectMatch = false
               let isMain = false
               if(row['data'][key] === copy['data'][key])
               perfectMatch = true
               if(row['index'] === -1)
               isMain =true

              let finalBorder = false
              
              if(perfectMatch && !isMain && !bgcol=='')
              finalBorder = true
       
              return (
                <td style={{ cursor: 'pointer', border: finalBorder ? '3px solid green' :null}}
                  className={
                    (!finalData[key].isInput &&
                      finalData[key].index === idx &&
                      'color-green') || (bgcol ? bgcol : '')  
                  }
                  onClick={e => {
                    this.selectedValue(row['id'],row['data'][key], key, idx);
                  }}
                  key={idx}
                >
                  {row['data'][key]}
                </td>
             
              );
            })}
            <td style={{ cursor: 'pointer' }}
              className={
                (finalData[key].isInput &&
                  finalData[key].index === -1 &&
                  'color-green') || (bgcol ? bgcol : '')
               
              }
            >
              <input className = "modal-input"
                onChange={({ target: { value } }) =>
                  this.selectedValue(null, value, key, -1, true)
                }
              />
            </td>
          </tr>
         
        );
      })
     
    );
  }

  onSave = () => {
    const { sendData,sendId } = this.state;

      sendId && Object.keys(sendId).map((each) => {
        if(sendId[each] === null)
        sendId[each] = "custom"  
    })
   
      let stringified = JSON.stringify(sendData)
      let stringifiedIds = JSON.stringify(sendId)
      /* this.setState({
        actionData : {
          primaryId : this.props.rows && this.props.rows.rows && this.props.rows.rows[0] && this.props.rows.rows[0].id,
          matchedIds : this.props.rows && this.props.rows.rows && this.props.rows.rows.slice(1).map((ids) => ids.id),
          function : 'merge',
          finalRecord : stringified,
          finalRecordIds : stringifiedIds,
          timestamp : Date.now()
        }
      }) */
        this.state.actionData.primaryId = this.props.rows && this.props.rows.rows && this.props.rows.rows[0] && this.props.rows.rows[0].id
        this.state.actionData.matchedIds = this.props.rows && this.props.rows.rows && this.props.rows.rows.slice(1).map((ids) => ids.id)
        this.state.actionData.function = 'merge'
        this.state.actionData.finalRecord = stringified
        this.state.actionData.selectedMatches = stringifiedIds
        this.state.actionData.timestamp = Date.now()
    
  let finalSend = JSON.stringify(this.state.actionData)
    let tid = this.props.initialTransaction

    //console.log("before",finalSend)
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
//console.log("dedupe colummns", this.props.dedupeColumns)
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
              <tbody>
                <tr>
                  <td style={{ backgroundColor: 'black' }}>Fields</td>
                  <td style={{ backgroundColor: 'black' }}>Original Record</td>
                  <td colSpan = {this.props.rows && this.props.rows.rows && this.props.rows.rows.length -1} style={{ backgroundColor: 'black' }}>Matches</td>
                  <td style={{ backgroundColor: 'black' }}>Custom Input</td>
                </tr>
              {this.createRows()}
              </tbody>
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
    initialTransaction:state.DedupeReducer.initialTransaction,
    dedupeColumns:state.DedupeReducer.dedupeColumns
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
