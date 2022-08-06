import Spinner from './Spinner';

const PageLoader = (): JSX.Element => {
  return (
    <div className="grid h-screen place-items-center">
      <Spinner className="w-24 h-24" />
    </div>
  );
};

export default PageLoader;
