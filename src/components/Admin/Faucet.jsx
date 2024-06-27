import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../AuthContext";
import supabase from '../../Config/supabaseConfig';


export default function AdminFaucet() {
  const { userBalance, userId } = useContext(AuthContext);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [updatedCoinSupply, setUpdatedCoinSupply] = useState(null);

  // TODO: this is a hack; the "admin" view(s) should be conditionally compiled out of the app in PROD
  const env = import.meta.env.VITE_ENVIRONMENT;
  const isLocalEnvironment = env && env.toLowerCase() === 'local';

  useEffect(() => {
    const fetchTotalSupply = async () => {
      const { data, error } = await supabase.from('sirch-coins').select('*');
      if (error) {
        // TODO: surface this error...
        console.error('Error fetching total supply:', error);
      } else {
        setUpdatedCoinSupply(data[0]['total_supply']);
      }
    };

    // Fetch the user's balance
    fetchUserBalance(userBalance);

    // Fetch the total supply of Sirch Coins
    fetchTotalSupply();
  }, [userBalance]);

  if (!isLocalEnvironment) {
    alert("You don't belong here!");
    return;
  }

  const fetchUserBalance = async (userInTable) => {
    if (userInTable) {
      const { data, error } = await supabase
        .from('user-balances')
        .select("*")
        .eq('user_id', userInTable.user_id)
        .single();

      if (error) {
        // TODO: surface this error...
        console.error('Error fetching user balance:', error);
      } else {
        setCurrentBalance(data.balance);
      }
    }
  };

  const addCoins = async () => {
    try {
      // Increase the user's balance
      const depositCoins = userBalance.balance + 100;
      const { data: updatedBalance, error: updateError } = await supabase
        .from('user-balances')
        .update({ balance: depositCoins })
        .eq('user_id', userId)
        .select('balance')
        .single();

      if (updateError) {
        // TODO: surface this error
        console.error('Error updating user balance:', updateError);
        return;
      }

      // Update the currentBalance state with the new balance
      setCurrentBalance(updatedBalance.balance);

      // Decrease the total supply
      // TODO: move this into a SupaBase function
      const { data: updatedSupply, error: decreaseError } = await supabase
        .from('sirch-coins')
        .update({ total_supply: updatedCoinSupply - 100 })
        .eq('id', '11eb4bf1-11ab-4d62-9c3b-5532eaa41f7e')
        .select('total_supply')
        .single();

      if (decreaseError) {
        // TODO: surface this error
        console.error('Error decreasing total supply:', decreaseError);
        return;
      }

      // Refresh the coin supply with the new total supply
      setUpdatedCoinSupply(updatedSupply.total_supply);
    } catch (error) {
      // TODO: surface this error...
      console.error('Error adding coins:', error);
    }
  };

  return (
    <>
      <div>
        <h2>You currently have a balance of:</h2>
        {currentBalance !== null ? (
          <h1>{currentBalance} Sirch Coins</h1>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <div>
        <button onClick={addCoins}>Click to get 100 Sirch Coins</button>
      </div>
    </>
  );
}