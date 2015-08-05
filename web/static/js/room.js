import {Socket} from "phoenix";
import NameInputModal from "./NameInputModal";

let Room = React.createClass({

  getInitialState() {
    return { roomName: "", users: [], zxy: "" };
  },

  componentDidMount() {
    this.refs.nameModal.open();
  },

  join: function(name) {
    if (!name) {
      return;
    }

    let chan = this.props.socket.chan("rooms:" + this.props.id, { name: name });
    chan.join()
      .receive("ok", roomData => {
        this.setState({
          roomName: roomData.name,
          users: roomData.users,
          zxy: roomData.zxy
        });
        this.refs.nameModal.close();
      })
      .receive("error", response => {
        alert(response.reason);
      });
  },

  render() {
    return (
      <NameInputModal ref="nameModal" nameSubmitted={this.join}/>
    );
  }

});

let socket = new Socket("/socket");
socket.connect();

React.render(
  <Room id={_room_id} socket={socket} />,
  document.getElementById("room")
)
