import {
  CollectionIcon,
  LocationMarkerIcon,
  MapIcon,
  RewindIcon,
} from '@heroicons/react/solid';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { OnboardingStep, setOnboardingStep } from '../features/onboardingSlice';
import { FEED_VIEW, LIVE_MAP_VIEW, MY_PROFILE_VIEW } from '../utils/constants';
import Button from './Button';
import YikyakAvatar from './YikyakAvatar';

const nav = [
  {
    label: 'Feed',
    path: FEED_VIEW,
    icon: <CollectionIcon className="w-6 h-6" />,
  },
  {
    label: 'Live Map',
    path: LIVE_MAP_VIEW,
    icon: <MapIcon className="w-6 h-6" />,
  },
];

const AppContainer = (): JSX.Element => {
  const currentRoute = useLocation();
  const navigate = useNavigate();
  const yikyakUser = useAppSelector((state) => state.yikyakUser);
  const location = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();

  return (
    <div className="mx-4 md:mx-auto max-w-7xl mb-4">
      <div className="my-5 p-2 flex justify-between bg-slate-800 border border-slate-700 rounded items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(MY_PROFILE_VIEW)}
        >
          {yikyakUser && (
            <YikyakAvatar emoji={yikyakUser.emoji} color={yikyakUser.color} />
          )}
        </div>
        <div className="space-x-2 flex flex-row items-center">
          {nav.map((item) => (
            <span
              className={`${
                item.path === currentRoute.pathname
                  ? 'font-bold text-blue-400'
                  : 'hover:text-blue-500'
              } cursor-pointer`}
              key={item.path}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
            </span>
          ))}
        </div>
        <Button
          buttonStyle="primary"
          className="flex flex-row items-center"
          onClick={() => dispatch(setOnboardingStep(OnboardingStep.Location))}
        >
          <LocationMarkerIcon className="w-6 h-6 mr-1" />
          <p className="font-bold">{location.displayName}</p>
        </Button>
      </div>
      {!nav.some((i) => i.path == currentRoute.pathname) && (
        <h3
          className="inline-flex items-center font-semibold cursor-pointer hover:text-blue-400 align-middle"
          onClick={() => navigate(-1)}
        >
          <RewindIcon className="w-5 h-5 mr-1" />
          Go Back
        </h3>
      )}
      <Outlet />
    </div>
  );
};

export default AppContainer;
