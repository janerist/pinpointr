import React from "react"
import {SetFullHeightMixin} from "../mixins"
import L from "leaflet"
import "drmonty-leaflet-awesome-markers"

let Map = React.createClass({
  mixins: [SetFullHeightMixin],
  
  componentDidMount() {
    this.map = L.map("map", {
      doubleClickZoom: false
    });

    this.reset();

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  },

  reset() {
    if (this.pinpointLayerGroup) {
      this.pinpointLayerGroup.clearLayers();
      this.map.removeLayer(this.pinpointLayerGroup);
    }

    this.map.on("dblclick", this.pinpoint);

    let [z, x, y] = this.props.zxy.split("/")
    this.map.setView([x, y], z)
  },

  pinpoint({latlng}) {
    this.map.off("dblclick", this.pinpoint);
    this.props.pinpointed([latlng.lat, latlng.lng]);
  },

  handlePinpointReply(latlng, {time, distance, points, target_latlng}) {
    let pinpointMarker = L.marker(latlng, {
      icon: L.AwesomeMarkers.icon({
        icon: "hand-down",
        markerColor: "blue"
      })
    })
    .bindPopup(`
      ${Math.round(distance)}m from target.
      <p style="color: green; font-size: 16px;">
        +${points} points
      </p>
    `, { closeButton: false});

    let targetMarker = L.marker(target_latlng, {
      icon: L.AwesomeMarkers.icon({
        icon: "flag",
        markerColor: "red"
      }),
      clickable: false
    });

    let line = L.polyline([latlng, target_latlng], {
      color: "red",
      clickable: false
    });

    this.pinpointLayerGroup = L.layerGroup([
      pinpointMarker,
      targetMarker,
      line
    ]).addTo(this.map);

    pinpointMarker.openPopup();

    this.map.fitBounds(new L.LatLngBounds([latlng, target_latlng]));
  },

  render() {
    return (
      <div id="map" style={{cursor: "crosshair !important"}}></div>
    );
  }
});

export default Map; 