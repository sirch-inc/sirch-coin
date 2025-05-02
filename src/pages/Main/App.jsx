import 'bootstrap/dist/css/bootstrap.min.css';
import supabase from './_common/supabaseProvider';
import { AuthProvider } from './_common/AuthContext';
import Header from './Header/Header';
import MainContent from './MainContent';
import Footer from './Footer/Footer';
import '@stripe/stripe-js';
import 'react-tooltip/dist/react-tooltip.css'


// TODO: remove this before PROD release
if (import.meta.env.MODE === 'production') {
  alert("PRE-ALPHA WARNING:\n\nThis is a pre-alpha public production Sirch Coin site.\n\n\
    Transactions are real and recorded.\n\n\
    You must use real credit cards for purchases at this time, which will be processed and debited.\n\n\
    If you require additional support or adjustments to your balance or transaction history, please contact Sirch."
  );
}

export default function App() {
  return (
    <AuthProvider supabase={supabase}>
      <div className='app-layout'>
        <Header supabase={supabase}/>
        <MainContent supabase={supabase}/>
        <Footer/>
      </div>
    </AuthProvider>
  );
}