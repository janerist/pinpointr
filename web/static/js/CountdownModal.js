import {
  GameStartingScoreboard, 
  RoundStartingScoreboard, 
  RoundFinishedScoreboard
} from "./Scoreboard";
import Countdown from "./Countdown";
import {AutosizeModalBody} from "./mixins";

let CountdownModal = React.createClass({
  mixins: [AutosizeModalBody],

  getInitialState() {
    return {
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
  },

  componentWillReceiveProps(nextProps) {
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
      countdown: countdown,
      ready: this.state.ready
    });
  },

  getGameStateMessage() {
    switch (this.props.gameState) {
      case "game_starting":
        return "New game is starting...";
      case "round_starting":
        return `${this.props.round}/${this.props.numRounds} Next round is starting...`;
      case "round_finished":
        return `${this.props.round}/${this.props.numRounds} Round finished`;
      case "game_ended":
        return "Game over";
      default: 
        return "";
    }
  },

  setReady(ready) {
    this.setState({
      countdown: this.state.countdown,
      ready: ready 
    });
  },

  toggleReady() {
    let ready = !this.state.ready;

    this.setState({
      countdown: this.state.countdown,
      ready: ready 
    });

    this.props.readyToggled(ready);
  },

  getScoreboard() {
    if (this.props.gameState === "game_starting") {
      return (<GameStartingScoreboard {...this.props} />);
    } else if (this.props.gameState === "round_starting"
               || this.props.gameState === "game_ended") {
      return (<RoundStartingScoreboard {...this.props} />);
    } else if (this.props.gameState === "round_finished") {
      return (<RoundFinishedScoreboard {...this.props} />);
    } 
  },

  render() {
    let btnText = this.state.ready ? "Not ready" : "Ready";
    var btnClasses = "btn btn-block";
    if (this.state.ready) {
      btnClasses += " btn-danger";
    } else {
      btnClasses += " btn-success";
    }

    var scoreboard = this.getScoreboard();
    var message = this.getGameStateMessage();

    return (
      <div className="countdownModal modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-2">
                    <Countdown countdown={this.state.countdown} />
                  </div>
                  <div className="col-md-8 text-center">
                    <div className="gameStateMessage">{message}</div>
                  </div>
                  <div className="col-md-2 text-right">
                    <Countdown countdown={this.state.countdown} />
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