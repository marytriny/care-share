// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';

import { useUser } from '../utils/customHooks';
import { API_ROUTE, APP_ROUTE } from '../utils/constants';

export default function Dash() {

  const { user, authenticated } = useUser();

  useEffect(() => {
    if(user) {
      axios.get(`${API_ROUTE.DONATION}${user.organization}`)
      .then((rsp) => {
        console.log(rsp.data)
      })
      .catch ((err) => {
        toast.error("Failed to create donation. Try again later.");
        console.log('Failed to create donation: ', err);
      });
    }
  }, [user]);

  if (!user || !authenticated) {
    return <h2>booo no token</h2>
  }
  
  return(
    <>
      <h2> Welcome {user.organization}! </h2>
      <Button href={APP_ROUTE.DONATE} variant='contained'> Make a Donation </Button>
    </>
  );
}
