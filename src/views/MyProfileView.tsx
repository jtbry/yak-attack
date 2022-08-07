import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_YIKYAK_PROFILE } from '../api/yikyakApi';
import { useAppDispatch } from '../app/hooks';
import DataLoaderPreview from '../components/DataLoaderPreview';
import YakCard from '../components/YakCard';
import YakComment from '../components/YakComment';
import { setYikYakUser } from '../features/yikyakUserSlice';
import { Comment } from '../model/Comment';
import { getDataFromEdges } from '../model/PaginatedEdges';
import { User } from '../model/User';
import { Yak } from '../model/Yak';

const MyProfileView = () => {
  const dispatch = useAppDispatch();
  const { loading, error, data } = useQuery<{ me: User }>(GET_YIKYAK_PROFILE);

  useEffect(() => {
    if (data?.me) {
      dispatch(
        setYikYakUser({ ...data.me, yaks: undefined, comments: undefined })
      );
    }
  }, []);

  if (!data || !data.me) {
    return (
      <DataLoaderPreview loading={loading} error={error ?? 'Missing Data'} />
    );
  }

  // todo: YakFeed
  // todo; CommentFeed
  // Create these two components and use across app
  // todo: Create tabulated view for My Profile to have: YakFeed, CommentFeed, Location History, Notifications
  const yaks = getDataFromEdges(data.me.yaks!);
  const comments = getDataFromEdges(data.me.comments!);
  const combined = [...yaks, ...comments];
  combined.sort((a: any, b: any) => a.createdAt - b.createdAt);

  const createElement = (post: Yak | Comment) => {
    if ('isOp' in post) {
      return <YakComment key={post.id} comment={post} />;
    } else {
      return <YakCard key={post.id} yak={post} />;
    }
  };
  return (
    <div className="space-y-2">
      {combined.map((post: Yak | Comment) => createElement(post))}
    </div>
  );
};

export default MyProfileView;
