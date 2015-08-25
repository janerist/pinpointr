import Scoreboard from "./Scoreboard";

let CountdownModal = React.createClass({
  getInitialState() {
    return {
      message: "",
      countdown: 0,
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
    this.setState({
      message: this.getGameStateMessage(nextProps.gameState),
      countdown: this.state.countdown,
      ready: this.state.ready
    });

    if (nextProps.gameState === "game_ended" 
        || nextProps.gameState === "round_starting") {
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

  getGameStateMessage(gameState) {
    switch (gameState) {
      case "round_starting":
        return "Next round is starting...";
      case "game_ended":
        return "Game ended. Starting new game...";
      default: 
        return "";
    }
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
    var btnText = this.state.ready ? "Not ready" : "Ready";
    var btnClasses = "btn";
    if (this.state.ready) {
      btnClasses += " btn-danger";
    } else {
      btnClasses += " btn-success";
    }

    return (
      <div className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6">
                    <div className="gameStateMessage">
                      {this.state.message}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="countdown text-right">
                      {this.state.countdown}
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12">
                    <Scoreboard players={this.props.players} />
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