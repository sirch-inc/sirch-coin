import 'bootstrap/dist/css/bootstrap.min.css';
import supabase from './supabaseConfig';
import { AuthProvider } from '../AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import NavBar from './Nav';
import MainPage from './MainPage';
import About from '../About'
import Login from '../Account/Login';
import Logout from '../Account/Logout'
import MyAccount from '../Account/MyAccount'
import CreateAccount from '../Account/CreateAccount';
import VerifyAccount from '../Account/VerifyAccount';
import UpdateAccount from '../Account/UpdateAccount'
import ForgotPassword from '../Account/ForgotPassword';
import ResetPassword from '../Account/ResetPassword';
import Welcome from '../Account/Welcome';
import AccountDeleted from '../Account/AccountDeleted';
import Send from '../Send';
import Balance from '../Balance';
import Purchase from '../Purchase';
import Transactions from '../TransactionHistory/Transactions';
import GeneralError from './ErrorPages/GeneralError';
import StripeSuccess from '../Stripe/StripeSuccess';
import StripeFailure from '../Stripe/StripeFailure';
import '@stripe/stripe-js';
import 'react-tooltip/dist/react-tooltip.css'


// TODO: remove this before PROD release
if (import.meta.env.MODE === 'production') {
  alert("PRE-ALPHA WARNING:\n\nThis is a pre-alpha public production Sirch Coin site.\n\n\
    Transactions are real and recorded.\n\n\
    You must use real credit cards for purchases at this time, which will be processed and debited.\n\n\
    If you require additional support or adjustments to your balance or transaction history, please contact the dev team."
  );
}

export default function App() {
  return (
    <AuthProvider supabase={supabase}>
      <BrowserRouter>
        <Header/>
        <NavBar supabase={supabase}/>
        <Routes>
          <Route path='/' Component={MainPage} supabase={supabase}/>
          <Route path='/user-deleted' Component={AccountDeleted}/>
          <Route path='/login' Component={Login}/>
          <Route path='/logout' Component={Logout}/>
          <Route path='/account' Component={MyAccount}/>
          <Route path='/create-account' Component={CreateAccount}/>
          <Route path='/verify-account' Component={VerifyAccount}/>
          <Route path='/update-account' Component={UpdateAccount}/>
          <Route path='/welcome' Component={Welcome}/>
          <Route path='/about' Component={About}/>
          <Route path='/forgot-password' Component={ForgotPassword}/>
          <Route path='/reset-password' Component={ResetPassword}/>
          <Route path='coin/send' Component={Send}/>
          <Route path='coin/balance' Component={Balance}/>
          <Route path='/purchase' Component={Purchase}/>
          <Route path='/transactions' Component={Transactions}/>
          <Route path='/error' Component={GeneralError}/>
          <Route path='/stripe/success/:paymentIntentId?' Component={StripeSuccess}/>
          <Route path='/stripe/failure' Component={StripeFailure}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
  );
}