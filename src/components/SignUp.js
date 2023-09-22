import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Paper, TextField, Button, Typography } from '@mui/material';
import '../App.css'
import { API_ROUTE, APP_ROUTE } from '../utils/constants';

const SignUp = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState({
    role: 'ADMIN',
    email: '',
    password: '',
    active: 1
  })

  const updateAccount = (e) => {
    const { name, value } = e.target;
    setAccount(prevState => ({
      ...prevState,
      [name]: value
    }))
    // if number do:
    // setAccount(prevState => ({
    //   ...prevState,
    //   [name]: parseInt(value)
    // }))
  }

  const createAccount = () => {
    axios.post(API_ROUTE.SIGN_UP, account)
      .then((rsp) => console.log(rsp))
      .catch((err) => console.log(err))
  }

  // With password authentication
  const signUp = async () => {
    try {
      setIsLoading(true);
      const rsp = await axios.post(API_ROUTE.SIGN_UP, account);
      console.log(rsp.data)
      if (!rsp?.data?.token) {
        console.log('Something went wrong during signing up: ', rsp);
        return;
      }
      // navigate(APP_ROUTE.SIGN_IN);
    }
    catch (err) {
      console.log('Some error occured during signing up: ', err);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    // SIGN UP FORM TEMPLATE
    <Paper className='sign-up' sx={{ bgcolor: 'pink' }}>
      <Typography variant='h4'> Let's get started! </Typography>
      <TextField 
        label="Email" 
        name="email" 
        variant="outlined" 
        onChange={updateAccount}
      />
      <TextField 
        label="Password" 
        name="password" 
        type="password"
        variant="outlined"
        onChange={updateAccount}
      />
      <Button onClick={signUp}> sign up! </Button>
    </Paper>
  );
}

export default SignUp;
