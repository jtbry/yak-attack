
export interface PaginatedEdges<T> {
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  edges: {
    node: T;
  }[];
}

export const getDataFromEdges = <T>(edges: PaginatedEdges<T>): T[] => {
  return edges.edges.map(edge => edge.node);
}