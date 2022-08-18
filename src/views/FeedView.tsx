import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_YAKS, GET_YIKYAK_FEED } from '../api/yikyakApi';
import { useAppSelector } from '../app/hooks';
import ListSelector from '../components/ListSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import YakCard from '../components/YakCard';
import { getDataFromEdges, PaginatedEdges } from '../model/PaginatedEdges';
import { Yak } from '../model/Yak';
import { POST_VIEW } from '../utils/constants';

const availableFeedTypes = ['LOCAL', 'ALL'] as const;
type FeedType = typeof availableFeedTypes[number];

const availableFeedOrders = ['NEW', 'HOT', 'TOP'] as const;
type FeedOrder = typeof availableFeedOrders[number];

const FeedView = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useAppSelector((state) => state.location.point);
  const [feedType, setFeedType] = useState<FeedType>('LOCAL');
  const [feedOrder, setFeedOrder] = useState<FeedOrder>('NEW');

  const { loading, error, data } = useQuery<{
    feed: PaginatedEdges<Yak>;
    allYaks: PaginatedEdges<Yak>;
  }>(feedType === 'LOCAL' ? GET_YIKYAK_FEED : GET_ALL_YAKS, {
    variables: {
      feedType: feedType,
      feedOrder: feedOrder,
      location: `POINT(${location.lng} ${location.lat})`,
    },
    pollInterval: 20000,
  });

  let content;
  if (loading) {
    content = (
      <LoadingSpinner className="mt-24 flex justify-center" size="w-24 h-24" />
    );
  } else if (error) {
    console.error(error);
    content = <h1 className="mt-24 flex justify-center text-4xl">Error</h1>;
  } else if (!data) {
    content = (
      <h1 className="mt-24 flex justify-center text-4xl">No Content</h1>
    );
  } else {
    const yaks =
      feedType === 'LOCAL'
        ? getDataFromEdges(data.feed)
        : getDataFromEdges(data.allYaks);
    content = (
      <>
        {yaks.map((yak) => (
          <YakCard
            key={yak.id}
            yak={yak}
            onClick={() => navigate(POST_VIEW.replace(':id', yak.id))}
          />
        ))}
      </>
    );
  }

  // TODO: the go back button doesn't respect local/all feed
  return (
    <>
      <div className="flex justify-between items-center space-x-2">
        <div className="w-full md:w-1/5">
          <ListSelector
            value={feedType}
            list={availableFeedTypes}
            onChange={setFeedType}
          />
        </div>
        {feedType === 'LOCAL' && (
          <div className="w-full md:w-1/5">
            <ListSelector
              value={feedOrder}
              list={availableFeedOrders}
              onChange={setFeedOrder}
              mirror
            />
          </div>
        )}
      </div>
      <div className="mt-2 space-y-2">{content}</div>
    </>
  );
};

export default FeedView;
