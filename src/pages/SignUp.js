// Import packages
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Local imports
import { API_ROUTE, APP_ROUTE, DEFAULT_ACCOUNT } from '../utils/constants';
import AccountForm from '../components/AccountForm';

const SignUp = () => {
  
  const [account, setAccount] = useState(DEFAULT_ACCOUNT);
  const navigate = useNavigate();

  // Submit request to create an account
  const signUp = () => {
    axios.post(API_ROUTE.SIGN_UP, account)
      .then((rsp) => {
        toast.success("Account created!");
        navigate(APP_ROUTE.HOME);
      })
      .catch ((err) => {
        toast.error("An error occured during sign up. Try again later.");
        console.log('Error occured during sign up: ', err);
      });
  };

  return (
    <AccountForm 
      account={account}
      setAccount={setAccount}
      submitText={'Sign Up'}
      onSubmit={signUp}
    />
  );
}

export default SignUp;
