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
      gameState: "waiting_for_players",
      countdown: null,
      numRounds: null,
      round: null,
      currentLoc: null
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
          gameState: roomState.game_state,
          countdown: null,
          numRounds: roomState.num_rounds,
          round: roomState.round,
          currentLoc: roomState.current_loc
        });

        channel.on("player:joined", this.playerJoined);
        channel.on("player:left", this.playerLeft);
        channel.on("player:updated", this.playerUpdated);
        channel.on("player:pinpoint", this.playerPinpointed);
        channel.on("chat:message", this.refs.chat.addMessage);
        channel.on("game:gameStarting", this.gameStarting);
        channel.on("game:roundStarting", this.roundStarting);
        channel.on("game:roundStarted", this.roundStarted);
        channel.on("game:roundFinished", this.roundFinished);
        channel.on("game:gameEnded", this.gameEnded);
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
      gameState: this.state.gameState,
      countdown: this.state.countdown,
      numRounds: this.state.numRounds,
      round: this.state.round,
      currentLoc: this.state.currentLoc
    });

    this.refs.chat.addMessage({
      message: `${player.name} has joined the room.`
    });
  },

  playerLeft({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name),
      gameState: this.state.gameState,
      countdown: this.state.countdown,
      numRounds: this.state.numRounds,
      round: this.state.round,
      currentLoc: this.state.currentLoc
    });

    this.refs.chat.addMessage({
      message: `${player.name} has left the room.`
    });
  },

  playerUpdated({player}) {
    this.setState({
      players: this.state.players.filter(p => p.name !== player.name).concat(player),
      gameState: this.state.gameState,
      countdown: this.state.countdown,
      numRounds: this.state.numRounds,
      round: this.state.round,
      currentLoc: this.state.currentLoc
    });
  },

  playerPinpointed({player}) {
    this.playerUpdated({player: player});

    this.refs.chat.addMessage({
      message: `${player.name} pinpointed ${Math.round(player.round_distance)} meters 
        from the target.`
    });
  },

  gameStarting({game_state, num_rounds, players}) {
    this.setState({
      players: players,
      gameState: game_state,
      countdown: this.state.countdown,
      numRounds: num_rounds,
      round: this.state.round,
      currentLoc: this.state.currentLoc
    });
  },

  roundStarting({game_state, round, players}) {
    this.setState({
      players: players, 
      gameState: game_state,
      countdown: this.state.countdown,
      numRounds: this.state.numRounds,
      round: round,
      currentLoc: this.state.currentLoc
    });

    this.refs.map.resetView();
  },

  roundStarted({game_state, players, loc}) {
    this.setState({
      players: players, 
      gameState: game_state,
      countdown: this.state.countdown,
      numRounds: this.state.numRounds,
      round: this.state.round,
      currentLoc: loc 
    });
  },

  roundFinished({game_state, players}) {
    this.setState({
      players: players, 
      gameState: game_state,
      countdown: this.state.countdown,
      numRounds: this.state.numRounds,
      round: this.state.round,
      currentLoc: this.state.currentLoc
    });
  },

  gameEnded({game_state, players}) {
    this.setState({
      players: players, 
      gameState: game_state,
      countdown: this.state.countdown,
      numRounds: this.state.numRounds,
      round: this.state.round,
      currentLoc: this.state.currentLoc
    });
  },

  countdown({countdown}) {
    this.setState({
      players: this.state.players,
      gameState: this.state.gameState,
      countdown: countdown,
      numRounds: this.state.numRounds,
      round: this.state.round,
      currentLoc: this.state.currentLoc
    });
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
            <StatusArea ref="status" {...this.state} />
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
