// Import packages
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Local imports
import { API_ROUTE, DEFAULT_ACCOUNT } from '../utils/constants';
import AccountForm from '../components/AccountForm';
import { useUser } from '../utils/customHooks';

const Account = () => {

  const [account, setAccount] = useState(DEFAULT_ACCOUNT);
  const { user } = useUser();
  
  useEffect(() => {
    // Get account details
    if (user) {
      setAccount({
        id: user.id,
        role: user.role,
        email: user.email,
        password: '',
        organization: user.organization,
        address: user.address,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        phone: user.phone,
        poc_name: user.poc_name,
        poc_phone: user.poc_phone
      });
    }
  }, [user]);

  // Submit request to update account details
  const update = () => {
    axios.post(API_ROUTE.UPDATE_USER, account)
      .then((rsp) => {
        toast.success("Account updated!");
      })
      .catch ((err) => {
        toast.error("An error occured during update. Try again later.");
        console.log('Error occured during update: ', err);
      });
  };

  const updatePassword = () => {
    console.log(account)
    axios.post(API_ROUTE.UPDATE_PASSWORD, account)
      .then((rsp) => {
        toast.success("Password updated!");
      })
      .catch ((err) => {
        if(err.response?.data.msg === "Invalid Email Or Password") toast.error("Current Password is Incorrect");
        else toast.error("Service Error - Please try again later.")
        console.log('Error occured during update: ', err);
      });
  }

  return (
    <AccountForm 
      account={account}
      setAccount={setAccount}
      submitText={'Save Updates'}
      onSubmit={update}
      update
      updatePassword={updatePassword}
    />
  );
}

export default Account;
