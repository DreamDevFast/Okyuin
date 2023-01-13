import React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {Avatar, Typography} from '@mui/material';

const columns = [
  {
    field: 'name',
    headerName: '名前',
    width: 150,
    renderCell: params => {
      return (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Avatar src={params.value.avatar} />
          <Typography sx={{paddingLeft: 1}}>{params.value.username}</Typography>
        </div>
      );
    },
  },
  {field: 'mobile', headerName: '電話番号', width: 300},
  {field: 'email', headerName: 'メールアドレス', width: 300},
  {field: 'date', headerName: '登録日', width: 150},
  {field: 'matchingNumber', headerName: 'マッチ件数', width: 150},
];

const Datatable = ({users}) => {
  const rows = users.map(user => {
    const date = user.data.createdAt
      ? new Date(user.data.createdAt.seconds * 1000)
      : '';
    return {
      id: user.id,
      name: {
        username: user.data.name,
        avatar: user.data.avatar,
      },
      mobile: user.data.mobile,
      email: user.data.email,
      date: user.data.createdAt
        ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        : '',
      matchingNumber: user.matchingCount,
    };
  });

  return (
    <div style={{height: '80vh', width: '100%'}}>
      <DataGrid rows={rows} columns={columns} checkboxSelection />
    </div>
  );
};

export default Datatable;
