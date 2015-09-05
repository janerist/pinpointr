import {SetFullHeightMixin} from "./mixins";

let Map = React.createClass({
  mixins: [SetFullHeightMixin],
  
  componentDidMount() {
    this.map = L.map("map", {
      doubleClickZoom: false
    });

    this.resetView();

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on("dblclick", this.pinpoint);
  },

  resetView() {
    let [z, x, y] = this.props.zxy.split("/");
    this.map.setView([x, y], z);
  },

  pinpoint({latlng}) {
    this.props.pinpointed([latlng.lat, latlng.lng]);
  },

  render() {
    return (
      <div id="map"></div>
    );
  }
});

export default Map; 