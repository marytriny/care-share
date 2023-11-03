// Import packages
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { IMaskMixin } from 'react-imask';
import { Paper, Typography, Stack, TextField, Button, ToggleButtonGroup, 
  ToggleButton, Autocomplete, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';

// Local imports
import states from '../utils/states.json'

const IMaskPhoneInput = IMaskMixin(({ ...props }) => {
  return <TextField {...props} />;
});

const AccountFrom = ({ account, setAccount, submitText, onSubmit, update, updatePassword }) => {

  const [changePwdDialog, setChangePwdDialog] = useState(false)

  function isEmailValid(email) {
    const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(email) return EMAIL_REGEX.test(email);
    else return true;
  }
  function isPhoneValid(phone) {
    if(phone) return phone.length === 14;
    else return true;
  }
  function isZipValid(zip) {
    if(zip) return zip.length > 4;
    else return true;
  }

  // Validate all required fields are populated correctly
  const validateForm = () => {
    if (!account.role || !account.email || !isEmailValid(account.email) || ( !update && !account.password) ||
        !account.organization || !account.address || !account.city || !account.state || 
        !account.zip_code || !isZipValid(account.zip_code) || !account.phone || !isPhoneValid(account.phone) ||
        !account.poc_name || !account.poc_phone || !isPhoneValid(account.poc_phone)) {
      toast.error("Please fill each field");
      return;
    }
    console.log(account);
    onSubmit();
  }

  // Handle input change
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setAccount(prevState => ({ ...prevState, [name]: value }))
  }

  const handlePasswordChange = () => {
    updatePassword()
    setChangePwdDialog(false)
  }

  return (
    <Paper className='form'>
      <Stack spacing={2}>
        { update ? (
          <Typography variant='h4' align='center' color='primary'> Account Details </Typography>
        ) : (
          <Typography variant='h4' align='center' color='primary'> Let's get started! </Typography>
        )}
        
        <Typography variant='h6' color='primary'> Account Type </Typography>
        <ToggleButtonGroup 
          fullWidth 
          exclusive 
          color='primary'
          disabled={update}
          value={account.role} 
          onChange={(e,v) => setAccount(prevState => ({...prevState, role: v }))}
        >
          <ToggleButton value={'DONOR'}> Donor </ToggleButton>
          <ToggleButton value={'DISTRIBUTOR'}> Distributor  </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant='h6' color='primary'> Organization Details </Typography>
        <TextField 
          label="Name" 
          name="organization" 
          variant="outlined"
          required
          value={account.organization} 
          onChange={onInputChange}
          inputProps={{ maxLength: 64 }}
        />
        <TextField 
          label="Email" 
          name="email" 
          variant="outlined" 
          required
          helperText='This will also serve as the account username'
          value={account.email} 
          onChange={onInputChange}
          error={!isEmailValid(account.email)}
          inputProps={{ maxLength: 255 }}
        />
        <IMaskPhoneInput 
          // label="Phone" 
          placeholder='Phone*'
          name="phone" 
          mask='(000) 000-0000'
          variant="outlined" 
          required
          value={account.phone} 
          onChange={onInputChange}
          error={!isPhoneValid(account.phone)}
        />
        <TextField 
          label="Address" 
          name="address" 
          variant="outlined" 
          required
          value={account.address} 
          onChange={onInputChange}
          inputProps={{ maxLength: 255 }}
        />
        <div style={{ display:'flex' }}>
          <TextField 
            label="City" 
            name="city" 
            required
            fullWidth
            value={account.city} 
            onChange={onInputChange}
            inputProps={{ maxLength: 32 }}
          />
          <Autocomplete
            options={states}
            value={account.state ? account.state : null} 
            onChange={(e,v) => setAccount(prevState => ({...prevState, state: v }))}
            renderInput={(params) => <TextField {...params} label="State*" />}
          />
          <TextField
            label="Zip Code"
            name="zip_code"
            required
            value={account.zip_code} 
            onChange={onInputChange}
            error={!isZipValid(account.zip_code)}
            inputProps={{ maxLength: 10 }}
          />
        </div>
        <div>
          <Typography variant='h6' color='primary'> Person of Contact </Typography>
          <Typography variant='body2'> 
            Please identify a person of contact for orders. This can be updated at
            any time, and there will be an opportunity to provide a different contact in every order.
          </Typography>
        </div>
        <TextField 
          label="Name" 
          name="poc_name" 
          variant="outlined" 
          required
          value={account.poc_name} 
          onChange={onInputChange}
          inputProps={{ maxLength: 64 }}
        />
        <IMaskPhoneInput
          // label="Phone" 
          placeholder='Phone*'
          name="poc_phone" 
          mask='(000) 000-0000'
          variant="outlined" 
          required
          value={account.poc_phone ? account.poc_phone : ''} 
          error={!isPhoneValid(account.poc_phone)}
          onChange={onInputChange}
        />
        <div>
          <Typography variant='h6' color='primary'> Account Password </Typography>
          { update ? (
            <Button color='gray' variant='contained' onClick={() => setChangePwdDialog(true)}> 
              Update Password 
            </Button>
          ) : (
            <TextField 
              label="Account Password" 
              name="password" 
              type="password"
              variant="outlined"
              required
              onChange={onInputChange}
            />
          )}          
        </div>     
        <Button onClick={validateForm} size="large" variant='contained'> { submitText } </Button> 
      </Stack>

      {/* Dialog to change password when updating account details */}
      <Dialog open={changePwdDialog} onClose={() => setChangePwdDialog(false)}>
        <DialogTitle> Change Password </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: '5px' }}>
            <TextField
              label="Current Password" 
              name="current_password" 
              type="password"
              variant="outlined"
              onChange={onInputChange}
            />
            <TextField
              label="New Password" 
              name="password" 
              type="password"
              variant="outlined"
              onChange={onInputChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={() => setChangePwdDialog(false)}> Cancel </Button>
          <Button variant='contained' onClick={handlePasswordChange}> Update </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default AccountFrom;
