import {Socket} from "deps/phoenix/web/static/js/phoenix";


let RoomPopover = React.createClass({
  render() {
    if (this.props.data.users.length) {
      return (
        <ul className="list-unstyled">
          {this.props.data.users.map(user => {
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
      content: React.renderToString(<RoomPopover data={this.props.data}/>),
      placement: "bottom",
      trigger: "hover"
    });
  },

  render() {
    let url = "rooms/" + this.props.data.id;
    return (
      <li>
        <a href={url}
           className="btn btn-primary btn-lg"
           ref="roomButton">
          <h4>{this.props.data.name}</h4>
          <i className="glyphicon glyphicon-user"></i>
        &nbsp;{this.props.data.users.length}
        </a>
      </li>
    );
  }
});

let RoomList = React.createClass({
  getInitialState() {
    return { rooms: []};
  },

  componentDidMount() {
    let socket = new Socket("/socket");
    socket.connect();
    let chan = socket.channel("rooms:lobby");
    chan.join()
      .receive("ok", response => {
        this.setState(response);
      });
  },

  render() {
    let roomNodes = this.state.rooms.map(room => {
      return (<RoomNode key={room.id} data={room} />);
    });

    return (
      <div className="jumbotron text-center">
        <h4>Join a room to play!</h4>
        <ul className="list-unstyled">
            {roomNodes}
        </ul>
      </div>
    );
  }
});

React.render(
  <RoomList />,
  document.getElementById("lobby")
);
