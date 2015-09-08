import {
  GameStartingScoreboard, 
  RoundStartingScoreboard, 
  RoundFinishedScoreboard} from "./Scoreboard";

let CountdownModal = React.createClass({
  getInitialState() {
    return {
      message: "",
      countdown: null,
      ready: false
    };
  },
                   
  componentDidMount() {
    $(this.getDOMNode()).modal({
      backdrop: "static",
      keyboard: false,
      show: false
    });

    window.addEventListener("resize", this.resizeModalBody);
    this.resizeModalBody();
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeModalBody);
  },

  resizeModalBody() {
    $(".modal-body", ".countdownModal").height($(window).height() * 0.5);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      message: this.getGameStateMessage(nextProps.gameState, nextProps.round, nextProps.numRounds),
      countdown: this.state.countdown,
      ready: this.state.ready
    });

    if (nextProps.gameState === "game_starting" 
        || nextProps.gameState === "round_starting" 
        || nextProps.gameState === "round_finished"
        || nextProps.gameState === "game_ended") {
      this.open();
    } else {
      this.close();
    }
  },

  open() {
    $(this.getDOMNode()).modal("show");
  },

  close() {
    $(this.getDOMNode()).modal("hide");
  },

  setCountdown(countdown) {
    this.setState({
      message: this.state.message,
      countdown: countdown,
      ready: this.state.ready
    });
  },

  getGameStateMessage(gameState, round, numRounds) {
    switch (gameState) {
      case "game_starting":
        return "New game is starting...";
      case "round_starting":
        return `${round}/${numRounds} Next round is starting...`;
      case "round_finished":
        return `${round}/${numRounds} Round finished`;
      case "game_ended":
        return "Game over";
      default: 
        return "";
    }
  },

  setReady(ready) {
    this.setState({
      message: this.state.message,
      countdown: this.state.countdown,
      ready: ready 
    });
  },

  toggleReady() {
    let ready = !this.state.ready;

    this.setState({
      message: this.state.message,
      countdown: this.state.countdown,
      ready: ready 
    });

    this.props.readyToggled(ready);
  },

  render() {
    let btnText = this.state.ready ? "Not ready" : "Ready";
    var btnClasses = "btn btn-block";
    if (this.state.ready) {
      btnClasses += " btn-danger";
    } else {
      btnClasses += " btn-success";
    }

    var scoreboard;
    if (this.props.gameState === "game_starting") {
      scoreboard = <GameStartingScoreboard {...this.props} />;
    } else if (this.props.gameState === "round_starting"
               || this.props.gameState === "game_ended") {
      scoreboard = <RoundStartingScoreboard {...this.props} />;
    } else if (this.props.gameState === "round_finished") {
      scoreboard = <RoundFinishedScoreboard {...this.props} />;
    } 

    return (
      <div className="countdownModal modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-2">
                    <span className="countdown badge badge-default">
                      {this.state.countdown}
                    </span>
                  </div>
                  <div className="col-md-8 text-center">
                    <div className="gameStateMessage">{this.state.message}</div>
                  </div>
                  <div className="col-md-2 text-right">
                    <span className="countdown badge badge-default">
                      {this.state.countdown}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    {scoreboard}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="text-center">
                <button type="button" 
                        className={btnClasses}
                        onClick={this.toggleReady}>
                  {btnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default CountdownModal;