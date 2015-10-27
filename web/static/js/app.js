import Lobby from "./lobby/Lobby";
import React from "react";
import {render} from "react-dom";
import {Router, Route, IndexRoute} from "react-router";

render((
	<Router>
		<Route path="/" component={Lobby} />
	</Router>
), document.getElementById("app"));