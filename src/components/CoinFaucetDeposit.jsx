// A Temporary Page to test adding 100 sirch coins to your account 
import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from "./Users/AuthContext";

const CoinFaucetDeposit = () => {
    const { userBalance } = useContext(AuthContext);
    const [currentBalance, setCurrentBalance] = useState(null);
  
    return (
      <>
        <div>
          <h2>You currently have a balance of:</h2>
          {userBalance && userBalance.balance !== null ? (
            <h1>{userBalance.balance} Coins</h1>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
        <div>
          <button>Click me to get 100 coins</button>
        </div>
      </>
    );
  };
  

export default CoinFaucetDeposit;