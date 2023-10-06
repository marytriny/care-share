import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Paper, TextField, Button, Typography } from '@mui/material';

import { API_ROUTE, APP_ROUTE } from '../utils/constants';
import { useUser } from '../utils/customHooks';
import { storeTokenInLocalStorage } from '../utils/common';

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, authenticated } = useUser();
  
  useEffect(() => {
    console.log(user, authenticated)
    if (user || authenticated) {
      navigate(APP_ROUTE.DASH)
    }
  }, [user, authenticated]);

  const signIn = async () => {
    try {
      setIsLoading(true);
      console.log(email, password)
      const rsp = await axios.post(API_ROUTE.SIGN_IN, { email, password });
      if (!rsp?.data?.token) {
        console.log('Something went wrong during signing in: ', rsp);
        return;
      }
      console.log(rsp.data)
      storeTokenInLocalStorage(rsp.data.token);
      navigate(APP_ROUTE.DASH)
    }
    catch (err) {
      console.log('Some error occured during signing in: ', err);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    // SIGN IN FORM TEMPLATE
    <Paper className='sign-up' sx={{ bgcolor: 'pink' }}>
      <Typography variant='h4'> Sign In </Typography>
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
      />
      <Button onClick={signIn}> sign in </Button>
    </Paper>
  );
}

export default SignIn;