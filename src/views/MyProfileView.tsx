import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_YIKYAK_PROFILE } from '../api/yikyakApi';
import { useAppDispatch } from '../app/hooks';
import Button from '../components/Button';
import YakCard from '../components/YakCard';
import YakComment from '../components/YakComment';
import { OnboardingStep, setOnboardingStep } from '../features/onboardingSlice';
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

  const logout = () => {
    dispatch(setOnboardingStep(OnboardingStep.Credentials));
  };

  if (!data || !data.me) {
    return <p>Loading...</p>;
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
      <Button buttonStyle="danger" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
};

export default MyProfileView;
