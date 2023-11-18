const API_URL = 'http://localhost:9000'

export const API_ROUTE = {
  // Account paths
  SIGN_UP: `${API_URL}/account/signup`,
  SIGN_IN: `${API_URL}/account/signin`,
  GET_USER: `${API_URL}/account/me`,
  UPDATE_USER: `${API_URL}/account/update`,
  UPDATE_PASSWORD: `${API_URL}/account/updatePassword`,
  ORG_DETAILS: `${API_URL}/account/org`,
  ALL_DONORS: `${API_URL}/account/allDonors`,
  ALL_DISTRIBUTORS: `${API_URL}/account/allDistributors`,
  // Donation paths
  DONATION: `${API_URL}/donation`,
  DONOR_DONATIONS: `${API_URL}/donation/donor`,
  DONOR_STATS: `${API_URL}/donation/donorStats`,
  DISTRIBUTOR_STATS: `${API_URL}/donation/distributorStats`,
  ACCEPTED_DONATIONS: `${API_URL}/donation/accepted`,
  COMPLETED_DONATIONS: `${API_URL}/donation/completed`,
  DONATION_STATUS: `${API_URL}/donation/status`,
  UPDATE_EXPIRED: `${API_URL}/donation/expired`,
  HOME_DATA: `${API_URL}/donation/homeData`,
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
