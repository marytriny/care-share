import React from 'react';

import { useUser } from '../utils/customHooks';

export default function Dash() {

  const { user, authenticated } = useUser();

  if (!user || !authenticated) {
    return <h2>booo no token</h2>
  }
  
  return(
    <h2> Welcome {user.organization}! </h2>
  );
}
