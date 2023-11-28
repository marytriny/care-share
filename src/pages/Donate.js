// Import packages
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

// Local imports
import DonorForm from '../components/DonorForm'
import { API_ROUTE, APP_ROUTE } from '../utils/constants';
import { useUser } from '../auth/customHooks';

// Set default values for the from and to dates
const DEFAULT_FROM_DATE = new Date();
const DEFAULT_TO_DATE = new Date();
DEFAULT_TO_DATE.setHours(DEFAULT_TO_DATE.getHours() + 4);

export default function Donate() {

  const [donation, setDonation] = useState(null)
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if(user) {
      setDonation({
        item: '',
        quantity: 1,
        value: 1,
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

  const submit = () => axios.post(API_ROUTE.DONATION, donation) 
    .then((rsp) => {
      toast.success("Thanks for donating!");
      navigate(APP_ROUTE.DASH);
    })
    .catch ((err) => {
      toast.error("Failed to create donation. Try again later.");
      console.log('Failed to create donation: ', err);
    });

  if (!donation) return <h2> Please login to make a donation. </h2>;
  else return<DonorForm donation={donation} setDonation={setDonation} submit={submit} add/>;
}
