import React, { Component } from 'react';

import Navbar from 'react-bootstrap/Navbar';
import ResultTable from '../src/components/ResultTable';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      displayTable: false,
      responseData: null,
      fileName: 'Choose File'
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault();
    this.fileUpload(this.state.file);
    this.setState({ fileName: 'Choose File' });
  }
  onChange(e) {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name
    });
  }
  fileUpload(file) {
    let form = new FormData();
    form.append('upload_file', file);

    fetch('https://otobots.otomashen.com:6969/dedupe/', {
      method: 'POST',
      body: form
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          displayTable: true,
          responseData: data
        });
      });
  }

  afterMerge = params => {
    const { responseData } = this.state;
    const { finalData, rows, unCheckedIds } = params;
    const parentId = rows[0].id;
    const mergedData = responseData
      .map(item => {

        // remove the row if it matchs with the main merge row.
        let matches = item.matches.map(match => JSON.parse(match));
        const index = matches.findIndex(match => match.index === parentId);

        if (index !== -1 && !(unCheckedIds && unCheckedIds.length)) {
          return false;
        } else if (index !== -1 && unCheckedIds.indexOf(item.id) === -1) {
          return false;
        }

        // update the main row data after merging the selection.
        if (item.id === parentId) {
          item.data = JSON.stringify({
            company_name: finalData.company_name.value,
            first_name: finalData.first_name.value,
            last_name: finalData.last_name.value
          });
        }

        // remove matches if all checkboxes are checked.
        if (item.id === parentId && !(unCheckedIds && unCheckedIds.length)) {
          item.matches = [];
        } else if (item.id === parentId) {
          const filteredMatches = matches
            .filter(match => unCheckedIds.indexOf(match.index) !== -1)
            .map(match => {
              return JSON.stringify(match);
            });

          // remove matches of all checked checkboxes.
          item.matches = filteredMatches;
        }
        return item;
      })
      .filter(item => item);

    this.setState({
      responseData: mergedData
    });
  };

  render() {
    console.log("response",this.state.responseData)
    return (
      <div className="container-fluid">
        <Navbar bg="dark" variant="dark" sticky="top" expand="lg">
          <Navbar.Brand href="#home">Dedupe Api Caller</Navbar.Brand>
          <div className="input-group ">
            <div className="input-group-prepend">
              &nbsp; &nbsp; &nbsp;
              <br />
              <span
                onClick={this.onFormSubmit}
                className="input-group-text"
                id="inputGroupFileAddon01"
              >
                Upload
              </span>
            </div>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile01"
                onChange={this.onChange}
                aria-describedby="inputGroupFileAddon01"
              />
              <label className="custom-file-label" htmlFor="inputGroupFile01">
                {this.state.fileName}{' '}
              </label>
            </div>
            &nbsp; &nbsp; &nbsp;
          </div>
        </Navbar>
        <div className="row justify-content-md-center"></div>
        <div >
          {this.state.displayTable ? (
            <ResultTable
              data={this.state.responseData}
              afterMerge={params => {
                this.afterMerge(params);
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
export default App;
