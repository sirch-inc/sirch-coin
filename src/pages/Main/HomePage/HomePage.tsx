import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../_common/AuthContext';
import { useContext } from 'react';
import {Button} from "@heroui/react";
import './HomePage.css';

export default function HomePage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (auth?.authError) {
    navigate('/error', { replace: true });
  }

  return (
    <div className='home-page'>
      {auth?.session ? (
        <>
          <div className='right-button-container'>
            <Button 
              as={Link} 
              to='purchase' 
              className='action-btn'
            >
              Buy ⓢ
            </Button>

            <Button 
              as={Link} 
              to='coin/send' 
              className='action-btn'
            >
              Send ⓢ
            </Button>

            <Button 
              as={Link} 
              to='/transactions' 
              className='action-btn'
            >
              Transactions
            </Button>
          </div>
        </>
        ) : (
        <>
          <div className='left-button-container'>
            <Button 
              as={Link} 
              to='about' 
              className='action-btn'
            >
              About
            </Button>
          </div>

          <div className='right-button-container'>
            <Button 
              as={Link} 
              to='login' 
              className='action-btn'
            >
              Log in
            </Button>

            <Button 
              as={Link} 
              to='create-account' 
              className='action-btn'
            >
              Sign up
            </Button>
          </div>
        </>
        )
      }
    </div>
  );
}