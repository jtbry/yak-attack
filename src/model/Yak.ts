import { Comment } from "./Comment";
import { PaginatedEdges } from "./PaginatedEdges";

export interface Yak {
  id: string;
  text: string;
  isMine: boolean;
  comments: PaginatedEdges<Comment>;
  createdAt: string;
  userEmoji: string;
  userColor: string;
  voteCount: number;
  isIncognito: boolean;
  commentCount: number;
  interestAreas: string[];
  point: { coordinates: [number, number] };
}