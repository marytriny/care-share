// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartesianGrid, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts'
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, IconButton, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';

import { API_ROUTE } from '../utils/constants';
import { generateReport } from '../utils/common';
import OrgDetailsDialog from '../components/OrgDetailsDialog'

const columns = [ 'item', 'quantity', 'from_date', 'to_date', 'donor', 'address' ];
const isDate = (field_name) => (field_name === 'from_date' || field_name === 'to_date');

export default function DonorDash({user}) {

  // Table data for all available and accepted donations
  const [availableDonations, setAvailableDonations] = useState([])
  const [acceptedDonations, setAcceptedDonations] = useState([])
  const [completedDonations, setCompletedDonations] = useState([])

  const [showMoreDialog, setShowMoreDialog] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState(null)

  useEffect(() => {
    if(user) loadTables();
  }, [user]);

  const loadTables = () => {
    axios.post(API_ROUTE.ACCEPTED_DONATIONS, { distributor: user.organization })
      .then((rsp) => setAcceptedDonations(rsp.data.map(x => 
        ({...x, address: x.address + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code}))))
      .catch((err) => console.log('Failed to get accepted donations data ', err));

    axios.get(API_ROUTE.DONATION)
      .then((rsp) => setAvailableDonations(rsp.data.map(x => 
        ({...x, address: x.address + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code}))))
      .catch((err) => console.log('Failed to get available donations data ', err));

    axios.post(API_ROUTE.DISTRIBUTOR_STATS, { distributor: user.organization })
      .then((rsp) => setCompletedDonations(rsp.data))
      .catch((err) => console.log('Failed to get completed donations data ', err));
  }

  const donationRsp = (data, status) => {
    const distributor = (status === 'PENDING') ? '' : user.organization
    axios.put(API_ROUTE.DONATION_STATUS, { id: data.id, status, distributor })
      .then((rsp) => {
        if (status === 'ACCEPTED') showMore(data);
        loadTables()
      })
      .catch ((err) => {
        loadTables()
        toast.error('Error accepting donation. Try again later.')
        console.log('Error accepting donation. ', err)
      })
  }

  const getReport = async() => {
    const rsp = await axios.post(API_ROUTE.COMPLETED_DONATIONS, { distributor: user.organization })
    const rows = rsp.data.map(x => 
      ({...x, address: x.address + ' ' + x.city + ' ' + x.state + ' ' + x.zip_code}))
    generateReport(columns, rows)
  }

  const showMore = (donation) => {
    axios.post(API_ROUTE.ORG_DETAILS, { organization: donation.donor })
    .then((rsp) => {
      donation = {...rsp.data, 
        address: donation.address,
        from_date: moment(donation.from_date).format('MM/DD hh:mm a'),
        to_date: moment(donation.to_date).format('MM/DD hh:mm a'),
        notes: donation.notes
      }
      setSelectedDonation(donation)
      setShowMoreDialog(true)
    })
    .catch ((err) => {
      toast.error('Error retrieving org info. Try again later.')
      console.log('Error retrieving org info. ', err)
    })
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
                      <IconButton onClick={() => showMore(rowData)} color='primary' size='small' sx={{ p:0 }}> 
                        <MoreHorizIcon/> 
                      </IconButton> 
                    </TableCell>
                    <TableCell key='cancel'> 
                      <IconButton onClick={() => donationRsp(rowData, 'PENDING')} color='error' size='small' sx={{ p:0 }}> 
                        <CloseIcon/> 
                      </IconButton> 
                    </TableCell>
                    <TableCell key='done'> 
                      <IconButton onClick={() => donationRsp(rowData, 'COMPLETED')} color='success' size='small' sx={{ p:0 }}> 
                        <CheckIcon/>
                      </IconButton> 
                    </TableCell>
                  </>
                  ):(
                    <TableCell key='accept'> 
                      <IconButton onClick={() => donationRsp(rowData, 'ACCEPTED')} color='success' size='small' sx={{ p:0 }}> 
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
    <div style={{ marginBottom: '60px' }}>
      {/* Accepted Donations Table */}
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

      {/* Available Donations Table */}
      <Typography variant='h5' color='primary' align='left' sx={{mt: '40px'}}> Available Donations </Typography>
      <PrintTable rows={availableDonations} />

      {/* Completed Donations Chart */}
      <Typography variant='h5' color='primary' align='left' sx={{mt: '40px'}}> Completed Donations </Typography>
      <Typography align='left' color='subtext.main'> 
        The chart below shows all donations successfully completed by {user?.organization} so far.
      </Typography>
      <div style={{ maxWidth: '1000px', marginTop: '20px' }}>
        <AreaChart width={1000} height={400} data={completedDonations} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="from_date" name='Time' />
          <YAxis dataKey="quantity" name='Quantity' />
          <Tooltip />
          <Area type="monotone" dataKey="quantity" name='Quantity' stroke="#d7bde2" fill="#d7bde2" />
        </AreaChart>    
        {/* CSV Report Button */}
        <div style={{ textAlign: 'right' }}>
          <Button onClick={getReport} variant='contained' size='small'> 
            Generate CSV Report
          </Button>
        </div> 
      </div>
      {/* Dialog */}
      <OrgDetailsDialog org={selectedDonation} showMoreDialog={showMoreDialog} setShowMoreDialog={setShowMoreDialog} />
    </div>
  );
}
