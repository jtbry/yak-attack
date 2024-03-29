import { Route, Routes } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import AppContainer from './components/AppContainer';
import { OnboardingStep } from './features/onboardingSlice';
import './index.css';
import {
  FEED_VIEW,
  LIVE_MAP_VIEW,
  MY_PROFILE_VIEW,
  POST_VIEW,
  SEARCH_VIEW,
} from './utils/constants';
import FeedView from './views/FeedView';
import LiveMapView from './views/LiveMapView';
import MyProfileView from './views/MyProfileView';
import OnboardingView from './views/onboarding';
import PostView from './views/PostView';
import SearchView from './views/SearchView';

function App() {
  const onboardingStep = useAppSelector((state) => state.onboarding.step);

  if (onboardingStep !== OnboardingStep.Done) {
    return <OnboardingView />;
  } else {
    return (
      <Routes>
        <Route path="/" element={<AppContainer />}>
          <Route path={FEED_VIEW} element={<FeedView />} />
          <Route path={POST_VIEW} element={<PostView />} />
          <Route path={MY_PROFILE_VIEW} element={<MyProfileView />} />
          <Route path={LIVE_MAP_VIEW} element={<LiveMapView />} />
          <Route path={SEARCH_VIEW} element={<SearchView />} />
          <Route path="*" element={<FeedView />} />
        </Route>
      </Routes>
    );
  }
}

export default App;
