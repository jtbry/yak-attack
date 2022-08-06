import { Comment } from "./Comment";
import { GqlEdges } from "./GqlEdges";

export interface Yak {
  id: string;
  text: string;
  isMine: boolean;
  comments: GqlEdges<Comment>;
  createdAt: string;
  userEmoji: string;
  userColor: string;
  voteCount: number;
  isIncognito: boolean;
  commentCount: number;
  interestAreas: string[];
  point: { coordinates: [number, number] };
}