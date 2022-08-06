import PageLoader from './PageLoader';

interface DataLoaderPreviewProps {
  loading: any;
  error: any;
}

const DataLoaderPreview = ({ loading, error }: DataLoaderPreviewProps) => {
  if (loading) {
    return <PageLoader />;
  }
  if (error) {
    console.error(error);
    return <h1 className="text-red-500">Error</h1>;
  }
  return <></>;
};

export default DataLoaderPreview;
