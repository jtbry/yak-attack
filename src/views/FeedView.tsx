import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_YAKS, GET_YIKYAK_FEED } from '../api/yikyakApi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import ListSelector from '../components/ListSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import PaginatedData from '../components/PaginatedData';
import YakCard from '../components/YakCard';
import {
  setCurrentPage,
  setFeedOrder,
  setFeedType,
} from '../features/homeFeedSlice';
import { PageInfo, PaginatedEdges } from '../model/PaginatedEdges';
import { Yak } from '../model/Yak';
import {
  AVAILABLE_FEED_ORDERS,
  AVAILABLE_FEED_TYPES,
  POST_VIEW,
} from '../utils/constants';

const FeedView = (): JSX.Element => {
  // TODO: convert local state to redux so it remains after viewing a yak
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.location.point);
  const { feedType, feedOrder, currentPage } = useAppSelector(
    (state) => state.homeFeed
  );

  const { loading, error, data, refetch, startPolling, stopPolling } =
    useQuery<{
      feed: PaginatedEdges<Yak>;
      allYaks: PaginatedEdges<Yak>;
    }>(feedType === 'LOCAL' ? GET_YIKYAK_FEED : GET_ALL_YAKS, {
      variables: {
        feedType: feedType,
        feedOrder: feedOrder,
        location: `POINT(${location.lng} ${location.lat})`,
      },
    });

  const queryNewFeedPage = (direction: number, page: PageInfo) => {
    if (direction > 0) {
      refetch({
        feedType: feedType,
        feedOrder: feedOrder,
        location: `POINT(${location.lng} ${location.lat})`,
        after: page.endCursor,
      });
    } else {
      refetch({
        feedType: feedType,
        feedOrder: feedOrder,
        location: `POINT(${location.lng} ${location.lat})`,
        before: page.startCursor,
      });
    }
  };

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
    // For some reason pollInterval is broken, this is a workaround
    if (currentPage != 0) startPolling(20000);
    else stopPolling();

    const onPageChange = (page: number) => {
      dispatch(setCurrentPage(page));
    };

    const paginatedOptions = {
      pageSize: 5,
      startPage: currentPage,
      render: (yak: Yak) => (
        <YakCard
          key={yak.id}
          yak={yak}
          onClick={() => navigate(POST_VIEW.replace(':id', yak.id))}
        />
      ),
      fetchMore: queryNewFeedPage,
      onChange: onPageChange,
    };
    content =
      feedType === 'LOCAL' ? (
        <PaginatedData data={data.feed} {...paginatedOptions} />
      ) : (
        <PaginatedData data={data.allYaks} {...paginatedOptions} />
      );
  }

  // TODO: the go back button doesn't respect local/all feed
  return (
    <>
      <div className="flex justify-between items-center space-x-2">
        <div className="w-full md:w-1/5">
          <ListSelector
            value={feedType}
            list={AVAILABLE_FEED_TYPES}
            onChange={(type) => dispatch(setFeedType(type))}
          />
        </div>
        {feedType === 'LOCAL' && (
          <div className="w-full md:w-1/5">
            <ListSelector
              value={feedOrder}
              list={AVAILABLE_FEED_ORDERS}
              onChange={(order) => dispatch(setFeedOrder(order))}
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
