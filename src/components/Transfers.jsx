import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TransferCard from "./TransferCard";
import { AuthContext } from "./AuthContext";
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
        //TODO: handle error
        alert('Error fetching users sent transfers: ', error);
      } else {
        console.log(data);
        setUserSentTransfers(data);
      }
    }
    else{
      // alert('User not found.');
      console.log("No user in table");
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
        //TODO: handle error 
        alert('Error fetching users received transfers', error);
      } else {
        console.log(data);
        setUserReceivedTransfers(data);
      }
    } else {
      // alert('User not found.');
      console.log("No user in table");
    }
  }

  useEffect(() => {
    fetchUserSentTransfers(userInTable);
    fetchUserReceivedTransfers(userInTable);
  }, [userInTable]);

  return (
    <>
      <h3 className="page-header">Transfer History</h3>
      <div className="transfers-container">
        <h2 className="transfers-header">
          Your transfers:
        </h2>

        <h3>Sent Transfers</h3>
        <div className="transfers-headers">
          <p>Date Sent</p>
          <p>Sender</p>
          <p>Receiver</p>
          <p>Amount</p>
        </div>
        <div className="sent-transfers">
          { userSentTransfers ? (
            userSentTransfers.map((singleSendTransfer) => (
              <TransferCard 
              key={singleSendTransfer.id}
              date={singleSendTransfer.created_at}
              sender={singleSendTransfer.sender?.user?.email || singleSendTransfer.sender_id}
              receiver={singleSendTransfer.receiver?.user?.email || singleSendTransfer.receiver_id}
              amount={singleSendTransfer.amount} />
          ))) : 
          <p>Loading transfers...</p>} 
        </div>
        
        <h3>Received Transfers</h3>
        <div className="transfers-headers">
          <p>Date Sent</p>
          <p>Sender</p>
          <p>Receiver</p>
          <p>Amount</p>
        </div>
        <div className="received-transfers">
          { userReceivedTransfers ? (
            userReceivedTransfers.map((singleReceivedTransfer) => (
              <TransferCard 
              key={singleReceivedTransfer.id}
              date={singleReceivedTransfer.created_at}
              sender={singleReceivedTransfer.sender?.user?.email || singleReceivedTransfer.sender_id}
              receiver={singleReceivedTransfer.receiver?.user?.email || singleReceivedTransfer.receiver_id}
              amount={singleReceivedTransfer.amount} />
          ))) : 
          <p>Loading transfers...</p>} 
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
