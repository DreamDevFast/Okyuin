import * as React from 'react';
import {Backdrop, Select, MenuItem} from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import {db} from '../../firebase';
import {collection, addDoc} from 'firebase/firestore';
import {pref_city} from '../../config';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [prefecture, setPrefecture] = React.useState(pref_city[0].id);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const register = () => {
    addDoc(collection(db, 'Users'), {
      name,
      mobile,
      email,
      avatar: 'default.png',
      address,
      role: 'shop',
      prefecture,
      birthday: new Date(),
      createdAt: new Date(),
    }).then(docRef => {
      setOpen(false);
    });
  };

  return (
    <div style={{padding: 3, justifyContent: 'end', display: 'flex'}}>
      <Button variant="outlined" endIcon={<AddIcon />} onClick={handleOpen}>
        新規登録
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={{padding: 1, width: '100%'}}>
              <TextField
                id="outlined-basic"
                label="名前"
                variant="outlined"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                }}
                sx={{width: '100%'}}
              />
            </Box>

            <Box sx={{padding: 1, width: '100%'}}>
              <TextField
                id="outlined-basic"
                label="電話番号"
                variant="outlined"
                value={mobile}
                onChange={e => {
                  setMobile(e.target.value);
                }}
                sx={{width: '100%'}}
              />
            </Box>

            <Box sx={{padding: 1, width: '100%'}}>
              <TextField
                id="outlined-basic"
                label="メールアドレス"
                variant="outlined"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
                sx={{width: '100%'}}
              />
            </Box>
            <Box sx={{padding: 1, width: '100%'}}>
              <Select
                value={prefecture}
                sx={{width: '100%'}}
                onChange={e => setPrefecture(e.target.value)}
                label={'住所'}
              >
                {pref_city.map((pref, key) => (
                  <MenuItem key={key} value={pref.id}>
                    {pref.pref}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={{padding: 1, width: '100%'}}>
              <TextField
                id="outlined-basic"
                label="住所"
                variant="outlined"
                value={address}
                onChange={e => {
                  setAddress(e.target.value);
                }}
                sx={{width: '100%'}}
              />
            </Box>

            <Box sx={{padding: 1, width: '100%'}}>
              <Button
                variant="contained"
                sx={{width: '100%'}}
                onClick={register}
              >
                登録
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
