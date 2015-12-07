import React from 'react';
import { connect } from 'react-redux';
import {createPlaylist, getTokenAndPlaylistAndTopTracks, isSuccess} from '../actions';
import { Button, Modal, Input, Table, Alert } from 'react-bootstrap';

class CreatePlaylist extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      successModal: false,
      failureModal: false,
      playlistName: '',
      NotFollowingDWAlert: false
    }
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getTokenAndPlaylistAndTopTracks());
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.success === true) {
      this.setState({successModal: true});
    }
    if(nextProps.auth.success === false) {
      this.setState({failureModal: true});
    }
    if(nextProps.auth.isFollowingDW === false) {
      this.setState({NotFollowingDWAlert: true});
    }
  }
  handleSubmit(event) {
    event.preventDefault();
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    const username = this.props.auth.username;
    const playlistName = this.state.playlistName.trim();
    const tracks = this.props.auth.topTracks.map(track => {
      return track.uri;
    })
    dispatch(createPlaylist(tracks, playlistName, username, token));
  }
  handleChange(event) {
    this.setState({playlistName: event.target.value});
  }
  closeSuccessModal() {
    const {dispatch} = this.props;
    this.setState({successModal: false});
    dispatch(isSuccess());
  }
  closeFailureModal() {
    this.setState({failureModal: false});

  }
  render() {
    const {success, topTracks, username, newPlaylistID, isFollowingDW, screenWidth, accessToken} = this.props.auth;
    const playlistName = this.state.playlistName.trim();
    const playlistLink = `https://play.spotify.com/user/${username}/playlist/${newPlaylistID}`
    const SuccessModal = (
      <Modal key={1} show={this.state.successModal} onHide={this.closeSuccessModal.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title><p style={{fontSize: '2.5em'}}>Success!</p></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{fontSize: '1.4em'}}>
          Your new playlist {'"' + playlistName + '"'} has been saved!
          </p>
          <p>
          <span style={{marginRight: '0.2em', fontSize: '1.4em'}}>
          Open your spotify playlists or</span>
          <a href={playlistLink} ><Button style={{fontSize: '1.4em'}} bsStyle='success'><i style={{marginRight: '0.5em'}} className="fa fa-spotify"></i>Play Online!</Button></a>
          </p>
          </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='default' onClick={this.closeSuccessModal.bind(this)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
    const FailureModal = (
      <Modal key={2} show={this.state.failureModal} onHide={this.closeFailureModal.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Oops. Something went wrong</Modal.Title>
        </Modal.Header>
          <div style={{fontSize: '2em'}} >
          Failure! You encountered an unexpected error, try again!
          </div>
      </Modal>
    );
    const NotFollowingDWAlert = (
      <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
        <h4>Oh snap! You got an error!</h4>
        <p>This app only works if you follow the Discover Weekly playlist. Go to your spotify account and follow the Discover Weekly playlist and try again.</p>
        <p>
          <a href="/"><Button onClick={this.handleAlertDismiss}> Okay</Button></a>
        </p>
      </Alert>
    );
    const PlaylistTable = (
      <Table style={{marginTop: '1em', marginBottom: '1em'}} striped bordered condensed hover>
        <thead>
          <tr>
            <th>Song Name</th>
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
          {topTracks.map(track =>
            <tr key={track.id}>
              <td key={track.name}>
                {track.name}
              </td>
              <td key={track.artists[0].name}>
                {track.artists[0].name}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
    const InputAndSubmitButtonStyle = screenWidth < 538 ? {
      display: 'flex',
      justifyContent: 'flexStart',
      flexDirection: 'column'
    } : {
      display: 'flex',
      justifyContent: 'flexStart',
    }
    if (!accessToken) {
      return (
        <div>

        </div>
      )
    }
    if (isFollowingDW === false) {
      return (
        <div>
        {NotFollowingDWAlert}
        </div>
      )
    }
    return (
      <div>
        <div style={{fontSize: '1em'}}>
          <p>1. Name your playlist</p>
          <p>2. Save the playlist</p>
          <p>3. Listen to your new playlist!</p>
        </div>
        <div style={InputAndSubmitButtonStyle}>
          <form onSubmit={this.handleSubmit.bind(this)} >
            <Input style={{height: '2.2em', fontSize: '1.4em'}}
            type="text"
            name="playlistName"
            autoFocus="true"
            placeholder="New playlist name"
            value={this.state.playlistName}
            onChange={this.handleChange.bind(this)}
            />
          </form>
          <Button style={{height: '2.2em', fontSize: '1.4em'}} bsStyle='success' bsSize='large' onClick={this.handleSubmit.bind(this)}>Save Playlist</Button>
        </div>
        <div style={{marginTop: '1em', fontSize: '1em'}}>
          The following songs will be on your new playlist:
        </div>
        {PlaylistTable}
        {success === true && SuccessModal}
        {success === false && FailureModal}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(CreatePlaylist)
