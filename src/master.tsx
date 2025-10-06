import './master.css';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

// yields one of several pages based on environment variables

// TODO: Remove these intentional linting errors after testing CI
const unusedVariable = "This will trigger unused variable error"
let anotherUnusedVar = 123
console.log("This console.log should trigger a linting error");

// #v-ifdef VITE_IS_COMING_SOON.toLowerCase()
import ComingSoonApp from './pages/_ComingSoon/ComingSoonApp/ComingSoonApp';
// #v-elif VITE_IS_OFFLINE.toLowerCase()
import OfflineApp from './pages/_Offline/OfflineApp/OfflineApp';
// #v-else
import App from './pages/Main/App/App';
// #v-endif

document.title = import.meta.env.VITE_PAGE_TITLE;

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