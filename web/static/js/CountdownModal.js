import Scoreboard from "./Scoreboard";

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
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      message: this.getGameStateMessage(nextProps.gameState),
      countdown: this.state.countdown,
      ready: this.state.ready
    });

    if (nextProps.gameState === "round_starting" 
        || nextProps.gameState === "round_finished") {
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

  getGameStateMessage(gameState) {
    switch (gameState) {
      case "round_starting":
        return "Next round is starting...";
      case "round_finished":
        return "Round finished";
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
                  <div className="col-md-4">
                    <div className="countdown">
                      <span className="badge badge-default">
                        {this.state.countdown}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="gameStateMessage text-center">
                      {this.state.message}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="countdown text-right">
                      <span className="badge badge-default">
                        {this.state.countdown}
                      </span>
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