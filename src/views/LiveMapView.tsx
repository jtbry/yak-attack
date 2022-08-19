import { useQuery } from '@apollo/client';
import { GET_YIKYAK_FEED } from '../api/yikyakApi';
import { useAppSelector } from '../app/hooks';
import LeafletMap from '../components/LeafletMap';
import LoadingSpinner from '../components/LoadingSpinner';
import YakAvatarMarker from '../components/MapAddons/YakAvatarMarker';
import { getDataFromEdges, PaginatedEdges } from '../model/PaginatedEdges';
import { Yak } from '../model/Yak';

const LiveMapView = () => {
  const location = useAppSelector((state) => state.location.point);

  const { loading, error, data } = useQuery<{
    feed: PaginatedEdges<Yak>;
  }>(GET_YIKYAK_FEED, {
    variables: {
      feedType: 'LOCAL',
      feedOrder: 'NEW',
      location: `POINT(${location.lng} ${location.lat})`,
    },
    pollInterval: 20000,
  });

  if (loading) {
    return (
      <LoadingSpinner className="mt-24 flex justify-center" size="w-24 h-24" />
    );
  } else if (error) {
    console.error(error);
    return <h1 className="mt-24 flex justify-center text-4xl">Error</h1>;
  } else if (!data) {
    return <h1 className="mt-24 flex justify-center text-4xl">No Content</h1>;
  }

  const yaks = getDataFromEdges(data.feed);
  return (
    <LeafletMap
      className="w-full mt-4 rounded-md"
      style={{ height: 'calc(100vh - 8rem)' }}
      center={location}
      zoom={19}
    >
      {yaks.map((yak) => (
        <YakAvatarMarker key={yak.id} forPost={yak} />
      ))}
    </LeafletMap>
  );
};

export default LiveMapView;
