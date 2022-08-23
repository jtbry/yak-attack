import { useState } from 'react';
import { PaginatedEdges } from '../model/PaginatedEdges';
import Button from './Button';

interface PaginatedViewerProps {
  data: PaginatedEdges<any>;
  pageSize: number;
  render: (item: any) => JSX.Element;
}

const PaginatedViewer = ({ data, pageSize, render }: PaginatedViewerProps) => {
  const [page, setPage] = useState(0);

  const pagedData = data.edges.slice(page * pageSize, (page + 1) * pageSize);

  const hasMorePages = (direction: 1 | -1) => {
    if (page + direction >= 0 && direction === -1) {
      return true;
    } else if (
      page + direction < data.edges.length / pageSize &&
      direction === 1
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {data.edges.map((item) => render(item.node))}
      <div className="flex flex-row justify-between">
        <Button
          buttonStyle="primary"
          className="w-1/5"
          disabled={!hasMorePages(-1)}
        >
          Previous Page
        </Button>
        <Button
          buttonStyle="primary"
          className="w-1/5"
          disabled={!hasMorePages(1)}
        >
          Next Page
        </Button>
      </div>
    </>
  );
};

export default PaginatedViewer;
