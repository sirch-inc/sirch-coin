import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Offline from '../Offline/Offline.jsx';
import './OfflineApp.css';


export default function OfflineApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' Component={Offline}/>
      </Routes>
    </BrowserRouter>
  );
}