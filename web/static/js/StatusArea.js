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
      <div className="well well-sm text-center">
        <div className="countdown">
          <span className="badge badge-default">
            {this.state.countdown}
          </span>
        </div>
        <div className="statusMessage">
          {this.state.message}
        </div>
      </div>
    );
  }
});

export default StatusArea;