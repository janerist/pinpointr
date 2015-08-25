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
    window.addEventListener("resize", this.setChatScrollHeight);
    this.setChatScrollHeight();
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.setChatScrollHeight);
  },

  setChatScrollHeight() {
    let $chatScroll = $(React.findDOMNode(this.refs.chatScroll));
    let $chatInput = $(React.findDOMNode(this.refs.chatInput));
    let offset = $chatScroll.offset(); 

    if ($(window).width() >= 1180) {
      let height = $(window).height() - offset.top - $chatInput.height() - 50;
      $chatScroll.height(height);  
    } else {
      let height = 200;
      $chatScroll.height(height); 
    }
  },

  getInitialState() {
    return { 
      messages: [],
      hidden: false
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

  toggleChat() {
    this.setState({
      messages: this.state.messages,
      hidden: !this.state.hidden
    });
  },

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="chatScroll" ref="chatScroll">
            <ul className="list-unstyled">
              {this.state.messages.map((m, i) => {
                return <ChatMessage key={i} message={m} />;
              })}
            </ul>
          </div>
        </div>
        <div className="chatInput panel-footer" ref="chatInput">
          <ChatInput messageSubmitted={this.props.messageSubmitted} />
        </div>
      </div>
    );
  }
});

export default Chat;
