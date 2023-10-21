// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, CardActionArea, CardContent, CardMedia } from '@mui/material';
import moment from 'moment';

import { API_ROUTE, APP_ROUTE } from '../utils/constants';

const columns = [ 'item', 'quantity', 'from_date', 'to_date', 'distributor', 'status' ];

const isDate = (field_name) => field_name === 'from_date' || field_name === 'to_date'

const cardMediaStyle={
  height: '100px',
  width: '100px',
  margin: 'auto'
};  

export default function DonorDash({user}) {

  const [rows, setRows] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      axios.post(API_ROUTE.DONOR_DONATIONS, { donor: user.organization })
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
      <TableContainer component={Paper} sx={{ maxHeight: "200px", width: '1000px' }}>
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
            )) : (<TableRow><TableCell>No donations yet</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return(
    <div>
      <Typography variant='h5' color='primary' align='left'> Donations </Typography>
      <div style={{ display: 'flex' }}>
        <PrintTable/>
        <CardActionArea onClick={() => navigate(APP_ROUTE.DONATE)} sx={{ minHeight: 120, width: '200px' }}>
          <CardMedia image={"https://img.icons8.com/bubbles/100/add.png"} sx={cardMediaStyle} />
          <CardContent>
            <Typography variant="h5"> Make a Donation </Typography>
          </CardContent>
        </CardActionArea>
      </div>
    </div>
  );
}
