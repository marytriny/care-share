import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import "leaflet/dist/leaflet.css"

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const MAX_RADIUS = 40;
const MIN_RADIUS = 10;

const getRadius = (contribution) => {
  let radius = MAX_RADIUS * contribution
  if (!radius || radius < 10) radius = MIN_RADIUS
  return radius
}

const MapMarker = ({org, usePin}) => {
  if (usePin) return (
    <Marker position={org.latlng}>
      <Popup>
        <b>{org.organization}</b> <br /> 
        {org.address}
      </Popup>
    </Marker>
  )
  else return (
    <CircleMarker center={org.latlng} radius={getRadius(org.contribution)}>
      <Popup>
        <b>{org.organization}</b> <br /> 
        zip code: {org.zip_code}
      </Popup>
    </CircleMarker>
  )
}

export default function Map ({center, zoom, markers, usePin}) {
  return (
    <div style={{ borderStyle: 'solid', borderColor: '#d7bde2' }}> 
      <MapContainer center={center} zoom={zoom} minZoom={2}>
        { 
          markers && markers.length > 0 && 
          markers.map( x => <MapMarker key={x.organization} org={x} usePin={usePin}/> )
        }
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )
}