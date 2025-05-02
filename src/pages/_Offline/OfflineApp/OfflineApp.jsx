import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Offline from '../Offline/Offline';
import './OfflineApp.css';

// NOTE: This page is conditionally rendered in the root.jsx file based on the VITE_IS_OFFLINE environment variable.
export default function OfflineApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' Component={Offline}/>
      </Routes>
    </BrowserRouter>
  );
}