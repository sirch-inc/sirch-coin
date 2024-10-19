import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ComingSoon from './ComingSoon.jsx';


export default function ComingSoonApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={ComingSoon}/>
      </Routes>
    </BrowserRouter>
  );
}