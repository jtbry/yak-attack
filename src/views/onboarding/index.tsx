import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { OnboardingStep } from '../../features/onboardingSlice';
import { FEED_VIEW } from '../../utils/constants';
import CredentialsOnboarding from './CredentialsOnboarding';
import LocationOnboarding from './LocationOnboarding';

const OnboardingView = (): JSX.Element => {
  const onboardingStep = useAppSelector((state) => state.onboarding.step);

  let content = null;
  if (onboardingStep === OnboardingStep.Credentials) {
    content = <CredentialsOnboarding />;
  } else if (onboardingStep === OnboardingStep.Location) {
    content = <LocationOnboarding />;
  } else {
    content = <Navigate to={FEED_VIEW} />;
  }

  return (
    <div className="min-h-full flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mb-16">{content}</div>
    </div>
  );
};

export default OnboardingView;
