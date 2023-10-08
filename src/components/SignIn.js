import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Paper, Stack, TextField, Button, Typography } from '@mui/material';

import { API_ROUTE, APP_ROUTE } from '../utils/constants';
import { useUser } from '../utils/customHooks';
import { storeTokenInLocalStorage } from '../utils/common';

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, authenticated } = useUser();
  const navigate = useNavigate();

  // Check if the user is already authenticated
  useEffect(() => {
    console.log(user, authenticated)
    if (user || authenticated) {
      navigate(APP_ROUTE.DASH)
    }
  }, [user, authenticated]);

  // Handle key press for the Enter key
  const handleKeypress = (e) => { 
    if(e.key === "Enter") signIn();
  }

  // Submit sign in request
  const signIn = () => {
    axios.post(API_ROUTE.SIGN_IN, { email, password })
      .then((rsp) => {
        storeTokenInLocalStorage(rsp.data.token);
        navigate(APP_ROUTE.DASH)
      })
      .catch ((err) => {
        if(err.response.data.msg === "Invalid Email Or Password") toast.error("Invalid Email or Password");
        else toast.error("Service Error - Please try again later.")
        console.log('Error occured during sign in: ', err);
      })
  }

  return (
    // SIGN IN FORM
    <Paper className='sign-up' sx={{ maxWidth: '400px' }}>
      <Stack spacing={2}>
        <Typography variant='h4' align='center' color='primary'> Sign In </Typography>
        <TextField 
          label="Email" 
          name="email" 
          variant="outlined" 
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField 
          label="Password" 
          name="password" 
          type="password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={handleKeypress}
        />
        <Button onClick={signIn} size='large'> sign in </Button>
      </Stack>
    </Paper>
  );
}

export default SignIn;
