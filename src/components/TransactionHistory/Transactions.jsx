import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TransactionCard from './TransactionCard';
import { AuthContext } from '../AuthContext';
import supabase from '../App/supabaseConfig';


export default function Transactions() {
  const { userInTable } = useContext(AuthContext);
  const [userTransactions, setUserTransactions] = useState(null);
  
  const fetchUserTransactions = async (userInTable) => {
    if (userInTable){
      const { data, error } = await supabase
      .from('transactions')
      .select('*')
      // FIXME: handle fetching other named columns via our foreign-keys
      // .select(`
      //   *,
      //   user:balances!user_id (
      //     user:users!user_id (email)
      //   )
      // `)
      .eq('user_id', userInTable.user_id)
      .order('created_at', {ascending: false});

      if (error) {
        // TODO: surface this error appropriately...
        alert("Error fetching users transactions:\n" + error);
      } else {
        setUserTransactions(data);
      }
    }
    else{
      // TODO: surface this error appropriately... 
      alert('User not found');
    }
  }

  useEffect(() => {
    if (userInTable) {
      fetchUserTransactions(userInTable);
    }
  }, [userInTable]);


  const getTransactionDetails = (transaction) => {
    switch (transaction.type) {
      case 'SENT':
      case 'RECEIVED':
        return `Memo: ${transaction.details.email || ''}`;
      case 'PURCHASE':
        return `Payment Intent ID: ${transaction.details.paymentIntentId || ''}`;
      case 'INITIAL BALANCE':
        return 'Welcome!';
      default:
        return ``;
    }
  };
  
  return (
    <>
      <h2>Transaction History</h2>
      <div className='transactions-container'>
        <div className='transactions-header'>
          <p>Date</p>
          <p>Type</p>
          <p>Sirch Coins</p>
          <p>Status</p>
          <p>Details</p>
        </div>
        <div className='transactions'>
          { userTransactions
            ? (
                userTransactions.map((userTransaction) => (
                  <TransactionCard 
                    key={userTransaction.id}
                    date={userTransaction.created_at}
                    type={userTransaction.type}
                    amount={userTransaction.amount}
                    status={userTransaction.status}
                    details={getTransactionDetails(userTransaction)} 
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
