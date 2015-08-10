
let Scoreboard = React.createClass({
  render() {
    return (
      <div className="panel panel-default">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-right">Points</th>
            </tr>
          </thead>
          <tbody>
          {this.props.players.map(player => {
            return (
              <tr key={player.name}>
                <td>{player.name}</td>
                <td className="text-right">{player.points}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }
});

export default Scoreboard;
