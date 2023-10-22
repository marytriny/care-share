// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';

import { API_ROUTE } from '../utils/constants';

const columns = [ 'item', 'quantity', 'from_date', 'to_date', 'donor', 'address' ];
const isDate = (field_name) => (field_name === 'from_date' || field_name === 'to_date');

export default function DonorDash({user}) {

  const [availableDonations, setAvailableDonations] = useState([])
  const [acceptedDonations, setAcceptedDonations] = useState([])
  const [acceptedDialog, setAcceptedDialog] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)

  useEffect(() => {
    if(user) loadTables();
  }, [user]);

  const loadTables = () => {
    axios.post(API_ROUTE.ACCEPTED_DONATIONS, { distributor: user.organization })
      .then((rsp) => setAcceptedDonations(rsp.data.map(x => 
        ({...x, address: x.address + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code}))))
      .catch ((err) => console.log('Failed to get accepted donations table ', err));

    axios.get(API_ROUTE.DONATION)
      .then((rsp) => setAvailableDonations(rsp.data.map(x => 
        ({...x, address: x.address + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code}))))
      .catch ((err) => console.log('Failed to get available donations table ', err));
  }

  const donationRsp = (id, status) => {
    const distributor = (status === 'PENDING') ? '' : user.organization
    axios.put(API_ROUTE.ACCEPT_DONATION, { id, status, distributor: distributor })
      .then((rsp) => loadTables())
      .catch ((err) => {
        loadTables()
        toast.error('Error accepting donation. Try again later.')
        console.log('Error accepting donation. ', err)
      })
  }

  const seeMore = (donation) => {
    setSelectedDonation(donation)
    setAcceptedDialog(true)
  }

  // Update column names so they are more human readable.
  // ex. column name 'from_date' would become 'From Date'.
  const formatHeader = (name) =>
    name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Display the table 
  const PrintTable = ({rows, accepted}) => {
    return (
      <TableContainer component={Paper} sx={{ maxHeight: "400px", maxWidth: '1200px' }}>
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              {columns.map(x => <TableCell key={x}> {formatHeader(x)} </TableCell>)}
              { accepted ? ( 
                <>
                  <TableCell key='more'> More </TableCell>
                  <TableCell key='cancel'> Cancel </TableCell>
                  <TableCell key='done'> Done </TableCell>
                </> 
                ) : ( <TableCell key='accept'> Accept </TableCell> )
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? rows.map((rowData) => (
              <TableRow key={rowData.id} hover>
                {columns.map(x => 
                  <TableCell key={x}> 
                    { isDate(x) ? moment(rowData[x]).format('MM/DD hh:mm a') : rowData[x] } 
                  </TableCell>
                )}
                { accepted ? (
                  <>
                    <TableCell key='more'> 
                      <IconButton onClick={() => seeMore(rowData)} color='primary' size='small' sx={{ p:0 }}> 
                        <MoreHorizIcon/> 
                      </IconButton> 
                    </TableCell>
                    <TableCell key='cancel'> 
                      <IconButton onClick={() => donationRsp(rowData.id, 'PENDING')} color='error' size='small' sx={{ p:0 }}> 
                        <CloseIcon/> 
                      </IconButton> 
                    </TableCell>
                    <TableCell key='done'> 
                      <IconButton onClick={() => donationRsp(rowData.id, 'COMPLETED')} color='success' size='small' sx={{ p:0 }}> 
                        <CheckIcon/>
                      </IconButton> 
                    </TableCell>
                  </>
                  ):(
                    <TableCell key='accept'> 
                      <IconButton onClick={() => donationRsp(rowData.id, 'ACCEPTED')} color='success' size='small' sx={{ p:0 }}> 
                        <CheckIcon/>
                      </IconButton> 
                    </TableCell>
                  )
                }
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

      <Dialog open={acceptedDialog} onClose={() => setAcceptedDialog(false)}>
        <DialogTitle> Donation Accepted </DialogTitle>
        { selectedDonation && 
          <DialogContent> 
            This donation can be picked up anytime from <br/>
            {moment(selectedDonation.from_date).format('MM/DD hh:mm a')} {' to '}
            {moment(selectedDonation.to_date).format('MM/DD hh:mm a')}<br/>
            from {selectedDonation.address} 
            <br/><br/>
            <b> Donation Contact: </b> <br/>
            {selectedDonation.poc_name} {selectedDonation.poc_phone}
            {selectedDonation.notes && 
              <>
                <b> Additional notes: </b> <br/>
                {selectedDonation.notes}
              </>
            }
          </DialogContent>
        }
      </Dialog>
    </div>
  );
}
