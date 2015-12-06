import React from 'react';
import { connect } from 'react-redux';
import {createPlaylist, getTokenAndPlaylistAndTopTracks} from '../actions';
import { Button, Modal, Input, Table } from 'react-bootstrap';
class CreatePlaylist extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      PlaylistModal: false,
      playlistName: ''
    }
  }
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getTokenAndPlaylistAndTopTracks());
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
  render() {
    const savedPlaylists = this.props.auth.playlists;
    const topTracks = this.props.auth.topTracks;
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
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)} >
          <Input style={{height: '2em', fontSize: '2em'}}
          type="text"
          name="playlistName"
          autoFocus="true"
          placeholder="Enter the playlist name"
          value={this.state.playlistName}
          onChange={this.handleChange.bind(this)}
          />
        </form>
        {topTracks.length > 0 && <Button bsStyle='primary' bsSize='large' onClick={this.handleSubmit.bind(this)}>Save Playlist</Button>}
        {PlaylistTable}
        {topTracks.length > 50 && <div style={{display: 'flex', justifyContent: 'center'}}><Button bsStyle='success' bsSize='large' onClick={this.handleSubmit.bind(this)}>Save Playlist</Button></div>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(CreatePlaylist)
