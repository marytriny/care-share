import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Paper, Typography, Stack, TextField, Button, ToggleButtonGroup, ToggleButton  } from '@mui/material';
import { IMaskMixin } from 'react-imask';

import { API_ROUTE, APP_ROUTE } from '../utils/constants';

const IMaskPhoneInput = IMaskMixin(({ ...props }) => {
  return <TextField {...props} />;
});

const SignUp = () => {
  // const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState({
    role: 'DONOR',
    email: '',
    password: '',
    organization: '', 
    address: '', 
    city: '', 
    state: '', 
    zip_code: '', 
    phone: '', 
    poc_name: '', 
    poc_phone: '', 
    active: 1
  })

  const updateAccount = (e) => {
    const { name, value } = e.target;
    setAccount(prevState => ({
      ...prevState,
      [name]: value.trim()
    }))
    // if number do:
    // setAccount(prevState => ({
    //   ...prevState,
    //   [name]: parseInt(value)
    // }))
  }
  
  function isEmailValid(email) {
    const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(email) return EMAIL_REGEX.test(email);
    else return true;
  }
  
  function isPhoneValid(phone) {
    if(phone) return phone.length === 14;
    else return true;
  }
  
  const validateForm = () => {
    console.log(account);
    if (!account.role || !account.email || !account.password ||
        !account.organization || !account.address || !account.city || 
        !account.state || !account.zip_code || !account.phone || 
        !account.poc_name || !account.poc_phone) {
      console.log("Please fill each field.")
    }
  }

  // With password authentication
  const signUp = async () => {
    validateForm();

    // try {
    //   setIsLoading(true);
    //   const rsp = await axios.post(API_ROUTE.SIGN_UP, account);
    //   console.log(rsp.data)
    //   if (!rsp?.data?.token) {
    //     console.log('Something went wrong during signing up: ', rsp);
    //     return;
    //   }
    //   // navigate(APP_ROUTE.SIGN_IN);
    // }
    // catch (err) {
    //   console.log('Some error occured during signing up: ', err);
    // }
    // finally {
    //   setIsLoading(false);
    // }
  };

  return (
    // SIGN UP FORM TEMPLATE
    <Paper className='sign-up'>
      <Stack spacing={2}>
        <Typography variant='h4' align='center' color='primary'> Let's get started! </Typography>
        <Typography variant='h6' color='primary'> Account Type </Typography>
        <ToggleButtonGroup 
          fullWidth 
          exclusive 
          color='primary'
          value={account.role} 
          onChange={(e,v) => setAccount(prevState => ({...prevState, role: v }))}
        >
          <ToggleButton value={'DONOR'}> Donor </ToggleButton>
          <ToggleButton value={'DISTRIBUTOR'}> Distributor  </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant='h6' color='primary'> Organization Details </Typography>
        <TextField 
          label="Name" 
          name="organization" 
          variant="outlined"
          required
          onChange={updateAccount}
        />
        <TextField 
          label="Email" 
          name="email" 
          variant="outlined" 
          required
          helperText='This will also serve as the account username'
          onChange={updateAccount}
          error={!isEmailValid(account.email)}
        />
        <IMaskPhoneInput 
          label="Phone" 
          name="phone" 
          mask='(000) 000-0000'
          variant="outlined" 
          required
          onChange={updateAccount}
          error={!isPhoneValid(account.phone)}
        />
        <TextField 
          label="Address" 
          name="address" 
          variant="outlined" 
          required
          onChange={updateAccount}
        />
        <div style={{ display:'flex', justifyContent:'space-between'}}>
          <TextField 
            label="City" 
            name="city" 
            variant="outlined" 
            required
            onChange={updateAccount}
          />
          <TextField 
            label="State" 
            name="state" 
            variant="outlined" 
            required
            onChange={updateAccount}
            sx={{minWidth: '80px'}}
          />
          <TextField 
            label="Zip Code" 
            name="zip_code" 
            variant="outlined" 
            required
            onChange={updateAccount}
            sx={{minWidth: '200px'}}
          />          
        </div>
        <Typography variant='h6' color='primary'> Person of Contact </Typography>
        <Typography variant='body2'> Please identify a person of contact. </Typography>
        <TextField 
          label="Name" 
          name="poc_name" 
          variant="outlined" 
          required
          onChange={updateAccount}
        />
        <IMaskPhoneInput 
          label="Phone" 
          name="poc_phone" 
          mask='(000) 000-0000'
          variant="outlined" 
          required
          error={!isPhoneValid(account.poc_phone)}
          onChange={updateAccount}
        />
        <Typography variant='h6' color='primary'> Finish Sign Up </Typography>
        <TextField 
          label="Account Password" 
          name="password" 
          type="password"
          variant="outlined"
          required
          onChange={updateAccount}
        />
        <Button onClick={signUp}> sign up! </Button> 
      </Stack>
    </Paper>
  );
}

export default SignUp;
