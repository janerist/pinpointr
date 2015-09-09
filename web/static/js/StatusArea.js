import Countdown from "./Countdown";

let StatusArea = React.createClass({
  getInitialState() {
    return {
      message: "",
      countdown: null
    }
  },

  setMessage(message) {
    this.setState({
      message: message,
      countdown: this.state.countdown
    });
  },

  setCountdown(countdown) {
    this.setState({
      message: this.state.message,
      countdown: countdown
    });
  },

  render() {
    return (
      <div className="well well-sm">
        <div className="container-fluid">
          <div className="row statusArea">
            <div className="col-md-2">
              <Countdown countdown={this.state.countdown} colorize={true} />
            </div>
            <div className="col-md-8 text-center">
              <div className="statusMessage">
                {this.state.message}&nbsp;
              </div>
            </div>
            <div className="col-md-2 text-right">
              <Countdown countdown={this.state.countdown} colorize={true} />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default StatusArea;