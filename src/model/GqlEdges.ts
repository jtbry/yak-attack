
export interface GqlEdges<T> {
  edges: {
    node: T;
  }[];
}

export const getDataFromEdges = <T>(edges: GqlEdges<T>): T[] => {
  return edges.edges.map(edge => edge.node);
}