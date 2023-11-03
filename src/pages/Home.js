// Import packages
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Typography, Button } from '@mui/material';
import { CartesianGrid, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts'

// Local imports
import { APP_ROUTE, API_ROUTE } from '../utils/constants';

export default function Home() {
  
  const [allDonationsOverTime, setAllDonationsOverTime] = useState([])
  const [distributorOfTheWeek, setDistributorOfTheWeek] = useState('')
  const [donorOfTheWeek, setDonorOfTheWeek] = useState('')

  // Get the Donor of the Week and Total Donations over Time chart data
  useEffect(() => {
    axios.get(API_ROUTE.HOME_DATA)
      .then((rsp) => {
        setAllDonationsOverTime(rsp.data.allDonationsOverTime)
        setDistributorOfTheWeek(rsp.data.distributorOfTheWeek)
        setDonorOfTheWeek(rsp.data.donorOfTheWeek)
      })
      .catch ((err) => console.log('Failed to get accepted donations table ', err));
  }, []);

  return(
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h2' color='primary' style={{fontFamily: 'Gabriola'}}>
          Care Share
        </Typography>
        <img width="20" height="20" src="https://img.icons8.com/ultraviolet/40/like--v1.png" alt=''/>
      </div>

      {/* Weekly Award */}
      <div className='weekly-award'>
        <div className='weekly-award-card'>
          <div className='weekly-award-text'>
            <Typography variant='h4' color='primary'> Donor of the Week: </Typography>
            <Typography variant='h4' color='secondary'> <b>{donorOfTheWeek}</b> </Typography>
            <Typography>
              Big shoutout to {donorOfTheWeek} for donating the most goods this week. 
              Thank you for your contributions!
            </Typography>
          </div>
          <img width="100" height="100" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/100/external-donation-rage-room-flaticons-lineal-color-flat-icons-2.png" alt=''/>
        </div>
        <div className='weekly-award-card'>
          <div className='weekly-award-text'>
            <Typography variant='h4' color='primary'> Distributor of the Week: </Typography>
            <Typography variant='h4' color='secondary'> <b>{distributorOfTheWeek}</b> </Typography>
            <Typography>
              And a huge thanks to {distributorOfTheWeek} for distributing
              the most goods this week to those in need!
            </Typography>
          </div>
          <img width="100" height="100" src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/100/external-hands-mother-day-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png" alt=''/>
        </div>
      </div>
      <div style={{display: 'flex' }}>
        {/* Impact Chart */}
        <div> 
          <AreaChart width={800} height={400} data={allDonationsOverTime} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="from_date" name='Time' />
            <YAxis dataKey="quantity" name='Quantity' />
            <Tooltip />
            <Area type="monotone" dataKey="quantity" name='Quantity' stroke="#d7bde2" fill="#d7bde2" />
          </AreaChart>     
          <Typography variant='h4' color='primary' align='center'>
            Total Donations over Time
          </Typography>
          <Typography align='center'>
            The chart above shows all successful donations over time from all of our lovely donors. <br/>
            All in all, about <b> {allDonationsOverTime.length > 0 && allDonationsOverTime.map(({quantity}) => quantity).reduce((a,b)=>a+b)} </b> 
            goods have been distributed to those in need using CareShare so far!
          </Typography>   
        </div>

        {/* About Us */}
        <Paper className='about-us' sx={{ bgcolor: '#d9cfea', mx: '20px' }}>
          <Typography variant='h5' color='secondary'> About Us </Typography>
          <p align='left'>
            Our goal is to provide a donation service to limit waste and help those in need.
            Here, businesses can easily donate leftover/ surplus goods to organizations that
            redistribute to the less fortunate.  <br/>
            <br/>
            <a 
              href="https://www.rts.com/resources/guides/food-waste-america/"
              target= "_blank"
              rel= 'noreferrer'
            > 
              According to RTS 
            </a>
            , “The United States discards more food than any other country 
            in the world: nearly <b> 120 billion </b> pounds every year. That’s estimated to be almost
            <b> 40% </b> of the entire US food supply.” <br/>
            <br/>
            Join CareShare today and start making a difference.
            Together, we can reduce waste and help others one donation at a time!<br/>
          </p>
          <Button href={APP_ROUTE.SIGN_UP} variant='contained' color='secondary' sx={{mt: 2}}> Sign Up </Button>
        </Paper>        
      </div>
    </div>
  );
}