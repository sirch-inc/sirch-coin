import { Route, Routes } from 'react-router-dom';
import { SupabaseClient } from '@supabase/supabase-js';

import HomePage from '../../HomePage/HomePage';
import Login from '../../Account/Login/Login';
import MyAccount from '../../MyAccount/MyAccount';
import CreateAccount from '../../Account/CreateAccount/CreateAccount';
import VerifyAccount from '../../Account/VerifyAccount/VerifyAccount';
import UpdateAccount from '../../Account/UpdateAccount/UpdateAccount';
import AccountDeleted from '../../Account/AccountDeleted/AccountDeleted';
import ChangePassword from '../../Account/ChangePassword/ChangePassword';
import ResetPasswordRequest from '../../Account/ResetPasswordRequest/ResetPasswordRequest';
import ResetPassword from '../../Account/ResetPassword/ResetPassword';
import Welcome from '../../Account/Welcome/Welcome';

import Transactions from '../../TransactionHistory/Transactions/Transactions';
import Send from '../../SendCoins/SendCoins';
import Purchase from '../../PurchaseCoins/PurchaseCoins/PurchaseCoins';
import StripeSuccess from '../../PurchaseCoins/StripeSuccess/StripeSuccess';
import StripeFailure from '../../PurchaseCoins/StripeFailure/StripeFailure';

import About from '../../About/About';
import TermsOfService from '../../TermsOfService/TermsOfService';
import ContactUs from '../../ContactUs/ContactUs';

import GeneralError from '../../_common/ErrorPages/GeneralError/GeneralError';

import './MainContent.css';

interface MainContentProps {
  supabase: SupabaseClient;
}

export default function MainContent({ supabase }: MainContentProps) {
  return (
    <main className='main-content'>
        <Routes>
          <Route path='/' element={<HomePage supabase={supabase} />}/>
          <Route path='/*' element={<HomePage supabase={supabase} />}/>

          <Route path='/login' Component={Login}/>
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
    </main>
  );
}