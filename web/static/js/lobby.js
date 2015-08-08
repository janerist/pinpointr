import {Socket} from "deps/phoenix/web/static/js/phoenix";

let RoomPopover = React.createClass({
  render() {
    if (this.props.users.length) {
      return (
        <ul className="list-unstyled">
          {this.props.users.map(user => {
            return (
              <li key={user.name}>
                <i className="glyphicon glyphicon-user"></i> {user.name}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return <span>Empty</span>;
    }
  }
});

let RoomNode = React.createClass({
  componentDidMount() {
    this.clearAndSetPopover();
  },

  componentWillUpdate() {
    this.clearAndSetPopover();
  },

  clearAndSetPopover() {
    let el = $(React.findDOMNode(this.refs.roomButton));
    el.popover("destroy");
    el.popover({
      html: true,
      content: React.renderToString(<RoomPopover {...this.props} />),
      placement: "bottom",
      trigger: "hover"
    });
  },

  render() {
    let url = "rooms/" + this.props.id;
    return (
      <li>
        <a href={url}
           className="btn btn-primary btn-lg"
           ref="roomButton">
          <h4>{this.props.name}</h4>
          <i className="glyphicon glyphicon-user"></i>
        &nbsp;{this.props.users.length}
        </a>
      </li>
    );
  }
});

let RoomList = React.createClass({
  getInitialState() {
    return { 
      rooms: []
    };
  },

  componentDidMount() {
    let socket = new Socket("/socket");
    socket.connect();
    let channel = socket.channel("rooms:lobby");
    channel.join()
      .receive("ok", response => {
        this.setState(response);
      });
  },

  render() {

    return (
      <div className="jumbotron text-center">
        <h4>Join a room to play!</h4>
        <ul className="list-unstyled">
          {this.state.rooms.map(room => {
            return (
              <RoomNode key={room.id} {...room} />
            );
          })}
        </ul>
      </div>
    );
  }
});

React.render(
  <RoomList />,
  document.getElementById("lobby")
);
