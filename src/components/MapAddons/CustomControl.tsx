import L from 'leaflet';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { LEAFLET_POSITION_CLASSES } from '../../utils/constants';

interface CustomControlProps {
  children?: React.ReactNode | React.ReactNode[];
  position?: 'bottomleft' | 'bottomright' | 'topleft' | 'topright';
}

const CustomControl = ({
  position,
  children,
}: CustomControlProps): JSX.Element => {
  const [container, setContainer] = React.useState<any>(
    document.createElement('div')
  );
  const positionClass =
    (position && LEAFLET_POSITION_CLASSES[position]) ||
    LEAFLET_POSITION_CLASSES.topright;

  useEffect(() => {
    const targetDiv = document.getElementsByClassName(positionClass);
    setContainer(targetDiv[0]);
  }, []);

  const controlContainer = (
    <div className="leaflet-control leaflet-bar">{children}</div>
  );

  L.DomEvent.disableClickPropagation(container);

  return ReactDOM.createPortal(controlContainer, container);
};

export default CustomControl;
