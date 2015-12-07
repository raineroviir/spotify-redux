import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';

class WelcomePage extends React.Component {
  render() {
    const {screenWidth} = this.props.auth;
    const mobileStyle = {display: 'flex', alignItems: 'center', flexDirection: 'column'}
    return (
      <container style={mobileStyle}>
        <p style={{fontSize: '2.5em'}}>Welcome to spotify3x!</p>
        <p style={{fontSize: '1.5em'}}>spotify3x is a music discovery tool for Spotify users. This app creates a new playlist based on each of your 'Discover Weekly' Spotify playlist artists' top 3 songs.
        </p>
        <a href="/auth/spotify">
          <Button bsSize="large" bsStyle="success" ><i style={{fontSize: '2em', marginRight: '0.5em'}} className="fa fa-spotify"></i>
            <span style={{fontSize: '1.85em'}}>Get Your Playlist!</span>
          </Button>
        </a>
      </container>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(WelcomePage)
