import React from 'react';

import { useUser } from '../utils/customHooks';

export default function Dash({token}) {
  const { user, authenticated } = useUser();

  if (!user || !authenticated) {
    return <h2>booo no token</h2>
  }
  
  console.log(user);
  return(
    <h2>Dash - Welcome {user.organization}! </h2>
  );
}