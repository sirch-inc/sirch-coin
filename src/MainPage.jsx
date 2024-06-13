import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "./components/AuthContext";
import { useEffect, useContext } from "react";
import supabase from "./Config/supabaseConfig"
// import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode"


export default function MainPage() {
  const { userInTable } = useContext(AuthContext);

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.hash.slice(1));
  const type = urlParams.get('type');
  const accessToken = urlParams.get('access_token');

  const verifiedEmailPopup = async () => {
    if (type && accessToken){
      if (type === 'signup' && accessToken) {
        toast.success("Success! Your Sirch Coin account has been verified.", {
          position: "top-center",
          autoClose: 3000, 
        })
      } else if (type === null || accessToken === null) {
        toast.error("Email verification failed. Please try again.", {
          position: "top-center",
          autoClose: 3000,
        })
      }
    } else {
      console.log("Type: ", type)
      console.log("AccessToken: ", accessToken)
    }
    verifiedEmailPopup();
  }
})
  
  // Display success messaging when user verifies their account via email
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.hash.slice(1));
  //   const type = urlParams.get('type');
  //   const accessToken = urlParams.get('access_token');

  //   const verifyEmail = async () => {
  //     if (type === 'signup' && accessToken) {
  //       try {
  //         const { error } = await supabase.auth.verifyOtp({
  //           token: accessToken,
  //           type: 'signup',
  //         });

  //         if (!error) {
  //           toast.success('Success! Your Sirch Coin account has been verified.', {
  //             position: "top-center",
  //             autoClose: 3000,
  //           });
  //         } else {
  //           if (error.message === 'User already verified') {
  //             toast.info('Your account is already verified.', {
  //               position: "top-center",
  //               autoClose: 3000,
  //             });
  //           } else {
  //             toast.error('Email verification failed. Please try again.', {
  //               position: "top-center",
  //               autoClose: 3000,
  //             });
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Email verification error:', error);
  //         toast.error('An error occurred during email verification.', {
  //           position: "top-center",
  //           autoClose: 3000,
  //         });
  //       }
  //     } else {
  //       console.log('Invalid type or access token');
  //     }
  //   };

  //   verifyEmail();
  // }, []);

  return (
    <>
        {userInTable ? (
          <h3 className="page-header">Welcome, {userInTable.name}!</h3>
        ) : (
          <h3 className="page-header"> Welcome! Please sign in to use Sirch Coins.</h3>)}
      
      <div className="button-container">

      <Link to="/coin-faucet" className="action-btn">
          Internal: Balance & Faucet
      </Link>

        <Link to="coin/send" className="action-btn">
          Send Money
        </Link>

        <Link to="checkout" className="action-btn">
          Deposit
        </Link>

        <Link to="coin/balance" className="action-btn">
          Balance Inquiry
        </Link>

        <Link to="/transferhistory" className="action-btn">
          Transfer History
        </Link>

        <Link to="preferences" className="action-btn">
          Preferences
        </Link>

        <Link to="help" className="action-btn">
          Help
        </Link>
      </div>
      <ToastContainer />
    </>
  );
}
