
interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedEdges<T> {
  pageInfo: PageInfo;
  edges: Edge<T>[];
}

export const getDataFromEdges = <T>(paginated: PaginatedEdges<T>): T[] => {
  if (!paginated) {
    return [];
  }
  return paginated.edges.map(edge => edge.node);
}