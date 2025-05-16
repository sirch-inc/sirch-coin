import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SupabaseClient } from '@supabase/supabase-js';

import HomePage from '../../HomePage/HomePage.jsx';

import Login from '../../Account/Login/Login.jsx';
import Logout from '../../Account/Logout.js'
import MyAccount from '../../MyAccount/MyAccount.jsx'
import CreateAccount from '../../Account/CreateAccount/CreateAccount.jsx';
import VerifyAccount from '../../Account/VerifyAccount/VerifyAccount.jsx';
import UpdateAccount from '../../Account/UpdateAccount/UpdateAccount.jsx'
import AccountDeleted from '../../Account/AccountDeleted/AccountDeleted.jsx';
import ChangePassword from '../../Account/ChangePassword/ChangePassword.jsx';
import ResetPasswordRequest from '../../Account/ResetPasswordRequest/ResetPasswordRequest.jsx';
import ResetPassword from '../../Account/ResetPassword/ResetPassword.jsx';
import Welcome from '../../Account/Welcome/Welcome.jsx';

import Transactions from '../../TransactionHistory/Transactions/Transactions.jsx';
import Send from '../../SendCoins/SendCoins.jsx';
import Purchase from '../../PurchaseCoins/PurchaseCoins/PurchaseCoins.jsx';
import StripeSuccess from '../../PurchaseCoins/StripeSuccess/StripeSuccess.jsx';
import StripeFailure from '../../PurchaseCoins/StripeFailure/StripeFailure.jsx';

import About from '../../About/About.jsx'
import TermsOfService from '../../TermsOfService/TermsOfService.jsx';
import ContactUs from '../../ContactUs/ContactUs.jsx';

import GeneralError from '../../_common/ErrorPages/GeneralError/GeneralError.jsx';

import './MainContent.css';

interface MainContentProps {
  supabase: SupabaseClient;
}

export default function MainContent({ supabase }: MainContentProps) {
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