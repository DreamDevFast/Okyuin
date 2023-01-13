import React, {useEffect, useState} from 'react';
import {
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {LineChart, Line, CartesianGrid, XAxis, YAxis} from 'recharts';
import {db} from '../../firebase';
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore';

const Relation = {
  initial: 0,
  like: 1,
  dislike: 2,
  favorite: 3,
};

const months = [
  '01-01',
  '02-01',
  '03-01',
  '04-01',
  '05-01',
  '06-01',
  '07-01',
  '08-01',
  '09-01',
  '10-01',
  '11-01',
  '12-01',
  '01-01',
];

var years = new Array(30).fill(0).map((item, key) => ({
  label: `${key + 2022}`,
  year: key + 2022,
}));

const Chart = () => {
  const [year, setYear] = useState(years[0].year);
  const [data, setData] = useState([
    {name: '1', uv: 0, pv: 2400, amt: 2400},
    {name: '2', uv: 0, pv: 2400, amt: 2400},
    {name: '3', uv: 0, pv: 2400, amt: 2400},
    {name: '4', uv: 0, pv: 2400, amt: 2400},
    {name: '5', uv: 0, pv: 2400, amt: 2400},
    {name: '6', uv: 0, pv: 2400, amt: 2400},
    {name: '7', uv: 0, pv: 2400, amt: 2400},
    {name: '8', uv: 0, pv: 2400, amt: 2400},
    {name: '9', uv: 0, pv: 2400, amt: 2400},
    {name: '10', uv: 0, pv: 2400, amt: 2400},
    {name: '11', uv: 0, pv: 2400, amt: 2400},
    {name: '12', uv: 0, pv: 2400, amt: 2400},
  ]);

  useEffect(() => {
    const q = query(
      collection(db, 'Relations'),
      where('updatedAt', '>=', new Date(`${year}-01-01`)),
      where('updatedAt', '<=', new Date(`${year + 1}-01-01`)),
    );
    onSnapshot(q, querySnapshot => {
      const matchedDocs = querySnapshot.docs.filter(doc => {
        if (
          (doc.data().relation1 === Relation.like ||
            doc.data().relation1 === Relation.favorite) &&
          (doc.data().relation2 === Relation.like ||
            doc.data().relation2 === Relation.favorite)
        ) {
          return true;
        }
        return false;
      });
      console.log(matchedDocs);
      for (let month = 0; month < 12; month++) {
        const docsInthatMonth = matchedDocs.filter(
          doc =>
            new Date(doc.data().updatedAt.seconds * 1000) <
              new Date(
                `${year + (month === 11 ? 1 : 0)}-${months[month + 1]}`,
              ) &&
            new Date(doc.data().updatedAt.seconds * 1000) >=
              new Date(`${year}-${months[month]}`),
        );
        data[month].uv = docsInthatMonth.length;
      }
      console.log(data);
      setData([...data]);
    });
  }, [year]);

  return (
    <Card sx={{padding: 2, marginTop: 2}}>
      <Box
        sx={{
          padding: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">マッチ件数</Typography>
        <Select
          value={year}
          onChange={e => setYear(e.target.value)}
          label={'年'}
        >
          {years.map((yr, key) => (
            <MenuItem key={key} value={yr.year}>
              {yr.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <LineChart width={600} height={300} data={data}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </Card>
  );
};

export default Chart;
