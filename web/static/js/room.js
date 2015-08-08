import {Socket} from "deps/phoenix/web/static/js/phoenix";
import NameInputModal from "./NameInputModal";
import Map from "./Map";
import Scoreboard from "./Scoreboard";
import Chat from "./Chat";

let Room = React.createClass({
  getInitialState() {
    return { 
      users: [] 
    };
  },

  componentDidMount() {
    this.refs.nameModal.open();
  },

  join(name) {
    if (!name) {
      return;
    }

    var socket = new Socket("/socket");
    socket.connect();
    let channel = socket.channel("rooms:" + this.props.id, {name: name});

    channel.join()
      .receive("ok", payload => {
        this.refs.nameModal.close();

        this.socket = socket;
        this.channel = channel;
        this.setState(payload);

        channel.on("user:joined", this.userJoined);
        channel.on("user:left", this.userLeft);
        channel.on("chat:message", this.refs.chat.addMessage);
      })
      .receive("error", response => {
        alert(response.reason);
        socket.disconnect();
      });
  },

  userJoined({user}) {
    this.setState({
      users: this.state.users.filter(u => u.name !== user.name).concat(user)
    });

    this.refs.chat.addMessage({
      message: `${user.name} has joined the room.`
    });
  },

  userLeft({user}) {
    this.setState({
      users: this.state.users.filter(u => u.name !== user.name)
    });

    this.refs.chat.addMessage({
      message: `${user.name} has left the room.`
    });
  },

  handleMessageSubmitted(message) {
    if (!message) {
      return;
    }

    this.channel.push("chat:message", {message: message});
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-9">
          </div>
          <div className="col-lg-3">
          </div>
        </div>
        <div className="row">
          <div className="col-lg-9">
            <Map zxy={this.props.zxy} />
          </div>
          <div className="col-lg-3">
            <Scoreboard users={this.state.users} />
            <Chat ref="chat" messageSubmitted={this.handleMessageSubmitted} />
          </div>
        </div>
        <NameInputModal ref="nameModal" nameSubmitted={this.join} />
      </div>
    );
  }
});

React.render(
  <Room {...window.__room} />,
  document.getElementById("room")
);
