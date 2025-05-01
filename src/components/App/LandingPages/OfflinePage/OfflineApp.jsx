import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Offline from './Offline.jsx';


export default function ComingSoonApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' Component={Offline}/>
      </Routes>
    </BrowserRouter>
  );
}