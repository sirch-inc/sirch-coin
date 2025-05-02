import './master.css';
import React from 'react';
import ReactDOM from 'react-dom/client';


// #v-ifdef VITE_IS_COMING_SOON.toLowerCase()
import ComingSoonApp from './pages/_ComingSoon/ComingSoonApp/ComingSoonApp';
// #v-elif VITE_IS_OFFLINE.toLowerCase()
import OfflineApp from './pages/_Offline/OfflineApp/OfflineApp';
// #v-else
import App from './pages/Main/App';
// #v-endif

document.title = import.meta.env.VITE_PAGE_TITLE;

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
// #v-ifdef VITE_IS_COMING_SOON.toLowerCase()
    <ComingSoonApp/>
// #v-elif VITE_IS_OFFLINE.toLowerCase()
    < OfflineApp/>
// #v-else
    < App/>
// #v-endif
  </React.StrictMode>
);