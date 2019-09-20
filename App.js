import React, { Component } from "react";
// import axios, { post } from 'axios';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
// import InputGroup from 'react-bootstrap/InputGroup'
// import FormControl from 'react-bootstrap/FormControl'
import ResultTable from "../src/components/ResultTable";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      displayTable: false,
      responseData: null,
      fileName: "Choose File"
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file);
    this.setState({ fileName: "Choose File" });
  }
  onChange(e) {
    this.setState({
      file: e.target.files[0],
      fileName: e.target.files[0].name
    });
  }
  fileUpload(file) {
    // const url = 'https://40.117.95.236:6969/dedupe';
    // const formData = new FormData();/
    let form = new FormData();
    form.append("upload_file", file);

    fetch("https://40.117.95.236:6969/dedupe", {
      method: "POST",
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

  render() {
    console.log("return data", this.state.responseData);
    return (
      <div className="container-fluid">
        <div className="row justify-content-md-center">
          <Card
            style={{ width: "30rem", align: "center" }}
            className="bg-dark text-white mt-4"
          >
            <Card.Header as="h3">Dedupe Api Caller</Card.Header>

            <div className="input-group">
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
                  {this.state.fileName}{" "}
                </label>
              </div>
              &nbsp; &nbsp; &nbsp;
            </div>
            <br />
          </Card>
        </div>
        <div className="mt-4">
          {this.state.displayTable ? (
            <ResultTable data={this.state.responseData} />
          ) : null}
        </div>
      </div>
    );
  }
}
export default App;
