const API_URL = 'http://localhost:9000'

export const API_ROUTE = {
  // Account paths
  SIGN_UP: `${API_URL}/account/signup`,
  SIGN_IN: `${API_URL}/account/signin`,
  GET_USER: `${API_URL}/account/me`,
  UPDATE_USER: `${API_URL}/account/update`,
  UPDATE_PASSWORD: `${API_URL}/account/updatePassword`,
  ORG_DETAILS: `${API_URL}/account/org`,
  // Donation paths
  DONATION: `${API_URL}/donation`,
  DONOR_DONATIONS: `${API_URL}/donation/donor`,
  ACCEPTED_DONATIONS: `${API_URL}/donation/accepted`,
  DONATION_STATUS: `${API_URL}/donation/status`,
}

export const APP_ROUTE = {
  SIGN_UP: '/signup',
  SIGN_IN: '/signin',
  ACCOUNT: '/account',
  DASH: '/dash',
  DONATE: '/donate',
  HOME: '/',
}

export const DEFAULT_ACCOUNT = {
  role: 'DONOR',
  email: '',
  password: '',
  organization: '', 
  address: '', 
  city: '', 
  state: '', 
  zip_code: '', 
  phone: '', 
  poc_name: '', 
  poc_phone: '', 
  active: 1
}
