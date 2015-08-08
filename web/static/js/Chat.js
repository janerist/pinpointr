let ChatMessage = React.createClass({
  render() {
    let isAnnouncement = !this.props.message.from;

    if (isAnnouncement) {
      return (
        <li className="chatAnnouncement">{this.props.message.message}</li>
      );
    } else {
      return (
        <li className="chatMessage">
          <span className="chatFrom">{this.props.message.from}</span>:
          {this.props.message.message}
        </li>
      );
    }
  }
});

let ChatInput = React.createClass({
  getInitialState() {
    return { 
      message: "" 
    };
  },

  handleChange(event) {
    this.setState({
      message: event.target.value
    });
  },

  handleKeyDown(event) {
    if (event.key === "Enter") {
      this.props.messageSubmitted(this.state.message);
      this.setState({
        message: ""
      });
    }
  },

  render() {
    return (
        <input 
          type="text"
          className="form-control"
          ref="chatInput"
          value={this.state.message}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Say something" />
    );
  }
});

let Chat = React.createClass({
  componentDidMount() {
    this.MAX_MESSAGES = 100;
  },

  getInitialState() {
    return { 
      messages: [] 
    };
  },

  addMessage(message) {
    var messages = this.state.messages;
    if (messages.length === this.MAX_MESSAGES) {
      messages = messages.splice(1, messages.length);
    }
    this.setState({
      messages: messages.concat(message)
    });

    let chatScroll = React.findDOMNode(this.refs.chatScroll);
    chatScroll.scrollTop = chatScroll.scrollHeight;
  },

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="chatScroll" ref="chatScroll">
            <ul className="list-unstyled">
              {this.state.messages.map(m => {
                return <ChatMessage message={m} />;
              })}
            </ul>
          </div>
        </div>
        <div className="panel-footer">
          <ChatInput messageSubmitted={this.props.messageSubmitted} />
        </div>
      </div>
    );
  }
});

export default Chat;
