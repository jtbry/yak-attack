import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid';
import { LatLng } from 'leaflet';
import { Marker } from 'react-leaflet';
import { getLocationStrFromLatLng } from '../../api/nominatimApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Button from '../../components/Button';
import LeafletMap from '../../components/LeafletMap';
import LocationSearch from '../../components/MapAddons/LocationSearch';
import LocatorControl from '../../components/MapAddons/LocatorControl';
import PointSelector from '../../components/MapAddons/PointSelector';
import NotificationContainer from '../../components/NotificationContainer';
import {
  setLocationPoint,
  setLocationString,
} from '../../features/locationSlice';
import { notify } from '../../features/notificationSlice';
import {
  OnboardingStep,
  setOnboardingStep,
} from '../../features/onboardingSlice';

const LocationOnboarding = (): JSX.Element => {
  const location = useAppSelector((state) => state.location);
  const dispatch = useAppDispatch();

  const setLocationDetails = async (point: LatLng) => {
    try {
      const locationString = await getLocationStrFromLatLng(point);
      dispatch(setLocationPoint(point));
      dispatch(setLocationString(locationString));
    } catch (e) {
      console.error(e);
      dispatch(setLocationPoint(point));
      dispatch(setLocationString('Error'));
    }
  };

  return (
    <>
      <NotificationContainer />
      <h2 className="text-center text-3xl font-extrabold">Feed Location</h2>
      <p className="text-center text-md">
        What location would you like to use YikYak from?
      </p>
      <p className="text-center text-sm">
        Don't worry, you can change this later.
      </p>

      <LeafletMap
        className="h-96 w-full mt-4 rounded-md"
        center={location.point}
        zoom={4}
      >
        <PointSelector onChange={(point) => setLocationDetails(point)} />
        <LocationSearch
          onResultClicked={(result) =>
            setLocationDetails(new LatLng(result.lat, result.lon))
          }
        />
        <LocatorControl
          onLocate={(point) => setLocationDetails(point)}
          onFailedLocate={() =>
            dispatch(notify({ message: 'Unable to locate', type: 'error' }))
          }
        />

        <Marker position={location.point} />
      </LeafletMap>

      <Button
        buttonStyle="primary"
        className={`w-full mt-4 relative`}
        disabled={location === null}
        onClick={() => dispatch(setOnboardingStep(OnboardingStep.Done))}
      >
        Next
        <span className="absolute right-0 inset-y-0 flex items-center pr-3">
          <ArrowRightIcon className="w-5 h-5" />
        </span>
      </Button>
      <Button
        buttonStyle="danger"
        className={`w-full mt-4 relative`}
        onClick={() => dispatch(setOnboardingStep(OnboardingStep.Credentials))}
      >
        Go Back
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <ArrowLeftIcon className="w-5 h-5" />
        </span>
      </Button>
    </>
  );
};

export default LocationOnboarding;
