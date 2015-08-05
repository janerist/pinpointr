let Map = React.createClass({

  componentDidMount() {
    this.map = L.map("map", {
      doubleClickZoom: false
    }).setView([0, 0], 0);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.zxy) {
      let [z, x, y] = nextProps.zxy.split("/");
      this.map.setZoom(z);
      this.map.panTo([x, y]);
    }
  },

  render() {
    return (
      <div id="map"></div>
    );
  }
});

export default Map;
