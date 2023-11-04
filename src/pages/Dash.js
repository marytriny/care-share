// Import packages
import React, { useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';

// Local imports
import { API_ROUTE } from '../utils/constants';
import { useUser } from '../auth/customHooks';
import DonorDash from '../components/DonorDash';
import DistributorDash from '../components/DistributorDash'

export default function Dash() {

  const { user, authenticated } = useUser();

  useEffect(() => {
    axios.put(API_ROUTE.UPDATE_EXPIRED)
      .catch((err) => console.log('Failed to update expired donations ', err));
  }, []);

  if (!user || !authenticated) return <h2> Please login to access dashboard. </h2>
  else return(
    <div style={{ padding: '0 10px' }}>
      <Typography variant='h4' color='primary'> Welcome {user.organization} </Typography>
      { user.role === 'DONOR'       && <DonorDash user={user} /> }
      { user.role === 'DISTRIBUTOR' && <DistributorDash user={user} /> }
    </div>
  );
}
