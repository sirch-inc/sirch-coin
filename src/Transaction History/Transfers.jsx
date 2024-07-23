import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TransferCard from "./TransferCard";
import { AuthContext } from "../components/AuthContext";
import supabase from '../Config/supabaseConfig';


export default function Transfers() {
  const { userInTable } = useContext(AuthContext);
  const [userSentTransfers, setUserSentTransfers] = useState(null);
  const [userReceivedTransfers, setUserReceivedTransfers] = useState(null);
  
  const fetchUserSentTransfers = async (userInTable) => {
    if (userInTable){
      const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        sender:user-balances!sender_id (
          user:users!user_id (
            email
          )
        ),
        receiver:user-balances!receiver_id(
          user:users!user_id (
          email
          )
        )
      `)
      .eq('sender_id', userInTable.user_id)
      .order('created_at', {ascending: false});

      if (error) {
        // TODO: surface this error appropriately...
        alert('Error fetching users sent transfers: ', error);
      } else {
        setUserSentTransfers(data);
      }
    }
    else{
      // TODO: surface this error appropriately... 
      alert('User not found');
    }
  }

  const fetchUserReceivedTransfers = async (userInTable) => {
    if (userInTable) {
      const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        receiver:user-balances!receiver_id(
          user:users!user_id (
            email
          )
        ),
        sender:user-balances!sender_id(
          user:users!user_id(
            email
          )
        )
      `)
      .eq('receiver_id', userInTable.user_id)
      .order('created_at', {ascending: false});

      if (error){
        // TODO: surface this error appropriately...
        alert('Error fetching users received transfers', error);
      } else {
        setUserReceivedTransfers(data);
      }
    } else {
        // TODO: surface this error appropriately...
        alert('User not found');
    }
  }

  useEffect(() => {
    if (userInTable) {
      Promise.all([
        fetchUserSentTransfers(userInTable),
        fetchUserReceivedTransfers(userInTable)
      ]).then(() => {
        // TODO: do something?
      });
    }
  }, [userInTable]);

  return (
    <>
      <h3 className="page-header">Transfer History</h3>
      <div className="transfers-container">

        <h3>Sent by Me</h3>
        <div className="transfers-headers">
          <p>Date</p>
          <p>To</p>
          <p>Sirch Coins (SC)</p>
        </div>
        <div className="sent-transfers">
          { userSentTransfers ? (
            userSentTransfers.map((transfer) => (
              <TransferCard 
                key={transfer.id}
                date={transfer.created_at}
                target={transfer.receiver?.user?.email || transfer.receiver_id}
                amount={transfer.amount}
              />
          ))) :
          <p>Loading...</p>} 
        </div>
        <br></br>
        <h3>Received by Me</h3>
        <div className="transfers-headers">
          <p>Date</p>
          <p>From</p>
          <p>Sirch Coins (SC)</p>
        </div>
        <div className="received-transfers">
          { userReceivedTransfers ? (
            userReceivedTransfers.map((transfer) => (
              <TransferCard
                key={transfer.id}
                date={transfer.created_at}
                target={transfer.sender?.user?.email || transfer.sender_id}
                amount={transfer.amount}
              />
          ))) : 
          <p>Loading...</p>} 
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
