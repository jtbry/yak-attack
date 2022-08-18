import { useAppSelector } from '../app/hooks';
import { Comment } from '../model/Comment';
import { distanceToPoint, timeSinceTimestamp } from '../utils/helpers';
import YikyakAvatar from './YikyakAvatar';

interface YakCardProps {
  comment: Comment;
}
const YakComment = ({ comment }: YakCardProps) => {
  const myLocation = useAppSelector((state) => state.location.point);

  const voteColor = (vote: number) => {
    if (vote > 0) {
      return 'text-teal-500';
    } else if (vote < 0) {
      return 'text-red-800';
    }
    return 'text-gray-200';
  };

  return (
    <div className="p-4 rounded-md bg-slate-800">
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <YikyakAvatar
            emoji={comment.isOp ? 'OP' : comment.userEmoji}
            color={comment.userColor}
            isMe={comment.isMine}
          />
          <p>{comment.text}</p>
        </div>

        <div className="flex flex-row ml-4 mr-2 items-center space-x-8">
          <span className={`${voteColor(comment.voteCount)} text-lg font-bold`}>
            {comment.voteCount}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-2 justify-between">
        <p className="text-sm text-gray-500">
          {timeSinceTimestamp(new Date(comment.createdAt))}{' '}
          {comment.interestAreas ? `from ${comment.interestAreas}` : ''}
        </p>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <p>{distanceToPoint(comment.point.coordinates, myLocation)} away</p>
        <p>
          {comment.point.coordinates[1]}, {comment.point.coordinates[0]}
        </p>
      </div>
    </div>
  );
};

export default YakComment;
