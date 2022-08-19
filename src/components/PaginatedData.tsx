import { useState } from 'react';
import { PageInfo, PaginatedEdges } from '../model/PaginatedEdges';
import Button from './Button';

interface PaginatedDataProps {
  data: PaginatedEdges<any>;
  pageSize: number;
  startPage?: number;
  render: (item: any) => JSX.Element;
  fetchMore: (direction: -1 | 1, page: PageInfo) => void;
  onChange?: (page: number) => void;
}

const PaginatedData = ({
  data,
  pageSize,
  render,
  fetchMore,
  startPage,
  onChange,
}: PaginatedDataProps) => {
  const [page, setPage] = useState(startPage ?? 0);

  const canChangePage = (direction: -1 | 1) => {
    if (direction > 0) {
      return page < Math.ceil(data.edges.length / pageSize) - 1;
    } else {
      return page > 0;
    }
  };

  const changePage = (direction: -1 | 1) => {
    if (canChangePage(direction)) {
      setPage(page + direction);
      if (onChange) onChange(page + direction);
    } else {
      fetchMore(direction, data.pageInfo);
      setPage(0);
      if (onChange) onChange(0);
    }
  };

  return (
    <>
      {data.edges
        .slice(pageSize * page, pageSize * (page + 1))
        .map((edge) => render(edge.node))}
      <div className="flex flex-row justify-between">
        <Button
          onClick={() => changePage(-1)}
          // disabled={!canChangePage(-1) && !canFetchMore(-1)}
          buttonStyle="primary"
          className="w-1/5"
        >
          Previous Page
        </Button>
        <Button
          onClick={() => changePage(1)}
          // disabled={!canChangePage(1) && !canFetchMore(1)}
          buttonStyle="primary"
          className="w-1/5"
        >
          Next Page
        </Button>
      </div>
    </>
  );
};

export default PaginatedData;
