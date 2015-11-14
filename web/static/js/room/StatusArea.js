import React from "react"
import Countdown from "./Countdown"

const StatusArea = React.createClass({
  render() {
    let hasPinpointed = !!this.props.roundTimeUsed
    var messageContent
    if (hasPinpointed) {
      messageContent = (
        <div style={{ fontWeight: "bold" }}>
          You pinpointed <strong>{Math.round(this.props.roundDistance)}m</strong> from the target.
          <p style={{fontSize: 18}}>
            +{this.props.roundPoints} points
          </p>
        </div>
      )
    } else {
      messageContent = (
        <h4>
          Pinpoint "{this.props.currentLoc}"<br />
          <small>double-click to pinpoint</small>
        </h4>
      )
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1 col-sm-2 col-xs-3">
            <div style={{ paddingTop: 18}}></div>
            <Countdown countdown={this.props.countdown}
                       size="20"
                       colorize={!this.props.roundTimeUsed}
                       hidden={this.props.gameState !== "round_started"}/>
          </div>
          <div className="col-md-10 col-sm-8 col-xs-6 text-center">
            {messageContent}
          </div>
          <div className="col-md-1 col-sm-2 col-xs-3 text-right">
            <div style={{ paddingTop: 18}}></div>
            <Countdown countdown={this.props.countdown}
                       size="20"
                       colorize={!this.props.roundTimeUsed}
                       hidden={this.props.gameState !== "round_started"}/>
          </div>
        </div>
      </div>
    )
  }
})

export default StatusArea
