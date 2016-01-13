import React from "react";
import {Modal} from "react-bootstrap";

const NameInputModal = React.createClass({
  getInitialState() {
    return {
      show: false,
      name: ""
    };
  },

  handleChange(event) {
    this.setState({name: event.target.value});
  },

  handleSubmit(event) {
    event.preventDefault();
    this.props.nameSubmitted(this.state.name);
  },

  open() {
    this.setState({show: true, name: this.state.name});
  },

  close() {
    this.setState({show: false, name: this.state.name});
  },

  render() {
    return (
      <Modal show={this.state.show}
             onHide={this.close}
             backdrop="static"
             keyboard={false}>
        <Modal.Body>
          <form onSubmit={this.handleSubmit}>
            <p>
              Enter your name to join the room.
            </p>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                ref={input => {if (input) {input.focus(); }}}
                maxLength="20"
                onChange={this.handleChange} />
              <span className="input-group-btn">
                <button
                  type="submit"
                  className="btn btn-primary">
                  Join room
                </button>
              </span>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
});

export default NameInputModal;
