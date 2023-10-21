// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import moment from 'moment';

import { useUser } from '../utils/customHooks';
import { API_ROUTE, APP_ROUTE } from '../utils/constants';

const columns = [ 
  'item',
  'quantity',
  'from_date', 
  'to_date', 
  'distributor', 
  'status', 
];

const isDate = (field_name) => field_name === 'from_date' || field_name === 'to_date'

export default function Dash() {

  const [rows, setRows] = useState([])
  const { user, authenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      axios.get(`${API_ROUTE.DONATION}${user.organization}`)
      .then((rsp) => setRows(rsp.data))
      .catch ((err) => console.log('Failed to get donation table ', err));
    }
  }, [user]);

  // Update column names so they are more human readable.
  // ex. column name 'from_date' would become 'From Date'.
  const formatHeader = (name) =>
    name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Display the table 
  const PrintTable = () => {
    return (
      <TableContainer component={Paper} sx={{ maxHeight: "200px", width: '800px' }}>
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              {columns.map(x => <TableCell key={x}> {formatHeader(x)} </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? rows.map((rowData) => (
              <TableRow key={rowData.id} hover onClick={() => navigate(`/edit/${rowData.id}`)}>
                {columns.map(x => 
                  <TableCell key={x}> 
                    { isDate(x) ? moment(rowData[x]).format('MM/DD/YY hh:mm a') : rowData[x] } 
                  </TableCell>
                )}
              </TableRow>
            )) : (<TableRow><TableCell>No results found</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!user || !authenticated) return <h2>Please login to access dashboard.</h2>
  
  return(
    <>
      <h2> Welcome {user.organization}! </h2>
      <Button href={APP_ROUTE.DONATE} variant='contained'> Make a Donation </Button>
      <Typography variant='h6' color='primary' align='left'> Donations </Typography>
      <div>
        <PrintTable/>
      </div>
    </>
  );
}
