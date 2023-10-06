import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Paper, Typography, Stack, TextField, Button, ToggleButtonGroup, ToggleButton  } from '@mui/material';
import '../App.css'
import { API_ROUTE, APP_ROUTE } from '../utils/constants';

const SignUp = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState({
    role: 'DONOR',
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
      <Stack spacing={2}>
        <Typography variant='h4' align='center'> Let's get started! </Typography>
        <Typography variant='h6'> Account Type </Typography>
        <ToggleButtonGroup 
          fullWidth 
          exclusive 
          value={account.role} 
          onChange={(e,v) => setAccount(prevState => ({...prevState, role: v }))}
        >
          <ToggleButton value={'DONOR'}> Donor </ToggleButton>
          <ToggleButton value={'DISTRIBUTOR'}> Distributor  </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant='h6'> Organization Details </Typography>
        <TextField 
          label="Name" 
          name="organization" 
          variant="outlined" 
          onChange={updateAccount}
        />
        <TextField 
          label="Email" 
          name="email" 
          variant="outlined" 
          helperText='This will also serve as the account username'
          onChange={updateAccount}
        />
        <TextField 
          label="Phone" 
          name="phone" 
          variant="outlined" 
          onChange={updateAccount}
        />
        <TextField 
          label="Address" 
          name="address" 
          variant="outlined" 
          onChange={updateAccount}
        />
        <div style={{ display:'flex', justifyContent:'space-between'}}>
          <TextField 
            label="City" 
            name="city" 
            variant="outlined" 
            onChange={updateAccount}
          />
          <TextField 
            label="State" 
            name="state" 
            variant="outlined" 
            onChange={updateAccount}
            sx={{minWidth: '80px'}}
          />
          <TextField 
            label="Zip Code" 
            name="zip_code" 
            variant="outlined" 
            onChange={updateAccount}
            sx={{minWidth: '200px'}}
          />          
        </div>
        <Typography variant='h6'> Person of Contact </Typography>
        <Typography variant='body2'> Please identify at least 1 person of contact. </Typography>
        <TextField 
          label="Name" 
          name="poc_name" 
          variant="outlined" 
          onChange={updateAccount}
        />
        <TextField 
          label="Phone" 
          name="poc_phone" 
          variant="outlined" 
          onChange={updateAccount}
        />
        <Typography variant='h6'> Finish Sign Up </Typography>
        <TextField 
          label="Account Password" 
          name="password" 
          type="password"
          variant="outlined"
          onChange={updateAccount}
        />
        <Button onClick={signUp}> sign up! </Button> 
      </Stack>

    </Paper>
  );
}

export default SignUp;
