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

        this.setStatusMessage(roomState.current_loc);

        channel.on("player:joined", this.playerJoined);
        channel.on("player:left", this.playerLeft);
        channel.on("player:updated", this.playerUpdated);
        channel.on("player:pinpoint", this.playerPinpointed);
        channel.on("chat:message", this.refs.chat.addMessage);
        channel.on("game:roundStarting", this.roundStarting);
        channel.on("game:roundStarted", this.roundStarted);
        channel.on("game:roundFinished", this.roundFinished);
        channel.on("game:countdown", this.countdown);
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

  playerUpdated({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name).concat(player),
      gameState: this.state.gameState
    });
  },

  playerPinpointed({player}) {
    this.playerUpdated({player: player});

    this.refs.chat.addMessage({
      message: `${player.name} pinpointed ${Math.round(player.round_distance)} meters 
        from the target and scored ${player.round_points} points.`
    });
  },

  roundStarting({game_state, players}) {
    this.refs.countdownModal.setReady(false);

    this.setState({
      players: players, 
      gameState: game_state
    });

    this.refs.map.resetView();
    this.refs.status.setMessage("");
    this.refs.status.setCountdown(null);
  },

  roundStarted({game_state, players, loc}) {
    this.refs.countdownModal.setReady(false);
    
    this.setState({
      players: players, 
      gameState: game_state
    });

    this.setStatusMessage(loc);
  },

  roundFinished({game_state, players}) {
    this.refs.countdownModal.setReady(false);

    this.setState({
      players: players, 
      gameState: game_state
    });

    this.refs.status.setMessage("");
    this.refs.status.setCountdown(null);
  },

  countdown({countdown}) {
    switch (this.state.gameState) {
      case "round_starting":
      case "round_finished": 
        this.refs.countdownModal.setCountdown(countdown);
        break;

      case "round_started":
        this.refs.status.setCountdown(countdown);
        break;
    }
  },

  setStatusMessage(loc) {
    if (loc) {
      this.refs.status.setMessage(`Pinpoint "${loc}"`);
    }
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

  handlePinpoint(latlng) {
    this.channel.push("player:pinpoint", {latlng: latlng})
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-9">
            <StatusArea ref="status" />
            <Map ref="map" zxy={this.props.zxy} pinpointed={this.handlePinpoint} />
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
