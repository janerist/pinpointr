let NameInputModal = React.createClass({
  getInitialState() {
    return { 
      name: "" 
    };
  },

  handleChange(event) {
    this.setState({name: event.target.value});
  },

  handleKeyUp(event) {
    if (event.key === "Enter") {
      this.props.nameSubmitted(this.state.name);
    }
  },

  open() {
    $(this.getDOMNode()).modal({
      backdrop: "static",
      keyboard: false
    });
    React.findDOMNode(this.refs.nameInput).focus();
  },

  close() {
    $(this.getDOMNode()).modal("hide");
  },

  render() {
    return (
      <div className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <label>Enter your name to join the room.</label>
              <input 
                type="text"
                className="form-control"
                ref="nameInput"
                maxLength="20"
                onKeyUp={this.handleKeyUp}
                onChange={this.handleChange} />
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                className="btn btn-primary"
                onClick={this.props.nameSubmitted.bind(null, this.state.name)}>
                Join room
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default NameInputModal;
