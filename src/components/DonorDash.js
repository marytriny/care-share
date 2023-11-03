// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CartesianGrid, Tooltip, XAxis, YAxis, AreaChart, Area } from 'recharts'
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, 
  CardActionArea, CardContent, CardMedia, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UndoIcon from '@mui/icons-material/Undo';
import moment from 'moment';

// Local imports
import { API_ROUTE, APP_ROUTE } from '../utils/constants';
import OrgDetailsDialog from '../components/OrgDetailsDialog'

// Donation table columns
const columns = [ 'item', 'quantity', 'from_date', 'to_date', 'distributor', 'status' ];

const cardMediaStyle={
  height: '100px',
  width: '100px',
  margin: 'auto'
};  

export default function DonorDash({user}) {

  const [rows, setRows] = useState([])
  const [showMoreDialog, setShowMoreDialog] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [donationsOverTime, setDonationsOverTime] = useState([])

  const navigate = useNavigate();

  // On page load, get the donations table and chart data
  useEffect(() => {
    if(user) {
      loadTable()
      axios.post(API_ROUTE.DONOR_STATS, { donor: user.organization })
        .then((rsp) => setDonationsOverTime(rsp.data))
        .catch ((err) => console.log('Failed to get donation table ', err));
    };
    // eslint-disable-next-line
  }, [user]);

  const loadTable = () => {
    axios.post(API_ROUTE.DONOR_DONATIONS, { donor: user.organization })
      .then((rsp) => setRows(rsp.data))
      .catch ((err) => console.log('Failed to get donation table ', err));
  }

  // Generate CSV report of all donations by the current donor and download file to machine.
  const generateReport = () => {
    // Convert array of objects to CSV
    const fileData = [
      columns.join(','),
      ...rows.map(obj => columns.reduce((acc, key) =>
        `${acc}${!acc.length ? '' : ','}"${(obj[key] === null) ? '' : String(obj[key])}"`, ''
      ))
    ].join('\n');

    // Create Blob
    const blob = new Blob([fileData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    // window.open(url) // to open in new tab
    
    // Download CSV
    const link = document.createElement("a")
    link.download = `careshare_donations_${moment(new Date()).format("YY-MM-DD")}.csv`
    link.href = url
    link.click()
    link.remove()
  }

  const cancel = (id, cancel = false) => {
    const status = cancel ? 'CANCELLED' : 'PENDING'
    axios.put(API_ROUTE.DONATION_STATUS, { id, status, distributor: '' })
      .then((rsp) => loadTable())
      .catch ((err) => {
        loadTable()
        toast.error('Error cancelling donation. Try again later.')
        console.log('Error cancelling donation. ', err)
      })
  }

  const showMore = (donation) => {
    axios.post(API_ROUTE.ORG_DETAILS, { organization: donation.distributor })
    .then((rsp) => {
      const distributor = { ...rsp.data, 
        address: rsp.data.address + ' ' + rsp.data.city + ' ' + rsp.data.state + ' ' + rsp.data.zip_code 
      }
      setSelectedOrg(distributor)
      setShowMoreDialog(true)
    })
    .catch ((err) => {
      toast.error('Error retrieving org info. Try again later.')
      console.log('Error retrieving org info. ', err)
    })
  }

  const printRow = (column, obj) => {
    let rowData = '';
    if (column === 'from_date' || column === 'to_date') {
      rowData = moment(obj[column]).format('MM/DD hh:mm a');
    }
    else if (column === 'distributor') {
      rowData = <Button onClick={() => showMore(obj)} size='small'> {obj[column]} </Button>
    }
    else rowData = obj[column];

    return <TableCell key={column}> { rowData } </TableCell>;
  }

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
              <TableCell key='cancel'> Cancel </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? rows.map((rowData) => (
              <TableRow key={rowData.id} hover>
                {columns.map( x => printRow(x, rowData) )}
                <TableCell key='cancel'> 
                  { rowData.status === 'PENDING' &&
                    <IconButton onClick={() => cancel(rowData.id, true)} size='small' color='error' sx={{ p:0 }}> 
                      <CloseIcon/> 
                    </IconButton>
                  }
                  { rowData.status === 'CANCELLED' &&
                    <IconButton onClick={() => cancel(rowData.id)} size='small' color='primary' sx={{ p:0 }}> 
                      <UndoIcon/> 
                    </IconButton>
                  }
                </TableCell>
              </TableRow>
            )) : (<TableRow><TableCell>No donations yet</TableCell></TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return(
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      {/* Table and New Donation button */}
      <Typography variant='h5' color='primary' align='left' sx={{mt: '40px'}}> Donations </Typography>
      <div style={{ display: 'flex' }}>
        <PrintTable/>
        <CardActionArea onClick={() => navigate(APP_ROUTE.DONATE)} sx={{ minHeight: 120, width: '200px' }}>
          <CardMedia image={"https://img.icons8.com/bubbles/100/add.png"} sx={cardMediaStyle} />
          <CardContent>
            <Typography variant="h5"> Make a Donation </Typography>
          </CardContent>
        </CardActionArea>
      </div>
      {/* CSV Report Button */}
      <div style={{ textAlign: 'left' }}>
        <Button onClick={generateReport} variant='contained' size='small'> 
          Generate CSV Report
        </Button>
      </div>

      {/* Chart */}
      <div style={{ maxWidth: '1000px', margin: '60px 0'}}>
        <AreaChart width={1000} height={400} data={donationsOverTime} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="from_date" name='Time' />
          <YAxis dataKey="quantity" name='Quantity' />
          <Tooltip />
          <Area type="monotone" dataKey="quantity" name='Quantity' stroke="#d7bde2" fill="#d7bde2" />
        </AreaChart>    
        <Typography variant='h4' color='primary'>
          Total Donations over Time
        </Typography>
        <Typography>
          The chart above shows all successful donations over time made by {user?.organization}.
        </Typography>  
      </div>
      {/* Dialog */}
      <OrgDetailsDialog org={selectedOrg} showMoreDialog={showMoreDialog} setShowMoreDialog={setShowMoreDialog} />
    </div>
  );
}
