import React from "react"
import ReactDOM from "react-dom"
import {Modal} from "react-bootstrap"

let NameInputModal = React.createClass({
  getInitialState() {
    return { 
      show: false,
      name: "" 
    };
  },

  handleChange(event) {
    this.setState({name: event.target.value})
  },

  handleKeyUp(event) {
    if (event.key === "Enter") {
      this.props.nameSubmitted(this.state.name)
    }
  },

  open() {
    this.setState({show: true, name: this.state.name})
  },

  close() {
    this.setState({show: false, name: this.state.name})
  },

  render() {
    return (
      <Modal show={this.state.show} onHide={this.close} backdrop="static" keyboard={false}>
        <Modal.Body>
          <label>Enter your name to join the room.</label>
          <input 
            type="text"
            className="form-control"
            ref={input => {if (input) {input.focus() }}}
            maxLength="20"
            onKeyUp={this.handleKeyUp}
            onChange={this.handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <button 
            type="button"
            className="btn btn-primary"
            onClick={this.props.nameSubmitted.bind(null, this.state.name)}>
            Join room
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
})

export default NameInputModal;
