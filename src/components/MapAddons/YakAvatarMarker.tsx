import L, { LatLng } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';

interface YakAvatarMarkerProps {
  forPost: {
    text: string;
    userEmoji: string;
    userColor: string;
    point: {
      coordinates: [number, number];
    };
    isOp?: boolean;
    isMine?: boolean;
  };
}

const YakAvatarMarker = ({ forPost }: YakAvatarMarkerProps) => {
  const position = new LatLng(
    forPost.point.coordinates[1],
    forPost.point.coordinates[0]
  );

  const iconStyle = `
    background-color: ${forPost.userColor ?? 'gray'};
    width: fit-content;
    padding: 0.2rem;
    position: relative;
    border-radius: 9999px;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF;
  `;

  const emojiStyle = `
    transform: rotate(-45deg);
    font-size: 1rem;
    font-weight: bold;
  `;

  let userEmoji = '???';
  if (forPost.userEmoji !== '') {
    if (forPost.isMine) userEmoji = 'ME';
    else if (forPost.isOp) userEmoji = 'OP';
    else userEmoji = forPost.userEmoji;
  }

  return (
    <>
      <Marker
        position={position}
        icon={L.divIcon({
          className: 'text-zinc-900',
          iconAnchor: [0, 24],
          popupAnchor: [8, -16],
          html: `
        <div style="${iconStyle}">
          <h1 style="${emojiStyle}">
            ${userEmoji}
          </h1>
        </div>
        `,
        })}
      >
        <Popup>{forPost.text}</Popup>
      </Marker>
    </>
  );
};

export default YakAvatarMarker;
