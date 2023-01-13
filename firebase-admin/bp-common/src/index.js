import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Box, Button} from '@mui/material';
import ChartManagePanel from './components/molecules/ChartManagePanel';
import LoginPage from './components/molecules/LoginPage';
import UserManagePanel from './components/molecules/UserManagePanel';

const App = () => {
  const [isAuthenticated, setAuth] = useState(false);

  const handleAuth = auth => {
    setAuth(auth);
    if (auth) localStorage.setItem('authKey', '1');
    else localStorage.removeItem('authKey');
  };

  useEffect(() => {
    const authKey = localStorage.getItem('authKey');
    console.log(authKey);
    if (authKey) {
      setAuth(true);
    }
  }, []);
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <Box sx={{position: 'absolute', top: 5, right: 7, zIndex: 1}}>
            <Button variant="contained" onClick={() => handleAuth(false)}>
              Logout
            </Button>
          </Box>
          <UserManagePanel />
          <ChartManagePanel />
        </div>
      ) : (
        <LoginPage handleAuth={handleAuth} />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
