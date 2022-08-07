import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_YIKYAK_FEED } from '../api/yikyakApi';
import { useAppSelector } from '../app/hooks';
import Notification from '../components/Notification';
import PageLoader from '../components/PageLoader';
import YakCard from '../components/YakCard';
import { getDataFromEdges, PaginatedEdges } from '../model/PaginatedEdges';
import { Yak } from '../model/Yak';
import { POST_VIEW } from '../utils/constants';

const FeedView = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useAppSelector((state) => state.location.point);
  const { loading, error, data } = useQuery<{ feed: PaginatedEdges<Yak> }>(
    GET_YIKYAK_FEED,
    {
      variables: {
        feedType: 'LOCAL',
        feedOrder: 'NEW',
        location: `POINT(${location.lng} ${location.lat})`,
      },
    }
  );

  if (loading) return <PageLoader />;
  if (error) {
    console.log(data);
    console.error(error);
    return (
      <Notification
        notification={{ type: 'error', message: 'Unable to load local feed' }}
      />
    );
  }

  const yikyaks: Yak[] = data ? getDataFromEdges(data.feed) : [];
  return (
    <div className="space-y-2">
      {yikyaks.map((y) => (
        <YakCard
          key={y.id}
          yak={y}
          onClick={() => navigate(POST_VIEW.replace(':id', y.id))}
        />
      ))}
    </div>
  );
};

export default FeedView;
