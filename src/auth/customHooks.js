import { useState, useEffect } from 'react';
import { getAuthenticatedUser } from './common';

export function useUser() {

  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      if (authenticated) {
        // console.log("setting auth to: ", authenticated)
        setUser(user);
        setAuthenticated(authenticated);
      }
    }
    getUserDetails();
  }, []);

  return { user, authenticated };
}
