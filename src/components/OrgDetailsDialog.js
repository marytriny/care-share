// Import packages
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export default function OrgDetailsDialog({org, showMoreDialog, setShowMoreDialog}) {
  
  if (!org) return null;
  else return(
    <Dialog open={showMoreDialog} onClose={() => setShowMoreDialog(false)}>
      <DialogTitle align='center'> Details </DialogTitle>
      <DialogContent> 
        { org.role === 'DONOR' && 
          <>
            This donation can be picked up anytime from <br/>
            <b>{org.from_date}</b> {' to '} <b>{org.to_date}</b> <br/>
            <br/>
          </> 
        }
        <b> {org.organization} </b> <br/>
        {org.address} <br/>
        {org.email} <br/>
        {org.phone} <br/>
        <br/>
        <b> Point of Contact: </b> <br/>
        {org.poc_name} {org.poc_phone}
        {org.notes && 
          <>
            <br/> <br/>
            <b> Additional notes: </b> <br/>
            {org.notes}
          </>
        }
      </DialogContent>
    </Dialog>
  );
}
