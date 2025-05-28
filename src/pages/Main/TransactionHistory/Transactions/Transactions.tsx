import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionCard from '../TransactionCard/TransactionCard';
import { AuthContext } from '../../_common/AuthContext';
import supabase from '../../_common/supabaseProvider.js';
import { Button } from '@heroui/react';
import './Transactions.css';

interface Transaction {
  id: string;
  created_at: string;
  type: 'SENT' | 'RECEIVED' | 'PURCHASE' | 'INITIAL BALANCE';
  amount: number;
  status: string;
  details: {
    to_user_fullname?: string;
    to_user_handle?: string;
    from_user_fullname?: string;
    from_user_handle?: string;
    memo?: string;
    paymentIntentId?: string;
  };
}

export default function Transactions() {
  const auth = useContext(AuthContext);
  const userInTable = auth?.userInTable;
  const [userTransactions, setUserTransactions] = useState<Transaction[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!userInTable) return;

      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userInTable.user_id)
          .order('created_at', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }
        
        if (!data) {
          throw new Error("Fetching transactions returned no data");
        }

        setUserTransactions(data);
      } catch (exception) {
        console.error(exception);

        navigate('/error', { replace: true });
      }
    };

    if (userInTable) {
      fetchUserTransactions();
    }
  }, [userInTable, navigate]);

  return (
    <>
      <h2>Transaction History</h2>
      <div className='transactions-container'>
        <header className='transactions-header'>
          <p>Date</p>
          <p>Type</p>
          <p>Amount</p>
          <p>Status</p>
          <p>Details</p>
        </header>
        <div className='transactions'>
          {userTransactions
            ? (
                userTransactions.map((userTransaction) => (
                  <TransactionCard
                    key={userTransaction.id}
                    transaction={userTransaction}
                  />
                ))
              )
            :
            <p>Loading...</p>
          }
        </div>

        <div className='bottom-btn-container'>
        <Button 
          className='big-btn'
          onClick={() => { navigate(-1); }}>
          Back
        </Button>
      </div>
      </div>
    </>
  );
}
