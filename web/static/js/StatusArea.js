import Countdown from "./Countdown";

let StatusArea = React.createClass({
  render() {
    if (this.props.gameState === "round_started") {
      var colorClass = "alert-success";
      if (this.props.countdown) {
        if (this.props.countdown < 7) {
          colorClass = "alert-warning";
        }

        if (this.props.countdown < 4) {
          colorClass = "alert-danger";
        }
      }

      return (
        <div className={"alert " + colorClass}>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-1 col-sm-2 col-xs-3">
                <Countdown countdown={this.props.countdown} colorize={true} />
              </div>
              <div className="col-md-10 col-sm-8 col-xs-6 text-center">
                <div style={{ fontWeight: "bold", fontSize: 18 }}>
                  Pinpoint "{this.props.currentLoc}"
                </div>
              </div>
              <div className="col-md-1 col-sm-2 col-xs-3 text-right">
                <Countdown countdown={this.props.countdown} colorize={true} />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (<div></div>)
    }
  }
});

export default StatusArea;