import { ArrowRightIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import {
  googleRefreshBearerToken,
  googleVerifyBearerToken,
} from '../../api/googleAuthService';
import { getMyYikyakUser } from '../../api/yikyakApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Button from '../../components/Button';
import NotificationContainer from '../../components/NotificationContainer';
import RadioGroup from '../../components/RadioGroup';
import TextInput from '../../components/TextInput';
import { notify } from '../../features/notificationSlice';
import {
  OnboardingStep,
  setOnboardingStep,
} from '../../features/onboardingSlice';
import { setYikYakUser } from '../../features/yikyakUserSlice';

const CredentialsOnboarding = (): JSX.Element => {
  const { existingToken, existingTokenType } = useAppSelector((state) => {
    if (state.userAuth.refreshToken) {
      return {
        existingToken: state.userAuth.refreshToken,
        existingTokenType: 'refresh',
      };
    } else {
      return {
        existingToken: state.userAuth.accessToken,
        existingTokenType: 'bearer',
      };
    }
  });

  const [token, setToken] = useState(existingToken);
  const [tokenType, setTokenType] = useState(existingTokenType);
  const [checkingCreds, setCheckingCreds] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (token.length <= 3) {
      dispatch(notify({ message: 'Token is not long enough', type: 'warn' }));
      return;
    }
    setCheckingCreds(true);

    try {
      if (tokenType === 'refresh') {
        await googleRefreshBearerToken(token);
      } else {
        await googleVerifyBearerToken(token);
      }

      const user = await getMyYikyakUser();
      dispatch(setYikYakUser(user));
      dispatch(setOnboardingStep(OnboardingStep.Location));
    } catch (ex) {
      console.error(ex);
      dispatch(
        notify({ message: 'Unable to verify your credentials.', type: 'error' })
      );
    } finally {
      setCheckingCreds(false);
    }
  };

  return (
    <>
      <NotificationContainer />
      <h2 className="text-center text-3xl font-extrabold">
        Welcome to Yak Attack
      </h2>
      <p className="text-center text-md">
        Please enter your credentials to continue.
      </p>

      <RadioGroup
        groupLabel="Token Type"
        defaultValue={tokenType}
        buttons={[
          { label: 'Bearer', value: 'bearer' },
          { label: 'Refresh', value: 'refresh' },
        ]}
        onChange={(value) => setTokenType(value)}
        className="mt-4"
      />
      <TextInput
        placeholder="Token"
        className="w-full mt-4"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />

      <Button
        buttonStyle="primary"
        className={`w-full mt-4 relative ${
          checkingCreds ? 'animate-pulse' : ''
        }`}
        onClick={handleSubmit}
        disabled={checkingCreds}
      >
        {checkingCreds ? (
          <>Checking...</>
        ) : (
          <>
            Next
            <span className="absolute right-0 inset-y-0 flex items-center pr-3">
              <ArrowRightIcon className="w-5 h-5" />
            </span>
          </>
        )}
      </Button>
    </>
  );
};

export default CredentialsOnboarding;
