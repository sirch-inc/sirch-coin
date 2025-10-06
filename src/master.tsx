import './master.css';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

// yields one of several pages based on environment variables

// #v-ifdef VITE_IS_COMING_SOON.toLowerCase()
import ComingSoonApp from './pages/_ComingSoon/ComingSoonApp/ComingSoonApp';
// #v-elif VITE_IS_OFFLINE.toLowerCase()
import OfflineApp from './pages/_Offline/OfflineApp/OfflineApp';
// #v-else
import App from './pages/Main/App/App';
// #v-endif

document.title = import.meta.env.VITE_PAGE_TITLE;

// TODO: Remove these intentional TypeScript errors after CI testing
const testNumber: string = 123; // Type error: number assigned to string
const testObj = { name: 'test' };
console.log(testObj.nonExistentProperty); // Type error: property doesn't exist

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

/* eslint-disable react/jsx-no-comment-textnodes */
root.render(
  <StrictMode>
// #v-ifdef VITE_IS_COMING_SOON.toLowerCase()
    <ComingSoonApp/>
// #v-elif VITE_IS_OFFLINE.toLowerCase()
    < OfflineApp/>
// #v-else
    <App/>
// #v-endif
  </StrictMode>
);