import "bootstrap/dist/css/bootstrap.min.css";
import supabase from './Config/supabaseConfig'
import { AuthProvider } from "./components/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NavBar from "./Nav";
import MainPage from "./MainPage";
import Login from "./components/Account/Login";
import Logout from "./components/Account/Logout"
import CreateAccount from "./components/Account/CreateAccount";
import VerifyAccount from "./components/Account/VerifyAccount";
import MyAccount from "./components/Account/MyAccount"
import Welcome from "./components/Account/Welcome";
import ForgotPassword from "./components/Account/ForgotPassword";
import ResetPassword from "./components/Account/ResetPassword";
import Send from "./components/Send";
import Balance from "./components/Balance";
import Purchase from "./components/Purchase";
import Transactions from "./components/TransactionHistory/Transactions";
import Preferences from "./components/Preferences";
import Help from "./components/Help";
import StripeSuccess from "./components/Stripe/StripeSuccess";
import StripeFailure from "./components/Stripe/StripeFailure";
import "@stripe/stripe-js";


export default function App() {
  return (
    <AuthProvider supabase={supabase}>
      <BrowserRouter>
        <Header/>
        <NavBar supabase={supabase}/>
        <Routes>
          <Route path="/" Component={MainPage}/>
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
          <Route path="/preferences" Component={Preferences}/>
          <Route path="/help" Component={Help}/>
          <Route path="/Stripe/Success/:paymentIntentId?" Component={StripeSuccess}/>
          <Route path="/Stripe/Failure" Component={StripeFailure}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
  );
}
