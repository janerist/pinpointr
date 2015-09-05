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
      <div className="row statusArea">
        <div className="col-md-4">
          <span className="badge badge-default">
            {this.state.countdown}
          </span>
        </div>
        <div className="col-md-4 text-center">
          <div className="statusMessage">
            {this.state.message}
          </div>
        </div>
        <div className="col-md-4 text-right">
          <span className="badge badge-default">
            {this.state.countdown}
          </span>
        </div>
      </div>
    );
  }
});

export default StatusArea;