import React from 'react';
import Header from './Header';

class App extends React.Component {
  state = {
    pageHeader: '-Message-',
  };
  componentDidMount() {

  }
  componentWillUnmount() {
    // clean timers, listeners
  }
  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader} />
      </div>
    );
  }
}

export default App;
