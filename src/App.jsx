import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@stripe/stripe-js";
import NavBar from "./Nav";
import "bootstrap/dist/css/bootstrap.min.css";
import SendCoin from "./components/SendCoin";
import MainPage from "./MainPage";
import CoinBalance from "./components/CoinBalance";
import DepositForm from "./components/DepositForm";
import Preferences from "./components/Preferences";
import TransferHistory from "./components/TransferHistory";
import Help from "./components/Help";
import Login from "./components/Users/Login";
import success from "./components/Stripe/success";
import Failure from "./components/Stripe/Failure";
import supabase from './Config/supabaseClient'

export default function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" Component={MainPage} />
        <Route path="login" Component={Login} />
        <Route path="coin/send" Component={SendCoin} />
        <Route path="coin/balance" Component={CoinBalance} />
        <Route path="/checkout" Component={DepositForm} />
        <Route path="/preferences" Component={Preferences} />
        <Route path="/transferhistory" Component={TransferHistory} />
        <Route path="/help" Component={Help} />
        <Route path="/Stripe/success" Component={success} />
        <Route path="/Stripe/Failure" Component={Failure} />
      </Routes>
    </BrowserRouter>
  );
}
