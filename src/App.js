// Import packages
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Local imports
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './utils/theme';
import { APP_ROUTE } from './utils/constants';
import { useUser } from './auth/customHooks';
import AccountButton from './components/AccountButton';
import Home from './pages/Home';
import Dash from './pages/Dash';
import Donate from './pages/Donate';
import SignIn from './pages/SignIn';
import Account from './pages/Account';
import SignUp from './pages/SignUp';

function App() {

  const { authenticated } = useUser();

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {/* Navigation bar */}
        <div className='navbar'>
          <div align='left' style={{display: 'flex', height: '40px' }}>
            <Typography variant='h4' sx={{pt: '4px', fontFamily: 'Gabriola'}}> CareShare </Typography>
            <img width="16" height="16" src="https://img.icons8.com/ultraviolet/40/like--v1.png" alt=''/>
            <Button href={APP_ROUTE.HOME} color='home' variant='contained' sx={{mx: '5px'}}> Home </Button>
            { authenticated && <Button href={APP_ROUTE.DASH} color='purple' variant='contained'> Dashboard </Button>}
          </div>
          <div align='right'>
            <AccountButton/>
          </div>
        </div>

        {/* App Routing */}
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route path={APP_ROUTE.DASH} element={<Dash />} />
            <Route path={APP_ROUTE.DONATE} element={<Donate/>} />
            <Route path={APP_ROUTE.SIGN_IN} element={<SignIn/>} />
            <Route path={APP_ROUTE.ACCOUNT} element={<Account/>} />
            <Route path={APP_ROUTE.SIGN_UP} element={<SignUp/>} />
          </Routes>
        </BrowserRouter>

        {/* Popup Notifications Stying */}
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
