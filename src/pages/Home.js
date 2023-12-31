// Import packages
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CartesianGrid, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts'
import { Paper, Typography, Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Local imports
import { APP_ROUTE, API_ROUTE } from '../utils/constants';
import Map from '../components/Map';

export default function Home() {
 
  // Used to make CSS adaptive to smaller screens like mobile and tablet devices.
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const flexDirection = mobile ? 'column' : 'row'; 

  const [donorOfTheWeek, setDonorOfTheWeek] = useState('')
  const [distributorOfTheWeek, setDistributorOfTheWeek] = useState('')
  const [allDonationsOverTime, setAllDonationsOverTime] = useState([])
  const [allDistributorLocations, setAllDistributorLocations] = useState([])
  
  // Get the Donor of the Week and Total Donations over Time chart data
  useEffect(() => {
    axios.get(API_ROUTE.HOME_DATA)
      .then((rsp) => {
        setDonorOfTheWeek(rsp.data.donorOfTheWeek)
        setDistributorOfTheWeek(rsp.data.distributorOfTheWeek)
        setAllDonationsOverTime(rsp.data.allDonationsOverTime)
        setAllDistributorLocations(rsp.data.allDistributorLocations)
      })
      .catch ((err) => console.log('Failed to get accepted donations table ', err));
  }, []);

  return(
    <div style={{ maxWidth: '1200px', margin: 'auto', marginBottom: '60px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h2' color='primary' style={{fontFamily: 'Gabriola'}}>
          Care Share
        </Typography>
        <img width="20" height="20" src="https://img.icons8.com/ultraviolet/40/like--v1.png" alt=''/>
      </div>

      {/* Weekly Award */}
      <div className='weekly-award' style={{flexDirection}}>
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
      <div style={{display: 'flex', flexDirection}}>
        {/* Impact Chart */}
        <div> 
          <AreaChart width={mobile ? 380 : 800} height={400} data={allDonationsOverTime} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="from_date" name='Time' />
            <YAxis dataKey="value" name='Value' />
            <Tooltip />
            <Area type="monotone" dataKey="value" name='Value' stroke="#d7bde2" fill="#d7bde2" />
          </AreaChart>
          <Typography variant='h4' color='primary' align='center'>
            Our Impact
          </Typography>
          <Typography align='center'>
            The chart above shows all successful donations over time from all of our lovely donors. <br/>
            All in all, about <b> ${allDonationsOverTime.length > 0 && allDonationsOverTime.map(({value}) => value).reduce((a,b)=>a+b)} </b> 
            worth of goods have been distributed to those in need using CareShare so far!
          </Typography>   
        </div>

        {/* About Us */}
        <Paper className='about-us' sx={{ bgcolor: '#d9cfea', mx: '20px', mt: mobile ? '80px': null }}>
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
      <div style={{ marginTop: '80px' }}>
        <Typography variant='h4' color='primary' align='left'>
          Communities Impacted
        </Typography>
        <Typography align='left'>
          The map below shows the various communitites that have benefited from our services so far. <br/>
          Our goal is to help serve communities all accross the US!
        </Typography>   
        <Map center={[28, -80]} zoom={6} markers={allDistributorLocations}/>
      </div>
    </div>
  );
}
