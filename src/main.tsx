import { ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { yikyakApolloClient } from './api/yikyakApi';
import App from './App';
import { persistor, store } from './app/store';
import LoadingSpinner from './components/LoadingSpinner';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <LoadingSpinner className="grid place-items-center" size="w-6 h-6" />
        }
        persistor={persistor}
      >
        <ApolloProvider client={yikyakApolloClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApolloProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
