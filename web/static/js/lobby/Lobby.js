import {Socket} from "../../../../deps/phoenix/web/static/js/phoenix";
import React from "react";
import {Link} from "react-router";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const RoomTooltip = React.createClass({
  render() {
    if (this.props.players.length) {
      return (
        <ul className="list-unstyled" style={{textAlign: "left"}}>
          {this.props.players.map(player => {
            return (
              <li key={player.name}>
                <i className="glyphicon glyphicon-user"></i> {player.name}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <span>Empty</span>;
    }
  }
});

const RoomNode = React.createClass({
  render() {
    return (
      <li>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id={this.props.id}><RoomTooltip {...this.props} /></Tooltip>}>
          <Link to={`/rooms/${this.props.id}`}
                className="btn btn-primary btn-large btn-block"
                style={{marginTop: 10}}>
            <h4>{this.props.name}</h4>
            <i className="glyphicon glyphicon-user" /> {this.props.players.length}
          </Link>
        </OverlayTrigger>
      </li>
    );
  }
});

const RoomList = React.createClass({
  render() {
    return (
      <ul className="list-unstyled">
        {this.props.rooms.map(room => {
          return (
            <RoomNode key={room.id} {...room} />
          );
        })}
      </ul>
    );
  }
});

const Lobby = React.createClass({
  getInitialState() {
    return {
      rooms: []
    };
  },

  componentDidMount() {
    let socket = new Socket("/socket");
    socket.connect();
    let channel = socket.channel("lobby");
    channel.join()
      .receive("ok", response => {
        this.setState(response);
      });

    channel.on("room:updated", payload => {
      this.setState({
        rooms: this.state.rooms
        .filter(r => r.id !== payload.room.id)
        .concat(payload.room)
      });
    });

    this.socket = socket;
  },

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1>pinpointr</h1>
          <h4>Join a room to play!</h4>

          <hr />

          <RoomList rooms={this.state.rooms} />

          <hr />
        </div>
      </div>
    );
  }
});

export default Lobby;
