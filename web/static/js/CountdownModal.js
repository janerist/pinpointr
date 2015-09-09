import {
  GameStartingScoreboard, 
  RoundStartingScoreboard, 
  RoundFinishedScoreboard
} from "./Scoreboard";
import Countdown from "./Countdown";
import {AutosizeModalBody} from "./mixins";

let CountdownModal = React.createClass({
  mixins: [AutosizeModalBody],
                   
  componentDidMount() {
    $(this.getDOMNode()).modal({
      backdrop: "static",
      keyboard: false,
      show: false
    });
  },

  componentWillReceiveProps(nextProps) {
    let shouldModalBeVisible = 
      nextProps.gameState === "game_starting" 
        || nextProps.gameState === "round_starting" 
        || nextProps.gameState === "round_finished"
        || nextProps.gameState === "game_ended";

    $(this.getDOMNode()).modal(shouldModalBeVisible ? "show" : "hide");
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
    let btnText = this.props.ready ? "Not ready" : "Ready";
    var btnClasses = "btn btn-block";
    if (this.props.ready) {
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
                  <div className="col-md-1 col-sm-2 col-xs-3">
                    <Countdown countdown={this.props.countdown} />
                  </div>
                  <div className="col-md-10 col-sm-8 col-xs-6 text-center">
                    <div style={{fontWeight: "bold"}}>{message}</div>
                  </div>
                  <div className="col-md-1 col-sm-2 col-xs-3 text-right">
                    <Countdown countdown={this.props.countdown} />
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
                        onClick={this.props.readyToggled}>
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