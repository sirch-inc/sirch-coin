import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TransactionCard from "./TransactionCard";
import { AuthContext } from "./AuthContext";
import supabase from '../Config/supabaseConfig';

export default function Transactions() {
  const { userInTable } = useContext(AuthContext);
  const [userSentTransactions, setUserSentTransactions] = useState(null);
  const [userReceivedTransactions, setUserReceivedTransactions] = useState(null);

  const fetchUserSentTransactions = async (userInTable) => {
    if (userInTable){
      const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq('sender_id', userInTable.user_id);

      if (error) {
        //TODO: handle error
        alert('Error fetching users sent transactions: ', error);
      } else {
        console.log(data);
        setUserSentTransactions(data);
      }
    }
    else{
      // alert('User not found.');
      console.log("No user in table");
    }
  }

  const fetchUserReceivedTransactions = async (userInTable) => {
    if (userInTable) {
      const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq('receiver_id', userInTable.user_id);

      if (error){
        //TODO: handle error 
        alert('Error fetching users received transactions', error);
      } else {
        console.log(data);
        setUserReceivedTransactions(data);
      }
    } else {
      // alert('User not found.');
      console.log("No user in table");
    }
  }


  useEffect(() => {
    // (Re)fetch the user's balance when the component mounts
    fetchUserSentTransactions(userInTable);
    fetchUserReceivedTransactions(userInTable);
  }, [userInTable]);
  

  return (
    <>
      <h3 className="page-header">Transaction History</h3>
      <div className="balance-container">
        <p className="page-text">
          Your transactions:
        </p>

        <div className="sent-transactions">
          <p>Sent Transactions: </p>
          { userSentTransactions ? (
            userSentTransactions.map((singleSendTransaction) => (
            <TransactionCard 
            key={singleSendTransaction.id}
            date={singleSendTransaction.created_at}
            sender={singleSendTransaction.sender_id}
            receiver={singleSendTransaction.receiver_id}
            amount={singleSendTransaction.amount} />
          ))) : 
          <p>Loading transactions...</p>} 
        </div>

        <div className="received-transactions">
          <p>Received Transactions: </p>
          { userReceivedTransactions ? (
            userReceivedTransactions.map((singleReceivedTransaction) => (
            <TransactionCard 
            key={singleReceivedTransaction.id}
            date={singleReceivedTransaction.created_at}
            sender={singleReceivedTransaction.sender_id}
            receiver={singleReceivedTransaction.receiver_id}
            amount={singleReceivedTransaction.amount} />
          ))) : 
          <p>Loading transactions...</p>} 
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
