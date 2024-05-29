import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import "react-activity/dist/library.css";
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import store from './redux/store';
import {BrowserRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query'
import {ThemeProvider} from 'styled-components';
import {NotificationsProvider} from 'reapop';
import {AppNotificationsSystem} from '@components';
import ColorScheme from './constants/ColorScheme';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider>
          <BrowserRouter>
            <ThemeProvider theme={ColorScheme.LightTheme}>
              <AppNotificationsSystem />
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
