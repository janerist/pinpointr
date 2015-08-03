import {Socket} from "phoenix";
// let socket = new Socket("/ws")
// socket.connect()
// let chan = socket.chan("topic:subtopic", {})
// chan.join().receive("ok", resp => {
//   console.log("Joined succesffuly!", resp)
// })

let RoomNode = React.createClass({
  render() {
    let url = "rooms/" + this.props.data.id;
    return (
      <li>
        <a href={url}>
          {this.props.data.name}
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
      <ul className="unstyled">
        {roomNodes}
      </ul>
    );
  }
});

React.render(
  <RoomList />,
  document.getElementById("lobby")
);
