import {Socket} from "deps/phoenix/web/static/js/phoenix";
import NameInputModal from "./NameInputModal";
import Map from "./Map";
import Scoreboard from "./Scoreboard";

let Room = React.createClass({

  getInitialState() {
    return { roomName: "", users: [], zxy: ""};
  },

  componentDidMount() {
    this.refs.nameModal.open();
  },

  join: function(name) {
    if (!name) {
      return;
    }

    let room = "rooms:" + this.props.id;
    let chan = this.props.socket.channel(room, { name: name });

    chan.join()
      .receive("ok", response => {
        this.refs.nameModal.close();
        this.setState({
          roomName: response.room.name,
          zxy: response.room.zxy,
          users: response.room.users
        });

        chan.on("user:joined", this.userJoined);
        chan.on("user:left", this.userLeft);
      })
      .receive("error", response => {
        alert(response.reason);
      });
  },

  userJoined({user}) {
    this.setState({
      roomName: this.state.roomName,
      users: this.state.users.filter(u => u.name !== user.name).concat(user),
      zxy: this.state.zxy
    });
  },

  userLeft({user}) {
    this.setState({
      roomName: this.state.roomName,
      users: this.state.users.filter(u => u.name !== user.name),
      zxy: this.state.zxy
    });
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-9">
          </div>
          <div className="col-lg-3">
          </div>
        </div>
        <div className="row">
          <div className="col-lg-9">
            <Map zxy={this.state.zxy} />
          </div>
          <div className="col-lg-3">
            <Scoreboard users={this.state.users} />
          </div>
        </div>
        <NameInputModal ref="nameModal" nameSubmitted={this.join} />
      </div>
    );
  }

});

let socket = new Socket("/socket");
socket.connect();

React.render(
  <Room id={_room_id} socket={socket} />,
  document.getElementById("room")
);
