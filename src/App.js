// Import packages
import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Local imports
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { APP_ROUTE } from './utils/constants';
import { theme } from './utils/theme';
import { useUser } from './utils/customHooks';
import { storeTokenInLocalStorage } from './utils/common';

import Home from './components/Home';
import Dash from './components/Dash';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {

  const { authenticated } = useUser();

  const signOut = () => {
    storeTokenInLocalStorage('');
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className='navbar'>
          <div align='left'>
            <Button href={APP_ROUTE.HOME} color='new' variant='contained'> Home </Button>
            <Button href={APP_ROUTE.DASH} color='edit' variant='contained'> Dashboard </Button>
          </div>
          <div align='right'>
            <Button href={APP_ROUTE.SIGN_UP} color='search' variant='contained'> Sign Up </Button>
            { authenticated 
              ? (<Button href={APP_ROUTE.HOME} onClick={signOut} color='reports' variant='contained'> Log Out </Button>)
              : (<Button href={APP_ROUTE.SIGN_IN} color='reports' variant='contained'> Log In </Button>)
            }
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
