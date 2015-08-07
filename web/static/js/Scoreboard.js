
let Scoreboard = React.createClass({
  render() {
    return (
      <div className="panel panel-default">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
          {this.props.users.map(user => {
            return (
              <tr>
                <td>{user.name}</td>
                <td>{user.points}</td>
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