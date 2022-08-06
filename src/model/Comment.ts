
export interface Comment {
  id: string;
  isOp: boolean;
  text: string;
  isMine: boolean;
  createdAt: string;
  userEmoji: string;
  userColor: string;
  voteCount: number;
  interestAreas: string[];
  point: { coordinates: [number, number] };
}