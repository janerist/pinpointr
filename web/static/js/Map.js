let Map = React.createClass({

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    this.map = L.map("map", {
      doubleClickZoom: false
    }).setView([0, 0], 0);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.handlResize);
  },

  componentWillUpdate(nextProps) {
    if (nextProps.zxy) {
      let [z, x, y] = nextProps.zxy.split("/");
      this.map.setView([x, y], z);
    }
  },

  handleResize(event) {
    let $mapDiv = $("#map");
    let offset = $mapDiv.offset();
    $mapDiv.height($(window).height() - offset.top);
  },

  render() {
    return (
        <div id="map" ref></div>
    );
  }
});

export default Map;
