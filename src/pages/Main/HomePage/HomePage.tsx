import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { useContext } from 'react';
import {Button} from "@heroui/react";
import './HomePage.css';
import { SupabaseClient } from '@supabase/supabase-js';

interface HomePageProps {
  supabase: SupabaseClient;
}

export default function HomePage({ supabase }: HomePageProps) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      navigate('/error', { replace: true });
    }
  }

  if (auth?.authError) {
    navigate('/error', { replace: true });
  }

  return (
    <div className='home-page'>
      {auth?.session ? (
        <>
          <div className='left-button-container'>
          <Button 
            as={Link} 
            to='account' 
            className='action-btn'
          >
            My Account
          </Button>

            <Link to='#' className='action-btn' onClick={handleLogout}>
              Log Out
            </Link>
          </div>

          <div className='right-button-container'>
          <Link to='purchase' className='action-btn'>
              Buy ⓢ
            </Link>

            <Link to='coin/send' className='action-btn'>
              Send ⓢ
            </Link>

            <Link to='/transactions' className='action-btn'>
              Transactions
            </Link>
          </div>
        </>
        ) : (
        <>
          <div className='left-button-container'>
            <Link to='about' className='action-btn'>
              About
            </Link>
          </div>

          <div className='right-button-container'>
            <Link to='login' className='action-btn'>
              Log in
            </Link>

            <Link to='create-account' className='action-btn'>
              Sign up
            </Link>
          </div>
        </>
        )
      }
    </div>
  );
}