
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
          {this.props.users.map(user => {
            return (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td className="text-right">{user.points}</td>
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
