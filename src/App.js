// Import packages
import React, {useEffect} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Local imports
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { APP_ROUTE } from './utils/constants';
import { theme } from './utils/theme';
import { useUser } from './utils/customHooks';

import Home from './components/Home';
import Dash from './components/Dash';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Account from './components/Account';

function App() {

  const { authenticated } = useUser();
 
  // useEffect(() => {
  //   console.log('here')
  //   console.log(authenticated)
  // }, [authenticated]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className='navbar'>
          <div align='left'>
            <Button href={APP_ROUTE.HOME} color='new' variant='contained' sx={{mr: '5px'}}> Home </Button>
            { authenticated && <Button href={APP_ROUTE.DASH} color='edit' variant='contained'> Dashboard </Button>}
          </div>
          <div align='right'>
            <Account/>
          </div>
        </div>
        <h1>CareShare</h1>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route path={APP_ROUTE.SIGN_UP} element={<SignUp/>} />
            <Route path={APP_ROUTE.SIGN_IN} element={<SignIn/>} />
            <Route path={APP_ROUTE.DASH} element={<Dash/>} />
          </Routes>
        </BrowserRouter>

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
