import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const BookingsNavBar = ({ children }: { children: React.ReactNode }) => {
  const { logOut } = useAuth();
  const router = useRouter();
  const { user } = useAuth();
 
  const logout = async () => {
    try {
      await logOut();
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  }

  
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Bookings
            </Typography>
            <Typography>{user.email}</Typography>
            <Button 
              color="inherit"
              variant='outlined'
              onClick={async () => {
                await logout();
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      {children}
    </>
  );
}
export default BookingsNavBar
