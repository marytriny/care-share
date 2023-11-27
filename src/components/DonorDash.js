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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import usZips from 'us-zips'

// Local imports
import { API_ROUTE, APP_ROUTE } from '../utils/constants';
import { printRow, generateReport } from '../utils/common';
import OrgDetailsDialog from '../components/OrgDetailsDialog';
import Map from './Map';

// Donation table columns
const columns = [ 'item', 'quantity', 'value', 'from_date', 'to_date', 'distributor', 'status' ];

const cardMediaStyle={
  height: '100px',
  width: '100px',
  margin: 'auto'
};  

export default function DonorDash({user}) {

  // Used to make CSS adaptive to smaller screens like mobile and tablet devices.
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  const [rows, setRows] = useState([])
  const [showMoreDialog, setShowMoreDialog] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [donationsOverTime, setDonationsOverTime] = useState([])
  const [allDistributors, setallDistributors] = useState([])
  const [location, setLocation] = useState([28.032879, -80.81605])

  const navigate = useNavigate();

  // On page load, get the donations table and chart data
  useEffect(() => {
    if(user) {
      loadTable()
      const loc = usZips[user.zip_code]
      setLocation([loc.latitude, loc.longitude])
      axios.post(API_ROUTE.DONOR_STATS, { donor: user.organization })
        .then((rsp) => setDonationsOverTime(rsp.data))
          .catch ((err) => console.log('Failed to get donation table ', err));
      axios.get(API_ROUTE.ALL_DISTRIBUTORS)
        .then((rsp) => setallDistributors(rsp.data))
        .catch((err) => console.log('Failed to get all distributors data for map ', err));
    };
    // eslint-disable-next-line
  }, [user]);

  const loadTable = () => {
    axios.post(API_ROUTE.DONOR_DONATIONS, { donor: user.organization })
      .then((rsp) => setRows(rsp.data))
      .catch ((err) => console.log('Failed to get donation table ', err));
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
      setSelectedOrg(rsp.data)
      setShowMoreDialog(true)
    })
    .catch ((err) => {
      toast.error('Error retrieving org info. Try again later.')
      console.log('Error retrieving org info. ', err)
    })
  }

  const rowColor = status => {
    switch (status) {
      case 'PENDING': return theme.palette.pending.main;
      case 'ACCEPTED': return theme.palette.accepted.main;
      default: return ''
    }
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
              <TableRow key={rowData.id} hover sx={{ backgroundColor: rowColor(rowData.status) }}>
                {columns.map(x => printRow(x, rowData, showMore))} 
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
        <Button onClick={() => generateReport(columns, rows)} variant='contained' size='small'> 
          Generate CSV Report
        </Button>
      </div>
      
      {/* Chart */}
      <div style={{ maxWidth: '1000px', margin: '60px 0'}}>
        <Typography variant='h5' color='primary' align='left'>
          Your Impact
        </Typography>
        <Typography align='left' color='subtext.main' sx={{ mb: 1 }}>
          The chart below shows all successful donations over time made by {user?.organization}.
        </Typography>  
        <AreaChart width={mobile ? 380 : 1000} height={400} data={donationsOverTime} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="from_date" name='Time' />
          <YAxis dataKey="value" name='Value' />
          <Tooltip />
          <Area type="monotone" dataKey="value" name='Value' stroke="#d7bde2" fill="#d7bde2" />
        </AreaChart>    
      </div>

      {/* All Distributors Map */}
      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
        <Typography variant='h5' color='primary' align='left' sx={{mt: '40px'}}> Nearby Distributors </Typography>
        <Typography align='left' color='subtext.main'>
          View all distributors and their location in the map below.
        </Typography>   
        <Map center={location} zoom={10} markers={allDistributors} usePin />
      </div>

      {/* Dialog */}
      <OrgDetailsDialog org={selectedOrg} showMoreDialog={showMoreDialog} setShowMoreDialog={setShowMoreDialog} />
    </div>
  );
}
