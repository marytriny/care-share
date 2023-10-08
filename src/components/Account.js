// Import packages
import React from "react"
import { Menu, ListItem, ListItemText, Tooltip, IconButton, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Local imports
import { APP_ROUTE } from '../utils/constants';
import { useUser } from '../utils/customHooks';
import { storeTokenInLocalStorage } from '../utils/common';

const Account = () => {

  // Variables used to open/close the account menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAccount = Boolean(anchorEl);

  const { user, authenticated } = useUser();
  
  const signOut = () => storeTokenInLocalStorage('');

  return(
    <div>
      <Tooltip title="Account">
        <IconButton onClick={e => setAnchorEl(e.currentTarget)} color="primary">
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={openAccount}
        onClose={() => setAnchorEl(null)}
      >
        { authenticated ? (
          <>
            <ListItem>
              <ListItemText align='center' primary={user.organization} />
            </ListItem>
            <ListItem>
              <Button size="small"> Account </Button>
            </ListItem>
            <ListItem>
              <Button href={APP_ROUTE.HOME} onClick={signOut} size="small"> Sign Out </Button>
            </ListItem>
          </>
        ) : (
          <>
            <Button href={APP_ROUTE.SIGN_IN}> Sign In </Button>
          </>
        )}
      </Menu>
    </div>
  )
}

export default Account;
