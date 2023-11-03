// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IMaskMixin } from 'react-imask';

// MUI imports
import { Paper, Typography, Stack, TextField, Button, Autocomplete } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker  } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import moment from 'moment';

// Local imports
import { API_ROUTE, APP_ROUTE } from '../utils/constants';
import { useUser } from '../auth/customHooks';
import states from '../utils/states.json'

const IMaskPhoneInput = IMaskMixin(({ ...props }) => {
  return <TextField {...props} />;
});

// Set default values for the from and to dates
const DEFAULT_FROM_DATE = new Date();
const DEFAULT_TO_DATE = new Date();
DEFAULT_TO_DATE.setHours(DEFAULT_TO_DATE.getHours() + 4);

export default function Donate() {

  const [fromDate, setFromDate] = useState(dayjs(DEFAULT_FROM_DATE))
  const [toDate, setToDate] = useState(dayjs(DEFAULT_TO_DATE))
  const [donation, setDonation] = useState(null)

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      setDonation({
        item: '',
        quantity: 1,
        donor: user.organization,
        address: user.address,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        poc_name: user.poc_name,
        poc_phone: user.poc_phone,
        notes: '',
        from_date: moment(DEFAULT_FROM_DATE).format('YYYY-MM-DD HH:mm'),
        to_date: moment(DEFAULT_TO_DATE).format('YYYY-MM-DD HH:mm'),
      })
    }
  }, [user]);

  // Handle input change
  const updateDonation = (name, value) => setDonation({ ...donation, [name]: value });
  const onInputChange = (e) => updateDonation(e.target.name, e.target.value);

  const onDateChange = (name, setter, value) => {
    setter(value);
    updateDonation(name, moment(value?.$d).format('YYYY-MM-DD HH:mm'));
  }

  const submit = () => {
    // Validate all required fields were entered correctly
    if (!donation.item || !(Number(donation.quantity) > 0) || !donation.address || 
        !donation.city || !donation.state || !(donation.zip_code.length > 4) || !donation.poc_name || 
        !(donation.poc_phone.length === 14) || !donation.from_date || !donation.to_date ) {
      toast.error("Please fill each field");
      return;
    }

    axios.post(API_ROUTE.DONATION, donation) 
      .then((rsp) => {
        toast.success("Thanks for donating!");
        navigate(APP_ROUTE.DASH);
      })
      .catch ((err) => {
        toast.error("Failed to create donation. Try again later.");
        console.log('Failed to create donation: ', err);
      });
  }

  if (!donation) return <h2> Please login to make a donation. </h2>
  else return(
    <Paper className='form'>
      <Stack spacing={2}>
        <Typography variant='h4' align='center' color='primary'> Donation Details </Typography>
        <div style={{ display:'flex' }}>
          <TextField 
            label="Item" 
            name="item" 
            variant="outlined"
            fullWidth
            required
            value={donation.item} 
            onChange={onInputChange}
            inputProps={{ maxLength: 64 }}
            error={!donation.item}
          />
          <TextField 
            label="Quantity" 
            name="quantity" 
            type='number'
            variant="outlined" 
            required
            value={donation.quantity} 
            onChange={onInputChange}
            error={!(Number(donation.quantity) > 0)}
          />
        </div>
        <Typography variant='h6' color='primary'> Pickup Location </Typography>
        <TextField 
          label="Address" 
          name="address" 
          variant="outlined" 
          required
          value={donation.address} 
          onChange={onInputChange}
          inputProps={{ maxLength: 255 }}
          error={!donation.address}
        />
        <div style={{ display:'flex' }}>
          <TextField 
            label="City" 
            name="city" 
            required
            fullWidth
            value={donation.city} 
            onChange={onInputChange}
            inputProps={{ maxLength: 32 }}
            error={!donation.city}
          />
          <Autocomplete
            options={states}
            value={donation.state ? donation.state : null} 
            onChange={(e,v) => setDonation(prevState => ({...prevState, state: v }))}
            renderInput={(params) => <TextField {...params} label="State*" error={!donation.state}/>}
          />
          <TextField
            label="Zip Code"
            name="zip_code"
            required
            value={donation.zip_code} 
            onChange={onInputChange}
            error={!(donation.zip_code.length > 4)}
            inputProps={{ maxLength: 10 }}
          />
        </div>
        <Typography variant='h6' color='primary'> Availability </Typography>
        
        <div style={{ display:'flex' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker 
              label='From Date'
              value={fromDate}
              disablePast
              onChange={(v) => onDateChange('from_date', setFromDate, v)}
              slotProps={{
                textField: { fullWidth: true, error: !donation.from_date }
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker 
              label='To Date'
              value={toDate}
              disablePast
              onChange={(v) => onDateChange('to_date', setToDate, v)}
              slotProps={{
                textField: { fullWidth: true, error: !donation.to_date }
              }}
            />
          </LocalizationProvider>
        </div>
        <div>
          <Typography variant='h6' color='primary'> Person of Contact </Typography>
          <Typography variant='body2'> Please identify a person of contact for the donation. </Typography>
        </div>
        <TextField 
          label="Name" 
          name="poc_name" 
          variant="outlined" 
          required
          value={donation.poc_name} 
          onChange={onInputChange}
          inputProps={{ maxLength: 64 }}
          error={!donation.poc_name}
        />
        <IMaskPhoneInput
          // label="Phone" 
          placeholder='Phone*'
          name="poc_phone" 
          mask='(000) 000-0000'
          variant="outlined" 
          required
          value={donation.poc_phone ? donation.poc_phone : ''}
          error={!(donation.poc_phone.length === 14)}
          onChange={onInputChange}
        />
        <Typography variant='h6' color='primary'> Additional notes/ instructions </Typography>
        <TextField 
          label="Notes" 
          name="notes" 
          variant="outlined"
          multiline
          value={donation.notes} 
          onChange={onInputChange}
          inputProps={{ maxLength: 255 }}
        />
        <Button onClick={submit} size="large" variant='contained'> Make Donation </Button> 
      </Stack>
    </Paper>
  );
}
