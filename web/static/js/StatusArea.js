let StatusArea = React.createClass({
  getInitialState() {
    return {
      message: "",
    }
  },

  setMessage(message) {
    this.setState({
      message: message,
    });
  },

  render() {
    return (
      <div className="well well-sm text-center">
        <div className="statusMessage">
          {this.state.message}
        </div>
      </div>
    );
  }
});

export default StatusArea;