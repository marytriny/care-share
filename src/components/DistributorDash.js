// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import moment from 'moment';

import { API_ROUTE, APP_ROUTE } from '../utils/constants';

const columns = [ 'donor', 'item', 'quantity', 'from_date', 'to_date', 'address' ];

const isDate = (field_name) => field_name === 'from_date' || field_name === 'to_date'

export default function DonorDash({user}) {

  const [availableDonations, setAvailableDonations] = useState([])
  const [acceptedDonations, setAcceptedDonations] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if(user) loadTables();
  }, [user]);

  const loadTables = () => {
    axios.post(API_ROUTE.ACCEPTED_DONATIONS, { distributor: user.organization })
      .then((rsp) => setAcceptedDonations(rsp.data.map(x => 
        ({...x, address: x.address + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code}))))
      .catch ((err) => console.log('Failed to get donation table ', err));

    axios.get(API_ROUTE.DONATION)
      .then((rsp) => setAvailableDonations(rsp.data.map(x => 
        ({...x, address: x.address + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code}))))
      .catch ((err) => console.log('Failed to get donation table ', err));
  }

  const donationRsp = (id, isAccepted = false) => {
    const status = isAccepted ? 'PENDING' : 'ACCEPTED' 
    const distributor = isAccepted ? '' : user.organization
    axios.put(API_ROUTE.ACCEPT_DONATION, { id, status, distributor: user.organization })
      .then((rsp) => loadTables())
      .catch ((err) => console.log('Failed to get donation table ', err));
  }

  // Update column names so they are more human readable.
  // ex. column name 'from_date' would become 'From Date'.
  const formatHeader = (name) =>
    name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Display the table 
  const PrintTable = ({rows, accepted}) => {
    return (
      <TableContainer component={Paper} sx={{ maxHeight: "400px", width: '1200px' }}>
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              {columns.map(x => <TableCell key={x}> {formatHeader(x)} </TableCell>)}
              <TableCell key='accept'> { accepted ? 'Cancel' : 'Accept'} </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? rows.map((rowData) => (
              <TableRow key={rowData.id} hover>
                {columns.map(x => 
                  <TableCell key={x}> 
                    { isDate(x) ? moment(rowData[x]).format('MM/DD/YY hh:mm a') : rowData[x] } 
                  </TableCell>
                )}
                <TableCell key='accept'> 
                  <IconButton onClick={() => donationRsp(rowData.id, accepted)}> 
                    { accepted ? <CloseIcon color='error'/> : <CheckIcon color='success'/> }
                  </IconButton> 
                </TableCell>
              </TableRow>
            )) : (<TableRow><TableCell>No donations at this time</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return(
    <div>
      { acceptedDonations.length > 0 && 
        <>
          <Typography variant='h5' color='primary' align='left' sx={{mt: '40px'}}> <b>Accepted Donations</b> </Typography>
          <Typography align='left' color='subtext.main'> 
            <b>The following donations are waiting for pickup! </b> Click on a donation for additional information. <br/>
            If you change your mind, please cancel so another organization may have the chance of accepting the donation.
          </Typography>
          <PrintTable rows={acceptedDonations} accepted/>
        </>
      }

      <Typography variant='h5' color='primary' align='left' sx={{mt: '40px'}}> Available Donations </Typography>
      <PrintTable rows={availableDonations} />
    </div>
  );
}
