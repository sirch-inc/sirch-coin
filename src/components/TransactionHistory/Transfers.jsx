import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TransferCard from "./TransferCard";
import { AuthContext } from "../AuthContext";
import supabase from '../../Config/supabaseConfig';


export default function Transfers() {
  const { userInTable } = useContext(AuthContext);
  const [userTransactions, setUserTransactions] = useState(null);
  // const [userReceivedTransfers, setUserReceivedTransfers] = useState(null);
  
  const fetchUserTransactions = async (userInTable) => {
    if (userInTable){
      const { data, error } = await supabase
      .from('transactions')
      .select('*')
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
        alert('Error fetching users transactions: ', error);
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
      // JEFF: remove this promise?
      Promise.all([
        fetchUserTransactions(userInTable)
      ]).then(() => {
        // TODO: do something?
      });
    }
  }, [userInTable]);

  return (
    <>
      <h3 className="page-header">Transaction History</h3>
      <div className="transfers-container">

        <h3>Sent by Me</h3>
        <div className="transfers-headers">
          <p>Date</p>
          <p>Type</p>
          <p>Sirch Coins</p>
          <p>Status</p>
          <p>Details</p>
        </div>
        <div className="sent-transfers">
          { userTransactions ? (
            userTransactions.map((userTransaction) => (
              <TransferCard 
                key={userTransaction.id}
                id={userTransaction.id}
                date={userTransaction.created_at}
                type={userTransaction.type}
                amount={userTransaction.amount}
                status={userTransaction.status}
              />
          ))) :
          <p>Loading...</p>
          } 
        </div>        
        <div className="bottom-btn-container">
          <Link to="/" className="big-btn-red">
            Back
          </Link>
        </div>
      </div>
    </>
  );
}
