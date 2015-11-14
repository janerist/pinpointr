import React from "react"

const NavBar = React.createClass({
  render() {
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar-collapse"
              aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">
              pinpointr <span style={{
                color: "red",
                fontSize: "80%"
              }}>alpha</span>
            </a>
          </div>
          <div className="collapse navbar-collapse" id="navbar-collapse">
          </div>
        </div>
      </nav>
    )
  }
})

export default NavBar
