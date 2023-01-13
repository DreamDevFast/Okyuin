import React, {useState} from 'react';
import {Box, Paper, TextField, Grid, Button} from '@mui/material';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase';

const LoginPage = props => {
  const {handleAuth} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        handleAuth(true);
        // ...
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  return (
    <Box sx={{display: 'flex', justifyContent: 'center', paddingTop: '3rem'}}>
      <Paper elevation={3} sx={{width: 'max-content', padding: '2rem'}}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          flexDirection={'column'}
        >
          <Grid item sm={12}>
            <Box sx={{padding: '1rem'}}>
              <TextField
                id="email"
                label="email"
                variant="outlined"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item sm={12}>
            <Box sx={{padding: '1rem'}}>
              <TextField
                id="password"
                label="password"
                variant="outlined"
                type={'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Box>
          </Grid>
          <Grid item sm={12}>
            <Box sx={{padding: '1rem'}}>
              <Button variant="contained" onClick={handleLogin}>
                ログイン
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LoginPage;
