import { PaginatedEdges } from '../model/PaginatedEdges';

interface PaginatedViewerProps {
  data: PaginatedEdges<any>;
  render: (item: any) => JSX.Element;
}

const PaginatedViewer = ({ data, render }: PaginatedViewerProps) => {
  return <>{data.edges.map((item) => render(item.node))}</>;
};

export default PaginatedViewer;
