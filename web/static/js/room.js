import {Socket} from "deps/phoenix/web/static/js/phoenix";
import NameInputModal from "./NameInputModal";
import Map from "./Map";
import Scoreboard from "./Scoreboard";
import Chat from "./Chat";
import StatusArea from "./StatusArea";
import CountdownModal from "./CountdownModal";

let Room = React.createClass({
  getInitialState() {
    return { 
      players: [],
      gameState: "waiting_for_players"
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
        this.setState({
          players: roomState.players,
          gameState: roomState.game_state
        });

        channel.on("player:joined", this.playerJoined);
        channel.on("player:left", this.playerLeft);
        channel.on("player:ready", this.playerReady);
        channel.on("chat:message", this.refs.chat.addMessage);
        channel.on("countdown", this.countdown);
      })
      .receive("error", response => {
        alert(response.reason);
        socket.disconnect();
      });
  },

  playerJoined({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name).concat(player),
      gameState: this.state.gameState
    });

    this.refs.chat.addMessage({
      message: `${player.name} has joined the room.`
    });
  },

  playerLeft({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name),
      gameState: this.state.gameState
    });

    this.refs.chat.addMessage({
      message: `${player.name} has left the room.`
    });
  },

  playerReady({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name).concat(player),
      gameState: this.state.gameState
    });
  },

  countdown({countdown}) {
    this.refs.countdownModal.setCountdown(countdown);
  },

  handleMessageSubmitted(message) {
    if (!message) {
      return;
    }

    this.channel.push("chat:message", {message: message});
  },

  handleToggleReady(ready) {
    this.channel.push("player:ready", {ready: ready})
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-9">
            <StatusArea ref="status" />
            <Map zxy={this.props.zxy} />
          </div>
          <div className="col-lg-3">
            <Chat ref="chat" messageSubmitted={this.handleMessageSubmitted} />
          </div>
        </div>
        <NameInputModal ref="nameModal" nameSubmitted={this.join} />
        <CountdownModal ref="countdownModal" {...this.state} 
          readyToggled={this.handleToggleReady} />
      </div>
    );
  }
});

React.render(
  <Room {...window.__room} />,
  document.getElementById("room")
);
