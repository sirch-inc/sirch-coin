import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ComingSoon from '../ComingSoon/ComingSoon';
import './ComingSoonApp.css';

// NOTE: This page is conditionally rendered in the root.jsx file based on the VITE_IS_COMING_SOON environment variable.
export default function ComingSoonApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' Component={ComingSoon}/>
      </Routes>
    </BrowserRouter>
  );
}