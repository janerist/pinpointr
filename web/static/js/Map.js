let Map = React.createClass({

  handleResize() {
    let $mapDiv = $("#map");
    let offset = $mapDiv.offset();
    $mapDiv.height($(window).height() - offset.top);
  },

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
    window.removeEventListener("resize", this.handleResize);
  },

  shouldComponentUpdate({zxy}) {
    return this.props.zxy !== zxy;
  },

  componentWillUpdate({zxy}) {
    let [z, x, y] = zxy.split("/");
    this.map.setView([x, y], z);
  },

  render() {
    return (
        <div id="map"></div>
    );
  }
});

export default Map;
