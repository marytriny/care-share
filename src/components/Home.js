import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { APP_ROUTE } from '../utils/constants';

export default function Home() {
  
  return(
    <>
      <h2>Home</h2>
      <div className='home'>
        <Typography variant='h6' color='primary'> About Us </Typography>
        <p align='left'>
          Our goal is to provide a donation service to limit waste and help those in need. <br/>
          Here, businesses can easily donate leftover/ surplus goods to organizations that <br/>
          redistribute to the less fortunate.  <br/>
          <br/>

          <a 
            href="https://www.rts.com/resources/guides/food-waste-america/"
            target= "_blank"
            rel= 'noreferrer'
          > 
            According to RTS 
          </a>
          , “The United States discards more food than any other country <br/>
          in the world: nearly <b> 120 billion </b> pounds every year. That’s estimated to be almost <br/>
          <b> 40% </b> of the entire US food supply.” <br/>
          <br/>
          Join CareShare today and start making a difference. <br/>
          Together, we can reduce waste and help others one donation at a time!<br/>
        </p>

        <Button href={APP_ROUTE.SIGN_UP} variant='contained'> Sign Up </Button>
      </div>
    </>
  );
}