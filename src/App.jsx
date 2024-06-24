import "bootstrap/dist/css/bootstrap.min.css";
import supabase from './Config/supabaseConfig'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Nav";
import { AuthProvider } from "./components/AuthContext";
import MainPage from "./MainPage";
import Login from "./components/Account/Login";
import Logout from "./components/Account/Logout"
import CreateAccount from "./components/Account/CreateAccount";
import VerifyAccount from "./components/Account/VerifyAccount";
import Welcome from "./components/Account/Welcome";
import ForgotPassword from "./components/Account/ForgotPassword";
import ResetPassword from "./components/Account/ResetPassword";
import Send from "./components/Send";
import Balance from "./components/Balance";
import Purchase from "./components/Purchase";
import Transactions from "./components/Transactions";
import Preferences from "./components/Preferences";
import Help from "./components/Help";
import Faucet from "./components/Admin/Faucet";
import StripeSuccess from "./components/Stripe/StripeSuccess";
import StripeFailure from "./components/Stripe/StripeFailure";
import "@stripe/stripe-js";


export default function App() {
  return (
    <AuthProvider supabase={supabase} >
      <BrowserRouter>
        <NavBar supabase={supabase} />
        <Routes>
          <Route path="/" Component={MainPage}/>
          <Route path="/supabase-login" Component={Login}/>
          <Route path="/supabase-logout" Component={Logout}/>
          <Route path="/create-account" Component={CreateAccount}/>
          <Route path="/verify-account" Component={VerifyAccount}/>
          <Route path="/welcome" Component={Welcome}/>
          <Route path="/forgot-password" Component={ForgotPassword}/>
          <Route path="/reset-password" Component={ResetPassword}/>
          <Route path="coin/send" Component={Send}/>
          <Route path="coin/balance" Component={Balance}/>
          <Route path="/purchase" Component={Purchase}/>
          <Route path="/transactions" Component={Transactions}/>
          <Route path="/preferences" Component={Preferences}/>
          <Route path="/help" Component={Help}/>
          <Route path="/admin/faucet" Component={Faucet}/>
          <Route path="/Stripe/Success" Component={StripeSuccess}/>
          <Route path="/Stripe/Failure" Component={StripeFailure}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
