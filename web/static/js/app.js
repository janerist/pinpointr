import Lobby from "./lobby/Lobby";
import Room from "./room/Room";
import React from "react";
import {render} from "react-dom";
import {Router, Route, IndexRoute} from "react-router";
import NavBar from "./NavBar";

const App = React.createClass({
  render() {
    return (
      <div>
        <NavBar />
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
});

render((
	<Router>
    <Route path="/" component={App}>
      <IndexRoute component={Lobby} />
      <Route path="rooms/:id" component={Room} />
    </Route>
	</Router>
), document.getElementById("app"));
