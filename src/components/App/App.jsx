import "bootstrap/dist/css/bootstrap.min.css";
import supabase from './supabaseConfig';
import { AuthProvider } from "../AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import NavBar from "./Nav";
import MainPage from "./MainPage";
import Login from "../Account/Login";
import Logout from "../Account/Logout"
import CreateAccount from "../Account/CreateAccount";
import VerifyAccount from "../Account/VerifyAccount";
import MyAccount from "../Account/MyAccount"
import Welcome from "../Account/Welcome";
import ForgotPassword from "../Account/ForgotPassword";
import ResetPassword from "../Account/ResetPassword";
import Send from "../Send";
import Balance from "../Balance";
import Purchase from "../Purchase";
import Transactions from "../TransactionHistory/Transactions";
import Help from "../Help";
import StripeSuccess from "../Stripe/StripeSuccess";
import StripeFailure from "../Stripe/StripeFailure";
import "@stripe/stripe-js";
import 'react-tooltip/dist/react-tooltip.css'



export default function App() {
  return (
    <AuthProvider supabase={supabase}>
      <BrowserRouter>
        <Header/>
        <NavBar supabase={supabase}/>
        <Routes>
          <Route path="/" Component={MainPage} supabase={supabase}/>
          <Route path="/login" Component={Login}/>
          <Route path="/logout" Component={Logout}/>
          <Route path="/create-account" Component={CreateAccount}/>
          <Route path="/verify-account" Component={VerifyAccount}/>
          <Route path="/account" Component={MyAccount}/>
          <Route path="/welcome" Component={Welcome}/>
          <Route path="/forgot-password" Component={ForgotPassword}/>
          <Route path="/reset-password" Component={ResetPassword}/>
          <Route path="coin/send" Component={Send}/>
          <Route path="coin/balance" Component={Balance}/>
          <Route path="/purchase" Component={Purchase}/>
          <Route path="/transactions" Component={Transactions}/>
          <Route path="/help" Component={Help}/>
          <Route path="/Stripe/Success/:paymentIntentId?" Component={StripeSuccess}/>
          <Route path="/Stripe/Failure" Component={StripeFailure}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
  );
}