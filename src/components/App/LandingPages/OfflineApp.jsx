import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import Offline from "./Offline.jsx";


export default function ComingSoonApp() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" Component={Offline}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}