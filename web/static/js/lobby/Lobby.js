import {Socket} from "../../../../deps/phoenix/web/static/js/phoenix";
import React from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

let RoomTooltip = React.createClass({
  render() {
    if (this.props.players.length) {
      return (
        <ul className="list-unstyled">
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

let RoomNode = React.createClass({
  render() {
    let url = "rooms/" + this.props.id;
    return (
      <li>
        <OverlayTrigger placement="bottom" overlay={<Tooltip id={this.props.id}><RoomTooltip {...this.props} /></Tooltip>}>
          <a href={url}
             className="btn btn-primary btn-lg"
             ref="roomButton">
            <h4>{this.props.name}</h4>
            <i className="glyphicon glyphicon-user"></i>
          &nbsp;{this.props.players.length}
          </a>
        </OverlayTrigger>
      </li>
    );
  }
});

let RoomList = React.createClass({
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

let Lobby = React.createClass({
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
  },

  render() {
    return (
      <div className="jumbotron text-center">
        <h4>Join a room to play!</h4>
        <RoomList rooms={this.state.rooms} />
      </div>
    );
  }
})

export default Lobby;