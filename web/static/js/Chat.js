let ChatMessage = React.createClass({
  render() {
    let isAnnouncement = !this.props.message.from;
    let className = isAnnouncement ? "chatAnnouncement" : "chatMessage";
    return (
        <li className={className}>
        {isAnnouncement ? (
          <span>{this.props.message.message}</span>
        ) : (
          <span>
          <span className="chatFrom">{this.props.message.from}</span>:
          {this.props.message.message}
          </span>
        )}
        </li>
    );
  }
});


let ChatInput = React.createClass({
  getInitialState() {
    return { message: "" };
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
        <input type="text"
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
  getInitialState() {
    return { messages: [] };
  },

  addMessage(message) {
    this.setState({
      messages: this.state.messages.concat(message)
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
          <ChatInput messageSubmitted={this.props.messageSubmitted}/>
        </div>
      </div>
    );
  }
});

export default Chat;
