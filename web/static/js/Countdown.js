let Countdown = React.createClass({
	render() {
		var colorClass = "label-primary";

		if (this.props.colorize) {
			if (this.props.countdown < 7) {
				colorClass = "label-warning";
			} 
			if (this.props.countdown < 4) {
				colorClass = "label-danger";
			}
		}

		var maybeHidden = this.props.hidden ? "hide" : "";
		return (
			<span className={"label " + colorClass + " " + maybeHidden}
				  style={{fontSize: 16}}>
				{this.props.countdown}
			</span>
		);
	}
});

export default Countdown;