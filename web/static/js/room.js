import {Socket} from "deps/phoenix/web/static/js/phoenix";
import NameInputModal from "./NameInputModal";
import Map from "./Map";
import Scoreboard from "./Scoreboard";
import Chat from "./Chat";

let Room = React.createClass({
  getInitialState() {
    return { 
      players: [] 
    };
  },

  componentDidMount() {
    this.refs.nameModal.open();
  },

  join(name) {
    if (!name) {
      return;
    }

    var socket = new Socket("/socket");
    socket.connect();
    let channel = socket.channel("rooms:" + this.props.id, {name: name});

    channel.join()
      .receive("ok", roomState => {
        this.refs.nameModal.close();

        this.socket = socket;
        this.channel = channel;
        this.setState(roomState);

        channel.on("player:joined", this.playerJoined);
        channel.on("player:left", this.playerLeft);
        channel.on("chat:message", this.refs.chat.addMessage);
      })
      .receive("error", response => {
        alert(response.reason);
        socket.disconnect();
      });
  },

  playerJoined({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name).concat(player)
    });

    this.refs.chat.addMessage({
      message: `${player.name} has joined the room.`
    });
  },

  playerLeft({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name)
    });

    this.refs.chat.addMessage({
      message: `${player.name} has left the room.`
    });
  },

  handleMessageSubmitted(message) {
    if (!message) {
      return;
    }

    this.channel.push("chat:message", {message: message});
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
            <Map zxy={this.props.zxy} />
          </div>
          <div className="col-lg-3">
            <Scoreboard players={this.state.players} />
            <Chat ref="chat" messageSubmitted={this.handleMessageSubmitted} />
          </div>
        </div>
        <NameInputModal ref="nameModal" nameSubmitted={this.join} />
      </div>
    );
  }
});

React.render(
  <Room {...window.__room} />,
  document.getElementById("room")
);
