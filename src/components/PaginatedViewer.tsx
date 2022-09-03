import { useState } from 'react';
import { PageInfo, PaginatedEdges } from '../model/PaginatedEdges';
import Button from './Button';

interface PaginatedViewerProps {
  data: PaginatedEdges<any>;
  pageSize: number;
  render: (item: any) => JSX.Element;
  fetchMore?: (currPage: PageInfo, direction: 1 | -1) => void;
}

const PaginatedViewer = ({
  data,
  pageSize,
  render,
  fetchMore,
}: PaginatedViewerProps) => {
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const pagedData = data.edges.slice(page * pageSize, (page + 1) * pageSize);

  const hasMorePages = (direction: 1 | -1) => {
    if (isFetching) return false;
    else if (
      (page + direction >= 0 && direction === -1) ||
      (page + direction < data.edges.length / pageSize && direction === 1)
    ) {
      return true;
    }
    return false;
  };

  const changePage = (direction: 1 | -1) => {
    setPage(page + direction);
  };

  return (
    <>
      {pagedData.map((item) => render(item.node))}
      <div className="flex flex-row justify-between">
        <Button
          buttonStyle="primary"
          className="w-1/5"
          disabled={!hasMorePages(-1)}
          onClick={() => changePage(-1)}
        >
          Previous Page
        </Button>
        <Button
          buttonStyle="primary"
          className="w-1/5"
          disabled={!hasMorePages(1)}
          onClick={() => changePage(1)}
        >
          Next Page
        </Button>
      </div>
    </>
  );
};

export default PaginatedViewer;
