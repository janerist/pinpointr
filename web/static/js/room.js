import {Socket} from "deps/phoenix/web/static/js/phoenix";
import NameInputModal from "./NameInputModal";
import Map from "./Map";

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

    let room = "rooms:" + this.props.id;
    let chan = this.props.socket.channel(room, { name: name });

    chan.join()
      .receive("ok", response => {
        this.setState({
          roomName: response.room.name,
          users: response.room.users,
          zxy: response.room.zxy
        });
        this.refs.nameModal.close();
      })
      .receive("error", response => {
        alert(response.reason);
      });
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
          </div>
        </div>
        <div className="row">
          <div className="col-lg-9">
            <Map zxy={this.state.zxy} />
          </div>
          <div className="col-lg-3">
            <h4>{this.state.roomName}</h4>
          </div>
        </div>
        <NameInputModal ref="nameModal" nameSubmitted={this.join}/>
      </div>
    );
  }

});

let socket = new Socket("/socket");
socket.connect();

React.render(
  <Room id={_room_id} socket={socket} />,
  document.getElementById("room")
)
