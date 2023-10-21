// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Paper, Typography } from '@mui/material';

// Local imports
import { useUser } from '../utils/customHooks';
import DonorDash from '../components/DonorDash';
import DistributorDash from '../components/DistributorDash'

export default function Dash() {

  const { user, authenticated } = useUser();

  if (!user || !authenticated) return <h2> Please login to access dashboard. </h2>
  else return(
    <div style={{ padding: '0 10px' }}>
      <Typography variant='h4' color='primary'> Welcome {user.organization}! </Typography>
      { user.role === 'DONOR'       && <DonorDash user={user} /> }
      { user.role === 'DISTRIBUTOR' && <DistributorDash user={user} /> }
    </div>
  );
}
