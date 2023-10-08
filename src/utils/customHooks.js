import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAuthenticatedUser } from './common';
import { APP_ROUTE } from './constants';

export function useUser() {

  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (!authenticated) {
        // navigate(APP_ROUTE.SIGN_IN);
        return;
      }
      // console.log("setting auth to: ", authenticated)
      setUser(user);
      setAuthenticated(authenticated);
    }
    getUserDetails();
  }, []);

  return { user, authenticated };
}