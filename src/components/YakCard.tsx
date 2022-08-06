import { AnnotationIcon } from '@heroicons/react/solid';
import { LatLng } from 'leaflet';
import { useEffect, useState } from 'react';
import { getAddressFromLatLng } from '../api/nominatimApi';
import { useAppSelector } from '../app/hooks';
import { Yak } from '../model/Yak';
import { distanceToPoint } from '../utils/helpers';
import YikyakAvatar from './YikyakAvatar';

interface YakCardProps {
  yak: Yak;
  onClick?: (yak: Yak) => void;
  showAddress?: boolean;
}
const YakCard = ({ yak, onClick, showAddress }: YakCardProps) => {
  const myLocation = useAppSelector((state) => state.yikyakUser.location);
  const [yakLocation, setYakLocation] = useState(
    `${yak.point.coordinates[1]}, ${yak.point.coordinates[0]}`
  );

  useEffect(() => {
    const fetchAddr = async () => {
      try {
        const addr = await getAddressFromLatLng(
          new LatLng(yak.point.coordinates[1], yak.point.coordinates[0])
        );
        setYakLocation(addr);
      } catch (ex) {
        console.error(ex);
      }
    };

    if (showAddress) fetchAddr();
  }, [yak.point, showAddress]);

  const voteColor = (vote: number) => {
    if (vote > 0) {
      return 'text-teal-500';
    } else if (vote < 0) {
      return 'text-red-800';
    }
    return 'dark:text-gray-200 text-gray-600';
  };

  const clickableStyles = onClick
    ? 'hover:bg-gray-300 hover:dark:bg-zinc-700 cursor-pointer'
    : '';
  return (
    <div
      className={`p-4 rounded-sm bg-gray-200 dark:bg-zinc-800 ${clickableStyles}`}
      onClick={() => onClick && onClick(yak)}
    >
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <YikyakAvatar
            emoji={yak.userEmoji}
            color={yak.userColor}
            isMe={yak.isMine}
          />
          <p>{yak.text}</p>
        </div>

        <div className="flex flex-row ml-4 mr-2 items-center space-x-8">
          <span className={`${voteColor(yak.voteCount)} text-lg font-bold`}>
            {yak.voteCount}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-2 justify-between">
        <p className="text-sm dark:text-gray-500 text-zinc-600">
          {new Date(yak.createdAt).toLocaleString()}, {yak.interestAreas}.
        </p>
        <span className="flex flex-row">
          <AnnotationIcon className="w-6 h-6 mr-2" />
          {yak.commentCount} comments
        </span>
      </div>
      <div className="flex justify-between text-sm dark:text-gray-500 text-zinc-600">
        <p>
          {yak.isIncognito ? 'Hidden' : 'Public'},{' '}
          {distanceToPoint(yak.point.coordinates, myLocation)} away
        </p>
        <p>{yakLocation}</p>
      </div>
    </div>
  );
};

export default YakCard;
