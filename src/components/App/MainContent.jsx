import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../HomePage';
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
import Purchase from '../Purchase';
import Transactions from '../TransactionHistory/Transactions';
import GeneralError from './ErrorPages/GeneralError';
import StripeSuccess from '../Stripe/StripeSuccess';
import StripeFailure from '../Stripe/StripeFailure';


// TODO: remove this?
export default function MainContent({ supabase }) {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={HomePage} supabase={supabase}/>
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
          <Route path='/purchase' Component={Purchase}/>
          <Route path='/transactions' Component={Transactions}/>
          <Route path='/error' Component={GeneralError}/>
          <Route path='/stripe/success/:paymentIntentId?' Component={StripeSuccess}/>
          <Route path='/stripe/failure' Component={StripeFailure}/>
        </Routes>
      </BrowserRouter>
    </main>
  );
}