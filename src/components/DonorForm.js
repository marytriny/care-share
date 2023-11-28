// Import packages
import React, { useState } from 'react';
import { IMaskMixin } from 'react-imask';
import { toast } from 'react-toastify';

// MUI imports
import { Paper, Typography, Stack, TextField, Button, Autocomplete, InputAdornment } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker  } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import moment from 'moment';

// Local imports
import states from '../utils/states.json'

const IMaskPhoneInput = IMaskMixin(({ ...props }) => {
  return <TextField {...props} />;
});

export default function DonorForm({ donation, setDonation, submit, add }) {

  const [fromDate, setFromDate] = useState(dayjs(donation.from_date))
  const [toDate, setToDate] = useState(dayjs(donation.to_date))

  // Handle input change
  const updateDonation = (name, value) => setDonation({ ...donation, [name]: value });
  const onInputChange = (e) => updateDonation(e.target.name, e.target.value);

  const onDateChange = (name, setter, value) => {
    setter(value);
    updateDonation(name, moment(value?.$d).format('YYYY-MM-DD HH:mm'));
  }

  const onSubmit = () => {
    
    // Validate all required fields were entered correctly
    if (!donation.item || !(Number(donation.quantity) > 0) || !(Number(donation.value) > 0) || !donation.address || 
        !donation.city || !donation.state || !(donation.zip_code.length > 4) || !donation.poc_name || 
        !(donation.poc_phone.length === 14) || !donation.from_date || !donation.to_date ) {
      toast.error("Please fill each field");
      return;
    }

    submit();
  }

  return(
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
          <TextField 
            label="Value" 
            name="value" 
            type='number'
            variant="outlined" 
            required
            value={donation.value} 
            onChange={onInputChange}
            error={!(Number(donation.value) > 0)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
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
        <Button onClick={onSubmit} size="large" variant='contained'> {add ? 'Make Donation' : 'Update'} </Button> 
      </Stack>
    </Paper>
  );
}
