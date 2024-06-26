import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import supabase from "../Config/supabaseConfig";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Send() {
  const { userInTable, session, userBalance } = useContext(AuthContext);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientError, setRecipientError] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState(null);
  
  const handleAmountButtonClick = (amount) => {
    setSendAmount(amount);
  };

  const handleAmountInputChange = (event) => {
    const amount = event.target.value;

    setSendAmount(amount < 0 ? "" : amount);
  };

  const handleRecipientEmailAddressChange = (event) => {
    setRecipientEmail(event.target.value);
  };

  const handleAcknowledgeRecipientError = (event) => {
    setRecipientError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // if the send amount equals the user's balance, display a warning & confirmation dialog
    if (parseInt(sendAmount, 10) === userBalance.balance) {
      // TODO: handle this confirmation with a proper dialog
      if (!confirm("Warning: the amount to send (" + sendAmount + " Sirch Coins) is your entire balance! Please confirm your intent.")) {
        return;
      }
    }
  
    try {
      // Find the recipient user by email
      const { data: fetchRecipientData, error: fetchRecipientError } = await supabase
        .from("users")
        .select("*")
        .eq("email", recipientEmail)
        .single();

      if (fetchRecipientError) {
        setRecipientError(true);

        // TODO: either rework this use case, or conduct the invitation on the server
        // const confirmedResponse = confirm("The recipient (" + recipientEmail + ") does not appear to have a Sirch Coins account.  Would you like to send this person an invitation to join Sirch Coins?");
        // if (confirmedResponse) {
        //   const { data, error } = await supabase.auth.admin.inviteUserByEmail(recipientEmail);
        //   if (error) {
        //     // TODO: surface this error
        //     console.error("Error inviting recipient:", error);
        //   } else {
        //     // TODO: indicate success to the user
        //     alert("Invitation successful!");
        //     setSendAmount("");
        //     setRecipientEmail("");
        //   }
        // }

        return;
      }

      setRecipient(fetchRecipientData);

      // verify the sender has sufficient balance
      if (sendAmount > userBalance.balance) {
        toast.error('Insufficient balance', {
          position: "top-right",
        });

        return;
      }

      // Call the RPC function to handle the transfer
      const { data, transferError } = await supabase.rpc("transfer_coins", {
        sender_id: userInTable.user_id,
        receiver_id: fetchRecipientData.user_id,
        amount: sendAmount
      });

      if (transferError?.message) {
        toast.error(transferError?.message, {
          position: "top-right",
        });
      } else {
        toast.success(sendAmount + " Sirch Coins successfully sent to " + recipientEmail, {
          position: "top-right",
        });

        setSendAmount("");
        setRecipientEmail("");

        // TODO: refresh the user's balance here...
      }
    } catch (exception) {
      // TODO: what do display here?
      toast.error('An exception occurred', {
        position: "top-right",
      });
      console.error("An exception occurred:", exception);
    }
  };

  
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="colored"
      />
      <div className="send-coin-container">
      {recipientError
        ?
        <>
          <h3>
            The recipient ({recipientEmail}) does not appear to have a Sirch Coins account.
            <br/>
            <br/>
            Please check the email address or invite this individual join Sirch Coins!
          </h3>
          <button
            onClick={handleAcknowledgeRecipientError}
          >
            Got it!
          </button>
        </>
        :
        <div>
          <h3 className="page-header">Send Sirch Coins</h3>
          <div>
            <h2>You currently have a balance of:</h2>
            <h1> {userBalance?.balance || "Loading..."} Sirch Coins</h1>
            <p>
              To send Sirch Coins to anyone with a Sirch Coins account,
              please specify the amount and the recipient's email address below.</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="price-container">
              <div className="cash-buttons">
                <div className="first-row">
                  <button
                    className="cash1-btn"
                    onClick={() => handleAmountButtonClick(20)}
                  >
                    20
                  </button>
                  <button
                    className="cash1-btn"
                    onClick={() => handleAmountButtonClick(40)}
                  >
                    40
                  </button>
                  <button
                    className="cash1-btn"
                    onClick={() => handleAmountButtonClick(100)}
                  >
                    100
                  </button>
                </div>
                <div className="second-row">
                  <button
                    className="cash1-btn"
                    onClick={() => handleAmountButtonClick(500)}
                  >
                    500
                  </button>
                  <button
                    className="cash1-btn"
                    onClick={() => handleAmountButtonClick(1000)}
                  >
                    1000
                  </button>
                  <button
                    className="cash1-btn"
                    onClick={() => handleAmountButtonClick("")}
                  >
                    Other Amount
                  </button>
                </div>
              </div>

              <label htmlFor="amountToSend">Amount to Send (S)</label>
              <input
                id="amountToSend"
                name="amountToSend"
                placeholder=""
                required
                type="number"
                min="0"
                max={userBalance?.balance || "0"}
                step="1"
                className="cash1-input other-amount-input"
                value={sendAmount}
                onChange={handleAmountInputChange}
              />

              <div className="email-inputs">
                <label htmlFor="recipientEmailAddress">Recipient's Email Address</label>
                <input
                  id="recipientEmailAddress"
                  name="recipientEmailAddress"
                  placeholder=""
                  required
                  type="email"
                  className="cash1-input recipient-email-input"
                  value={recipientEmail}
                  onChange={handleRecipientEmailAddressChange}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="bottom-btn-container">
              <Link to="/" className="big-btn-red">
                Back
              </Link>
              <button type="submit" className="send-btn big-btn-blue">
                Send
              </button>
            </div>
          </form>
        </div>
      }
      </div>
    </>
  );
}