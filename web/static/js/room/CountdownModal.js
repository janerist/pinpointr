import React from "react"
import {Modal} from "react-bootstrap"
import {GameStartingScoreboard, RoundStartingScoreboard, RoundFinishedScoreboard} from "./Scoreboard"
import Countdown from "./Countdown"

const CountdownModal = React.createClass({
  getInitialState() {
    return {
      show: false
    }
  },

  componentWillReceiveProps(nextProps) {
    let shouldModalBeVisible =
      nextProps.gameState === "game_starting"
      || nextProps.gameState === "round_starting"
      || nextProps.gameState === "round_finished"
      || nextProps.gameState === "game_ended"

    this.setState({show: shouldModalBeVisible})
  },

  getGameStateMessage() {
    switch (this.props.gameState) {
    case "game_starting":
      return "New game is starting..."
    case "round_starting":
      return `${this.props.round}/${this.props.numRounds} Next round is starting...`
    case "round_finished":
      return `${this.props.round}/${this.props.numRounds} Round finished`
    case "game_ended":
      return "Game over"
    default:
      return ""
    }
  },

  getScoreboard() {
    if (this.props.gameState === "game_starting") {
      return (<GameStartingScoreboard {...this.props} />)
    } else if (this.props.gameState === "round_starting"
      || this.props.gameState === "game_ended") {
      return (<RoundStartingScoreboard {...this.props} />)
    } else if (this.props.gameState === "round_finished") {
      return (<RoundFinishedScoreboard {...this.props} />)
    }
  },

  render() {
    let btnText = this.props.ready ? "Not ready" : "Ready"
    var btnClasses = "btn btn-block"
    if (this.props.ready) {
      btnClasses += " btn-danger"
    } else {
      btnClasses += " btn-success"
    }

    var scoreboard = this.getScoreboard()
    var message = this.getGameStateMessage()

    return (
      <Modal show={this.state.show}
             onHide={() => this.setState({show: false})}
             bsSize="lg"
             style={{overflowY: "initial !important"}}>
        <Modal.Header>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-1 col-sm-2 col-xs-3">
                <Countdown countdown={this.props.countdown}/>
              </div>
              <div className="col-md-10 col-sm-8 col-xs-6 text-center">
                <div style={{fontWeight: "bold"}}>{message}</div>
              </div>
              <div className="col-md-1 col-sm-2 col-xs-3 text-right">
                <Countdown countdown={this.props.countdown}/>
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body style={{ height: "50vh", overflowY: "scroll"}}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                {scoreboard}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            <button type="button"
                    className={btnClasses}
                    onClick={this.props.readyToggled}>
              {btnText}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
})

export default CountdownModal
