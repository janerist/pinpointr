import {Socket} from "../../../../deps/phoenix/web/static/js/phoenix"
import React from "react"
import update from "react-addons-update"
import NameInputModal from "./NameInputModal"
import Map from "./Map"
import StatusArea from "./StatusArea"
import CountdownModal from "./CountdownModal"
import $ from "jquery"

const Room = React.createClass({
  getInitialState() {
    return { 
      id: null,
      name: null,
      zxy: null,
      players: [],
      gameState: "waiting_for_players",
      countdown: null,
      numRounds: null,
      round: null,
      currentLoc: null,
      ready: false,
      roundTimeUsed: null,
      roundDistance: null,
      roundPoints: null
    }
  },

  componentDidMount() {
    this.refs.nameModal.open()

    $.getJSON(`/api/rooms/${this.props.params.id}`, room => 
      this.setState(update(this.state, {
        id: {$set: room.id},
        name: {$set: room.name},
        zxy: {$set: room.zxy}
      }))
    )
  },

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect()
    }
  },

  join(name) {
    if (!name) {
      return
    }

    var socket = new Socket("/socket")
    socket.connect()
    let channel = socket.channel("rooms:" + this.state.id, {name: name})

    channel.join()
      .receive("ok", roomState => {
        this.refs.nameModal.close()

        this.socket = socket
        this.channel = channel
        this.setState(update(this.state, {
          players: {$set: roomState.players},
          gameState: {$set: roomState.game_state},
          numRounds: {$set: roomState.num_rounds},
          round: {$set: roomState.round},
          currentLoc: {$set: roomState.current_loc}
        }))

        channel.on("player:joined", this.playerJoined)
        channel.on("player:left", this.playerLeft)
        channel.on("player:updated", this.playerUpdated)
        channel.on("game:gameStarting", this.gameStarting)
        channel.on("game:roundStarting", this.roundStarting)
        channel.on("game:roundStarted", this.roundStarted)
        channel.on("game:roundFinished", this.roundFinished)
        channel.on("game:gameEnded", this.gameEnded)
        channel.on("game:countdown", this.countdown)
      })
      .receive("error", response => {
        alert(response.reason)
        socket.disconnect()
      })
  },

  playerJoined({player}) {
    this.setState(update(this.state, {
      players: {$push: [player]}
    }))
  },

  playerLeft({player}) {
    this.setState(update(this.state, {
      players: {$set: this.state.players.filter(p => p.name !== player.name)}
    }))
  },

  playerUpdated({player}) {
    this.setState(update(this.state, {
      players: {$set: this.state.players.filter(p => p.name !== player.name).concat(player)}
    }))
  },

  gameStarting({game_state, num_rounds, players}) {
    this.setState(update(this.state, {
      players: {$set: players},
      gameState: {$set: game_state},
      numRounds: {$set: num_rounds},
      ready: {$set: false}
    }))
  },

  roundStarting({game_state, round, players}) {
    this.setState(update(this.state, {
      players: {$set: players},
      gameState: {$set: game_state},
      round: {$set: round},
      ready: {$set: false}
    }))

    this.refs.map.reset()
  },

  roundStarted({game_state, players, loc}) {
    this.setState(update(this.state, {
      players: {$set: players},
      gameState: {$set: game_state},
      currentLoc: {$set: loc}
    }))
  },

  roundFinished({game_state, players}) {
    this.setState(update(this.state, {
      players: {$set: players},
      gameState: {$set: game_state},
      ready: {$set: false},
      roundTimeUsed: {$set: null},
      roundDistance: {$set: null},
      roundPoints: {$set: null}
    }))
  },

  gameEnded({game_state, players}) {
    this.setState(update(this.state, {
      players: {$set: players},
      gameState: {$set: game_state},
      ready: {$set: false}
    }))
  },

  countdown({countdown}) {
    this.setState(update(this.state, {
      countdown: {$set: countdown}
    }))
  },

  handleToggleReady() {
    let ready = !this.state.ready
    this.setState(update(this.state, {
      ready: {$set: ready}
    }))

    this.channel.push("player:ready", {ready: ready})
  },

  handlePinpoint(latlng) {
    this.channel
      .push("player:pinpoint", {latlng: latlng})
      .receive("ok", reply => {
        this.setState(update(this.state, {
          roundTimeUsed: {$set: reply.time_used},
          roundDistance: {$set: reply.distance},
          roundPoints: {$set: reply.points}
        }))
        this.refs.map.handlePinpointReply(latlng, reply)
      })
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            {(() => {
              if (this.state.id) {
                return (
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <StatusArea ref="status" {...this.state} />
                    </div>
                    <div className="panel-body">
                      <Map ref="map" zxy={this.state.zxy} pinpointed={this.handlePinpoint} />
                    </div>
                  </div>
                )
              }
            })()}
          </div>
        </div>
        <NameInputModal ref="nameModal" nameSubmitted={this.join} />
        <CountdownModal ref="countdownModal" {...this.state} 
          readyToggled={this.handleToggleReady} />
      </div>
    )
  }
})

export default Room
