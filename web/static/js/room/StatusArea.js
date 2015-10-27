import Countdown from "./Countdown";

let StatusArea = React.createClass({
  render() {
    let hasPinpointed = !!this.props.roundTimeUsed;

      var colorClass = "alert-success";
      if (!hasPinpointed && this.props.gameState === "round_started") {
        if (this.props.countdown < 7) {
          colorClass = "alert-warning";
        }

        if (this.props.countdown < 4) {
          colorClass = "alert-danger";
        }
      }

      var messageContent;
      if (hasPinpointed) {
        messageContent = (
          <div style={{ fontWeight: "bold" }}>
            You pinpointed <strong>{Math.round(this.props.roundDistance)}m</strong> from the target.
            <p style={{fontSize: 18}}>
              +{this.props.roundPoints} points
            </p>
          </div>
        );
      } else {
        messageContent = (
          <div style={{ fontWeight: "bold", fontSize: 18 }}>
            Pinpoint "{this.props.currentLoc}"
            <p style={{fontSize: 9}}>(double-click to pinpoint)</p>
          </div>
        );
      }

      return (
        <div className={"alert " + colorClass} style={{marginBottom: 0, paddingBottom: 0}}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-1 col-sm-2 col-xs-3">
                <Countdown countdown={this.props.countdown} 
                           colorize={!this.props.roundTimeUsed}
                           hidden={this.props.gameState !== "round_started"} />
              </div>
              <div className="col-md-10 col-sm-8 col-xs-6 text-center">
                {messageContent}
              </div>
              <div className="col-md-1 col-sm-2 col-xs-3 text-right">
                <Countdown countdown={this.props.countdown} 
                           colorize={!this.props.roundTimeUsed}
                           hidden={this.props.gameState !== "round_started"} />
              </div>
            </div>
          </div>
        </div>
      );
  }
});

export default StatusArea;