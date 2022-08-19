import { QueryResult } from '@apollo/client';

interface QuerySuspenseProps {
  query: QueryResult;
  className?: string;
  children: (query: QueryResult) => React.ReactNode;
}

const QuerySuspense = ({ query, children, className }: QuerySuspenseProps) => {
  return <div className={className}>{children(query)}</div>;
};

export default QuerySuspense;
