import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "./AuthContext";
import supabase from "./App/supabaseConfig";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Send() {
  const { userInTable, userBalance } = useContext(AuthContext);
  const [sendAmount, setAmount] = useState("");
  const [searchText, setSearchText] = useState("");
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

  const handleAmountChange = (event) => {
    const amount = event.target.value;

    setAmount(amount < 0 ? "" : amount);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
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
      const { data: fetchRecipientData, error: fetchRecipientError } = await supabase.functions.invoke('lookup-user', {
        body: {
          userId: userInTable.user_id,
          searchText: searchText
        }
      });

      debugger;
      if (fetchRecipientError) {
        // TODO: hande this error gracefully
        alert('Error checking recipient exists');
        return;
      }

      console.log(fetchRecipientData);
      // if (fetchRecipientData.isMe) {
      //   // TODO: handle this gracefully
      //   alert("You cannot send ⓢ Sirch Coins to yourself!")
      //   return;
      // }

      // if (!fetchRecipientData.exists) {
      //   setRecipientError(true);

        // TODO: either rework this use case, or conduct the invitation on the server
        // const confirmedResponse = confirm("The recipient (" + searchText + ") does not appear to have a Sirch Coins account.  Would you like to send this person an invitation to join Sirch Coins?");
        // if (confirmedResponse) {
        //   const { data, error } = await supabase.auth.admin.inviteUserByEmail(searchText);
        //   if (error) {
        //     // TODO: surface this error
        //     console.error("Error inviting recipient:", error);
        //   } else {
        //     // TODO: indicate success to the user
        //     alert("Invitation successful!");
        //     setAmount("");
        //     setSearchText("");
        //   }
      //   }

      //   return;
      // }

      // verify the sender has sufficient balance
      if (sendAmount > currentBalance) {
        toast.error('Insufficient balance');

        return;
      }

      const { data: transferData, error: transferError } = await supabase.functions.invoke('transfer_coins', {
        body: {
          sender_id: userInTable.user_id,
          recipient_id: fetchRecipientData.user_id,
          amount: sendAmount,
          memo
        }
      });

      if (transferError) {
        // TODO: hande this error gracefully
        alert('Error transferring coins:\n' + transferError);
        return;
      }

      if (transferError?.message) {
        toast.error(transferError?.message);
        // FIXME: hack to get around linter
        console.log("Data", transferData);
      } else {
        toast.success("ⓢ " + sendAmount + " successfully sent to " + searchText);

        setAmount("");
        setSearchText('');
        setMemo("");

        // TODO: consider refactoring this and other similar calls into a provider or the context
        fetchUserBalance(userInTable);
      }
    } catch (exception) {
      console.error("An exception occurred:", exception);

      // TODO: what to display here?
      toast.error('An exception occurred', exception);
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
            The recipient ({searchText}) does not appear to have a Sirch Coins account.
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
                onChange={handleAmountChange}
              />

              <div className="email-inputs">
                <input
                  id="searchText"
                  name="searchText"
                  placeholder="to whom?"
                   // value={searchText}                
                  defaultValue={searchText}
                  type="text"
                  className="coin-input"
                  onBlur={handleSearchTextChange}
                  required
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