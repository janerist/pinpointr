import {Socket} from "phoenix";

let RoomNode = React.createClass({
  render() {
    let url = "rooms/" + this.props.data.id;
    return (
      <li>
        <a href={url} className="btn btn-primary btn-large btn-block">
          <h4>{this.props.data.name}</h4>
          <i className="glyphicon glyphicon-user"></i>
        </a>
      </li>
    );
  }
});

let RoomList = React.createClass({
  getInitialState() {
    return { rooms: []};
  },

  componentDidMount() {
    let socket = new Socket("/socket");
    socket.connect();
    let chan = socket.chan("rooms:lobby", {});
    chan.join().receive("ok", resp => {
      this.setState(resp);
    });
  },

  render() {
    let roomNodes = this.state.rooms.map(room => {
      return (<RoomNode key={room.id} data={room} />);
    });

    return (
      <div className="jumbotron">
        <h4>Join a room to play!</h4>
        <ul className="list-unstyled">
            {roomNodes}
        </ul>
      </div>
    );
  }
});

React.render(
  <RoomList />,
  document.getElementById("lobby")
);
