import { BrowserRouter, Route, Routes, Navigate  } from 'react-router-dom';

import './App.css';
import Dash from './components/Dash';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { APP_ROUTE } from './utils/constants';

function App() {
  return (
    <div className="App">
      <h1>CareShare</h1>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Navigate to={APP_ROUTE.DASH} />} />
          <Route path={APP_ROUTE.SIGN_UP} element={<SignUp />} />
          <Route path={APP_ROUTE.SIGN_IN} element={<SignIn />} />
          <Route path={APP_ROUTE.DASH} element={<Dash />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
