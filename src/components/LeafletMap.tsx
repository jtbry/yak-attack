import { MapContainer, MapContainerProps, TileLayer } from 'react-leaflet';

interface LeafletMapProps extends MapContainerProps {}

const LeafletMap = (props: LeafletMapProps): JSX.Element => {
  return (
    <MapContainer {...props}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.children}
    </MapContainer>
  );
};

export default LeafletMap;
