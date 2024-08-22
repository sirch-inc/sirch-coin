import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";
import ComingSoon from "./ComingSoon.jsx";


export default function ComingSoonApp() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" Component={ComingSoon}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}