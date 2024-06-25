import React, { useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import TransactionCard from "./TransactionCard";
import { AuthContext } from "./AuthContext";
import supabase from '../Config/supabaseConfig';

export default function Transactions() {
  const { userInTable } = useContext(AuthContext);

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
        console.log(data)
      }
    }
    else{
      // alert('User not found.')
      console.log("No user in table")
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
        console.log(data)
      }
    } else {
      // alert('User not found.')
      console.log("No user in table")
    }
  }
  fetchUserSentTransactions(userInTable);
  fetchUserReceivedTransactions(userInTable);

  return (
    <>
      <h3 className="page-header">Transaction History</h3>
      <div className="balance-container">
        <p className="page-text">
          Your transactions:
        </p>
        
        <div className="bottom-btn-container">
          <Link to="/" className="big-btn-red">
            Back
          </Link>
        </div>
      </div>
    </>
  );
}
