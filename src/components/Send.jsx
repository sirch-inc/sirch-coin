import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./AuthContext";
import supabase from "./App/supabaseConfig";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Send() {
  const { userInTable, userBalance } = useContext(AuthContext);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [currentBalance, setCurrentBalance] = useState(null);
  const [recipientError, setRecipientError] = useState(false);

  useEffect(() => {
    // (Re)fetch the user's balance when the component renders
    fetchUserBalance(userInTable);
  }, [userBalance]);

  const fetchUserBalance = async (userInTable) => {
    if (userInTable) {
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('user_id', userInTable.user_id)
        .single();

        if (error) {
          toast.error("Unable to load user balance", {
            position: "top-right",
          });
        } else {
        setCurrentBalance(data.balance);
      }
    }
  };

  const handleAmountInputChange = (event) => {
    const amount = event.target.value;

    setSendAmount(amount < 0 ? "" : amount);
  };

  const handleRecipientEmailAddressChange = (event) => {
    setRecipientEmail(event.target.value);
  };

  const handleMemoChange = (event) => {
    setMemo(event.target.value);
  };

  const handleAcknowledgeRecipientError = () => {
    setRecipientError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    fetchUserBalance(userInTable);

    // if the send amount equals the user's balance, display a warning & confirmation dialog
    if (parseInt(sendAmount, 10) === currentBalance) {
      // TODO: handle this confirmation with a proper dialog
      if (!confirm("Warning: the amount to send (ⓢ " + sendAmount + ") is your entire balance! Please confirm your intent.")) {
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

      if (fetchRecipientData.user_id == userInTable.user_id) {
        alert("You cannot send ⓢ Sirch Coins to yourself!")
        return;
      }
      
      // verify the sender has sufficient balance
      if (sendAmount > currentBalance) {
        toast.error('Insufficient balance', {
          position: "top-right",
        });

        return;
      }

      // Call the RPC function to handle the transfer
      const { data, transferError } = await supabase.rpc("transfer_coins", {
        sender_id: userInTable.user_id,
        receiver_id: fetchRecipientData.user_id,
        amount: sendAmount,
        memo
      });

      if (transferError?.message) {
        toast.error(transferError?.message, {
          position: "top-right",
        });
        // FIXME: hack to get around linter
        console.log("Data", data);
      } else {
        toast.success("ⓢ " + sendAmount + " successfully sent to " + recipientEmail, {
          position: "top-right",
        });

        setSendAmount("");
        setRecipientEmail("");
        setMemo("");

        // TODO: consider refactoring this and other similar calls into a provider or the context
        fetchUserBalance(userInTable);
      }
    } catch (exception) {
      // TODO: what to display here?
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
            Please check the email address or invite this individual to join Sirch Coins!
          </h3>
          <button
            onClick={handleAcknowledgeRecipientError}
          >
            Got it!
          </button>
        </>
        :
        <div>
          <div>
            <h2>Send</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="price-container">
              <input
                id="amountToSend"
                name="amountToSend"
                placeholder="how much?"
                required
                type="number"
                min="1"
                max={currentBalance || "0"}
                step="1"
                className="coin-input"
                value={sendAmount}
                onChange={handleAmountInputChange}
              />

              <div className="email-inputs">
                <input
                  id="recipientEmailAddress"
                  name="recipientEmailAddress"
                  placeholder="to whom?"
                  required
                  type="email"
                  className="coin-input"
                  value={recipientEmail}
                  onChange={handleRecipientEmailAddressChange}
                  autoComplete="email"
                />
              </div>

              <div className="memo-input">
                <input
                  id="memo"
                  name="memo"
                  placeholder="leave a note?"
                  type="text"
                  className="coin-input"
                  value={memo}
                  maxLength="60"
                  onChange={handleMemoChange}
                  autoComplete="memo"
                />
              </div>

              {/* TODO: Dynamically update dollar amount based on coin to dollar */}
              <div>
                <p>You now have <span className="bold-coin"> {currentBalance !== null ? "ⓢ " + currentBalance : "Loading"}</span> / $ {(currentBalance*0.10).toFixed(2)}</p>
              </div>

            </div>
            <div className="bottom-btn-container">
              <Link to="/" className="big-btn">
                Back
              </Link>
              <button type="submit" className="send-btn big-btn">
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