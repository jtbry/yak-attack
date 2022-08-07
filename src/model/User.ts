import { Comment } from "./Comment";
import { PaginatedEdges } from "./PaginatedEdges";
import { Yak } from "./Yak";

export interface User {
  id: string;
  username: string;
  emoji: string;
  color: string;
  yakarmaScore: number;
  yaks?: PaginatedEdges<Yak>;
  comments?: PaginatedEdges<Comment>;
}