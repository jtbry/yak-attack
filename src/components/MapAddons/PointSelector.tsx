import { LatLng } from 'leaflet';
import { useMapEvent } from 'react-leaflet';

interface PointSelectorProps {
  onChange?: (point: LatLng) => void;
}

const PointSelector = ({ onChange }: PointSelectorProps) => {
  useMapEvent('click', (e) => {
    if (onChange) {
      onChange(e.latlng);
    }
  });

  return null;
};

export default PointSelector;
