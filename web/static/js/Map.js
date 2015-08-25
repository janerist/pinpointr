import {SetFullHeightMixin} from "./mixins";

let Map = React.createClass({
  mixins: [SetFullHeightMixin],
  
  componentDidMount() {
    let [z, x, y] = this.props.zxy.split("/");
    this.map = L.map("map", {
      doubleClickZoom: false
    }).setView([x, y], z);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  },

  render() {
    return (
      <div id="map"></div>
    );
  }
});

export default Map; 