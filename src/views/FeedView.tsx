import { QueryResult, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_ALL_YAKS, GET_YIKYAK_FEED } from '../api/yikyakApi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import ListSelector from '../components/ListSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import PaginatedViewer from '../components/PaginatedViewer';
import QuerySuspense from '../components/QuerySuspense';
import YakCard from '../components/YakCard';
import { setFeedOrder, setFeedType } from '../features/homeFeedSlice';
import { PageInfo, PaginatedEdges } from '../model/PaginatedEdges';
import { Yak } from '../model/Yak';
import {
  AVAILABLE_FEED_ORDERS,
  AVAILABLE_FEED_TYPES,
  POST_VIEW,
} from '../utils/constants';

const queriesForFeedType = {
  ALL: GET_ALL_YAKS,
  LOCAL: GET_YIKYAK_FEED,
};

type FeedQueryResult = {
  feed: PaginatedEdges<Yak>;
  allYaks: PaginatedEdges<Yak>;
};

const FeedView = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useAppSelector((state) => state.location.point);
  const { feedType, feedOrder, currentPage } = useAppSelector(
    (state) => state.homeFeed
  );

  const feedQuery = useQuery<FeedQueryResult>(queriesForFeedType[feedType], {
    variables: {
      feedType: feedType,
      feedOrder: feedOrder,
      location: `POINT(${location.lng} ${location.lat})`,
    },
  });

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
      <QuerySuspense className="mt-2 space-y-2" query={feedQuery}>
        {({
          loading,
          error,
          data,
          refetch,
          startPolling,
        }: QueryResult<FeedQueryResult>) => {
          if (loading) {
            return (
              <LoadingSpinner
                className="mt-24 flex justify-center"
                size="w-24 h-24"
              />
            );
          } else if (error || !data) {
            console.error(error ?? 'Missing data');
            return (
              <h1 className="mt-24 flex justify-center text-4xl">Error</h1>
            );
          } else {
            startPolling(10000);
            const fetchMore = (currPage: PageInfo, direction: 1 | -1) => {
              console.log('fetch more');
              if (direction === 1) {
                // refetch with after
                refetch({
                  after: currPage.endCursor,
                });
              } else {
                // refetch with before
                refetch({
                  before: currPage.startCursor,
                });
              }
            };
            return (
              <PaginatedViewer
                render={(yak: Yak) => (
                  <YakCard
                    key={yak.id}
                    yak={yak}
                    onClick={() => navigate(POST_VIEW.replace(':id', yak.id))}
                  />
                )}
                data={data.feed ?? data.allYaks}
                pageSize={4}
                fetchMore={fetchMore}
              />
            );
          }
        }}
      </QuerySuspense>
    </>
  );
};

export default FeedView;
