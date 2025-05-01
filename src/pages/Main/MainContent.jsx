import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HomePage from '../../components/HomePage.jsx';

import Login from '../../components/Account/Login/Login.jsx';
import Logout from '../../components/Account/Logout.js'
import MyAccount from './MyAccount/MyAccount.jsx'
import CreateAccount from '../../components/Account/CreateAccount/CreateAccount.jsx';
import VerifyAccount from '../../components/Account/VerifyAccount/VerifyAccount.jsx';
import UpdateAccount from '../../components/Account/UpdateAccount/UpdateAccount.jsx'
import AccountDeleted from '../../components/Account/AccountDeleted/AccountDeleted.jsx';
import ChangePassword from '../../components/Account/ChangePassword/ChangePassword.jsx';
import ResetPasswordRequest from '../../components/Account/ResetPasswordRequest/ResetPasswordRequest.jsx';
import ResetPassword from '../../components/Account/ResetPassword/ResetPassword.jsx';
import Welcome from '../../components/Account/Welcome/Welcome.jsx';

import Transactions from '../../components/TransactionHistory/Transactions.jsx';
import Send from '../../components/Send.jsx';
import Purchase from '../../components/PurchaseCoins.jsx';
import StripeSuccess from '../../components/Stripe/StripeSuccess.jsx';
import StripeFailure from '../../components/Stripe/StripeFailure.jsx';

import About from './About.jsx'
import TermsOfService from '../../components/TermsOfService.jsx';
import ContactUs from '../../components/ContactUs.jsx';

import GeneralError from './App/ErrorPages/GeneralError/GeneralError.jsx';


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