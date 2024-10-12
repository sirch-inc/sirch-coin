import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/App/App.css';
// #v-ifdef VITE_IS_COMING_SOON
import ComingSoonApp from './components/App/LandingPages/ComingSoonApp';
// #v-elif VITE_IS_OFFLINE
import OfflineApp from './components/App/LandingPages/OfflineApp';
// #v-else
import App from './components/App/App';
// #v-endif


document.title = import.meta.env.VITE_PAGE_TITLE;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
// #v-ifdef VITE_IS_COMING_SOON
    <ComingSoonApp/>
// #v-elif VITE_IS_OFFLINE
  < OfflineApp/>
// #v-else
  < App/>
// #v-endif
  </React.StrictMode>
);

