import { LocationMarkerIcon } from '@heroicons/react/solid';
import { LatLng } from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import CustomControl from './CustomControl';

interface LocatorControlProps {
  onLocate?: (point: LatLng) => void;
  onFailedLocate?: () => void;
}

const LocatorControl = ({
  onLocate,
  onFailedLocate,
}: LocatorControlProps): JSX.Element => {
  const map = useMapEvents({
    locationfound: (e) => {
      if (onLocate) {
        onLocate(e.latlng);
      }
    },
    locationerror: (e) => {
      console.error(e);
      if (onFailedLocate) {
        onFailedLocate();
      }
    },
  });

  const handleClick = () => {
    map.locate({ setView: true });
  };

  return (
    <CustomControl position="topleft">
      <LocationMarkerIcon
        onClick={handleClick}
        className="h-8 w-8 bg-white text-zinc-700 cursor-pointer"
      />
    </CustomControl>
  );
};

export default LocatorControl;
