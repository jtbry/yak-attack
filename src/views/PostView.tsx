import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_YIKYAK_POST } from '../api/yikyakApi';
import LeafletMap from '../components/LeafletMap';
import YakAvatarMarker from '../components/MapAddons/YakAvatarMarker';
import YakCard from '../components/YakCard';
import YakComment from '../components/YakComment';
import { Comment } from '../model/Comment';
import { getDataFromEdges } from '../model/PaginatedEdges';
import { Yak } from '../model/Yak';

const PostView = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery<{ yak: Yak }>(GET_YIKYAK_POST, {
    variables: { id: id },
  });

  if (!data || !data.yak) {
    return <p>Loading...</p>;
  } else {
    const yak = data.yak;
    const comments = getDataFromEdges(yak.comments);

    return (
      <div className="space-y-3">
        <LeafletMap
          className="h-96 w-full mt-4 rounded-md"
          center={[yak.point.coordinates[1], yak.point.coordinates[0]]}
          zoom={21}
        >
          <YakAvatarMarker forPost={{ isOp: true, ...yak }} />

          {comments.map((comment) => (
            <YakAvatarMarker key={comment.id} forPost={comment} />
          ))}
        </LeafletMap>

        <YakCard yak={yak} showAddress />

        <div className="mt-4 space-y-3">
          {comments.length > 0 && (
            <h1 className="text-2xl font-bold">Comments</h1>
          )}
          {comments.map((comment: Comment) => (
            <YakComment key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    );
  }
};

export default PostView;
