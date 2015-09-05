export let RoundStartingScoreboard = React.createClass({
  sort(players) {
    return players.sort(function(p1, p2) {
      if (p1.points < p2.points) return 1;
      if (p1.points > p2.points) return -1;
      return 0;
    });
  },

  render() {
    return (
      <div className="scoreboard panel panel-default">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-right">Points</th>
            </tr>
          </thead>
          <tbody>
          {this.sort(this.props.players).map(player => {
            return (
              <tr key={player.name}>
                <td>{player.name} [{player.ready ? "Ready" : "Not ready"}]</td>
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

export let RoundFinishedScoreboard = React.createClass({
  sort(players) {
    return players.sort(function(p1, p2) {
      let p1points = p1.round_points || 0;
      let p2points = p2.round_points || 0;

      if (p1points < p2points) return 1;
      if (p1points > p2points) return -1;

      let p1dist = p1.round_distance || 100000;
      let p2dist = p2.round_distance || 100000;

      if (p1dist < p2dist) return -1;
      if (p1dist > p2dist) return 1;

      return 0;
    })
  },

  render() {
    return (
      <div className="scoreboard panel panel-default">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="text-right">Time used</th>
              <th className="text-right">Distance from target</th>
              <th className="text-right">Points</th>
            </tr>
          </thead>
          <tbody>
          {this.sort(this.props.players).map(player => {
            return (
              <tr key={player.name}>
                <td>{player.name} [{player.ready ? "Ready" : "Not ready"}]</td>
                <td className="text-right">
                  {player.round_time ? Math.round(player.round_time / 1000) + "s" : "-"}
                </td>
                <td className="text-right">
                  {player.round_distance ? Math.round(player.round_distance) + "m" : "-"}
                </td>
                <td className="text-right roundPoints">
                  {player.round_points ? "+" + player.round_points : "-"}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }
});
