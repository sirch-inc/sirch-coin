import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HomePage from '../HomePage';

import Login from '../Account/Login/Login';
import Logout from '../Account/Logout'
import MyAccount from '../MyAccount/MyAccount'
import CreateAccount from '../Account/CreateAccount/CreateAccount';
import VerifyAccount from '../Account/VerifyAccount/VerifyAccount';
import UpdateAccount from '../Account/UpdateAccount/UpdateAccount'
import AccountDeleted from '../Account/AccountDeleted/AccountDeleted';
import ChangePassword from '../Account/ChangePassword/ChangePassword';
import ResetPasswordRequest from '../Account/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from '../Account/ResetPassword/ResetPassword';
import Welcome from '../Account/Welcome/Welcome';

import Transactions from '../TransactionHistory/Transactions';
import Send from '../Send';
import Purchase from '../PurchaseCoins';
import StripeSuccess from '../Stripe/StripeSuccess';
import StripeFailure from '../Stripe/StripeFailure';

import About from '../About'
import TermsOfService from '../TermsOfService.jsx';
import ContactUs from '../ContactUs.jsx';

import GeneralError from './ErrorPages/GeneralError/GeneralError';


export default function MainContent({ supabase }) {
  return (
    <main className='main-content'>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={HomePage} supabase={supabase}/>
          <Route path='/*' Component={HomePage} supabase={supabase}/>

          <Route path='/login' Component={Login}/>
          <Route path='/logout' Component={Logout}/>
          <Route path='/account' Component={MyAccount}/>
          <Route path='/create-account' Component={CreateAccount}/>
          <Route path='/verify-account' Component={VerifyAccount}/>
          <Route path='/update-account' Component={UpdateAccount}/>
          <Route path='/account-deleted' Component={AccountDeleted}/>
          <Route path='/change-password' Component={ChangePassword}/>
          <Route path='/reset-password-request' Component={ResetPasswordRequest}/>
          <Route path='/reset-password' Component={ResetPassword}/>
          <Route path='/welcome' Component={Welcome}/>

          <Route path='/transactions' Component={Transactions}/>
          <Route path='coin/send' Component={Send}/>
          <Route path='/purchase' Component={Purchase}/>
          <Route path='/stripe/success/:paymentIntentId?' Component={StripeSuccess}/>
          {/* TODO: NOT sure we still need this StripeFailure component or route any more... */}
          <Route path='/stripe/failure' Component={StripeFailure}/>

          <Route path='/about' Component={About}/>
          <Route path='/terms-of-service' Component={TermsOfService}/>
          <Route path='/contact-us' Component={ContactUs}/>

          <Route path='/error' Component={GeneralError}/>
        </Routes>
      </BrowserRouter>
    </main>
  );
}