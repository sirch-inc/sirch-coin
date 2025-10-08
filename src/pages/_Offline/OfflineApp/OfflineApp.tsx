import {HeroUIProvider} from "@heroui/react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Offline from '../Offline/Offline';

// NOTE: This page is conditionally rendered in the master.jsx file based on the VITE_IS_OFFLINE environment variable.
export default function OfflineApp() {
  return (
    <HeroUIProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/*' Component={Offline}/>
        </Routes>
      </BrowserRouter>
    </HeroUIProvider>
  );
}