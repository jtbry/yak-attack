import { LocationMarkerIcon, RewindIcon } from '@heroicons/react/solid';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { OnboardingStep, setOnboardingStep } from '../features/onboardingSlice';
import { MY_PROFILE_VIEW } from '../utils/constants';
import YikyakAvatar from './YikyakAvatar';

const AppContainer = (): JSX.Element => {
  const currentRoute = useLocation();
  const navigate = useNavigate();
  const yikyakUser = useAppSelector((state) => state.yikyakUser);
  const location = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();

  return (
    <div className="mx-4 md:mx-auto max-w-7xl mb-4">
      <div className="my-5 p-2 flex justify-between bg-gray-200 dark:bg-zinc-800 rounded-sm items-center sticky top-0">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate(MY_PROFILE_VIEW)}
        >
          {yikyakUser && (
            <YikyakAvatar emoji={yikyakUser.emoji} color={yikyakUser.color} />
          )}
          <p className="text-lg font-bold ml-3 hidden md:block">
            <span className="text-teal-500">{yikyakUser?.yakarmaScore}</span>{' '}
            Yakarma
          </p>
        </div>
        <div
          className="flex flex-row bg-teal-500 rounded-md p-2 cursor-pointer hover:bg-teal-600 items-center"
          onClick={() => dispatch(setOnboardingStep(OnboardingStep.Location))}
        >
          <LocationMarkerIcon className="w-6 h-6 mr-1" />
          <p className="font-bold">{location.displayName}</p>
        </div>
      </div>
      {currentRoute.pathname !== '/' && (
        <h3
          className="inline-flex items-center font-semibold cursor-pointer hover:text-teal-500 align-middle"
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
