import { Comment } from "./Comment";
import { GqlEdges } from "./GqlEdges";
import { Yak } from "./Yak";

export interface User {
  id: string;
  username: string;
  emoji: string;
  color: string;
  yakarmaScore: number;
  yaks?: GqlEdges<Yak>;
  comments?: GqlEdges<Comment>;
}