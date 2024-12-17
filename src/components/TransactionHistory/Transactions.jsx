import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import TransactionCard from './TransactionCard';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseProvider';


export default function Transactions() {
  const { userInTable } = useContext(AuthContext);
  const [userTransactions, setUserTransactions] = useState(null);
  const navigate = useNavigate();

  const fetchUserTransactions = async (userInTable) => {
    if (!userInTable) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userInTable.user_id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error);
      }
      
      if (!data) {
        throw new Error("Fetching transactions returned no data");
      }

      setUserTransactions(data);
    } catch (exception) {
      console.error(exception);

      navigate('/error', { replace: true });
    }
  }

  useEffect(() => {
    if (userInTable) {
      fetchUserTransactions(userInTable);
    }
  }, [userInTable]);

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

        <div className='bottom-btn-container-light'>
          <Link to='/' className='big-btn'>
            Back
          </Link>
        </div>
      </div>
    </>
  );
}
