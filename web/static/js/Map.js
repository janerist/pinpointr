let Map = React.createClass({

  componentDidMount() {
    this.map = L.map("map", {
      doubleClickZoom: false
    }).setView([0, 0], 0);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  },

  componentWillUpdate(nextProps) {
    if (nextProps.zxy) {
      let [z, x, y] = nextProps.zxy.split("/");
      this.map.setView([x, y], z);
    }
  },

  render() {
    return (
        <div style={{height: "400"}} id="map"></div>
    );
  }
});

export default Map;
