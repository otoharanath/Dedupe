import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import MainContainer from './components/MainContainer';
library.add(faEnvelope, faKey);

class App extends Component {
  render() {
    return (
      <MainContainer></MainContainer>
    );
  }
}

export default App;

