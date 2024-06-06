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
import success from "./components/Stripe/success";
import Failure from "./components/Stripe/Failure";
import supabase from './Config/supabaseConfig'
import CreateAccount from "./components/CreateAccount";
import VerifyAccount from "./components/VerifyAccount";
import ForgotPassword from "./components/ForgotPassword";
import UpdatePassword from "./components/UpdatePassword";
import LoginSupabase from "./components/LoginSupabase";
import LogoutSupabase from "./components/LogoutSupabase"
import CoinFaucetDeposit from "./components/CoinFaucetDeposit";
import { AuthProvider } from "./components/AuthContext";

export default function App() {

  return (
    
    <AuthProvider supabase={supabase} >
      <BrowserRouter>
        <NavBar supabase={supabase} />
        <Routes>
          <Route path="/" Component={MainPage} />
          <Route path="/create-account" Component={CreateAccount} />
          <Route path="/verify-account" Component={VerifyAccount} />
          <Route path="/forgot-password" Component={ForgotPassword} />
          <Route path="/update-password" Component={UpdatePassword} />
          <Route path="/supabase-login" Component={LoginSupabase}/>
          <Route path="/supabase-logout" Component={LogoutSupabase}/>
          <Route path="coin/send" Component={SendCoin} />
          <Route path="coin/balance" Component={CoinBalance} />
          <Route path="/coin-faucet" Component={CoinFaucetDeposit}/>
          <Route path="/checkout" Component={DepositForm} />
          <Route path="/preferences" Component={Preferences} />
          <Route path="/transferhistory" Component={TransferHistory} />
          <Route path="/help" Component={Help} />
          <Route path="/Stripe/success" Component={success} />
          <Route path="/Stripe/Failure" Component={Failure} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
