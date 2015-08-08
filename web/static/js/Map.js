let Map = React.createClass({
  handleResize() {
    let $mapDiv = $("#map");
    let offset = $mapDiv.offset();
    $mapDiv.height($(window).height() - offset.top);
  },

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    let [z, x, y] = this.props.zxy.split("/");
    this.map = L.map("map", {
      doubleClickZoom: false
    }).setView([x, y], z);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  },

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  render() {
    return (
      <div id="map"></div>
    );
  }
});

export default Map; 