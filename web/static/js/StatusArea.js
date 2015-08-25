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

  getGameStateMessage(gameState) {
    switch (gameState) {
      case "waiting_for_players":
        return "Waiting for players...";
      case "game_starting":
        return "New game is starting...";
      case "round_starting":
        return "New round is starting...";
      case "round_in_progress":
        return "Round in progress";
      case "round_ended":
        return "Round finished";
      case "game_ended":
        return "Game finished";
      default: 
        return "";
    }
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