import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import {initEnvironment} from '../actions';
import { Button } from 'react-bootstrap';

class App extends React.Component {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(initEnvironment());
  }
  render() {
    return (
      <div style={{margin: '1em 1em 2em 1em'}}>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(App)
