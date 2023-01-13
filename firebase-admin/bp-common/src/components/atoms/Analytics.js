import React, {useEffect, useState} from 'react';
import {
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import AnalyticsLine from './AnalyticsLine';
import {db} from '../../firebase';
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore';

var years = new Array(30).fill(0).map((item, key) => ({
  label: `${key + 2022}`,
  year: key + 2022,
}));

const Relation = {
  initial: 0,
  like: 1,
  dislike: 2,
  favorite: 3,
};

const months = [
  '12-01',
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

const Analytics = () => {
  const [year, setYear] = useState(years[0].year);
  const [lastYearLastMonthData, setLastYMData] = useState(0);
  const [data, setData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const calculate = key => {
    if (key === 0) {
      if (lastYearLastMonthData === 0) return 'infinite';
      return (
        ((data[key] - lastYearLastMonthData) / lastYearLastMonthData) * 100
      );
    } else {
      if (data[key - 1] === 0) return 'infinite';
      return ((data[key] - data[key - 1]) / data[key - 1]) * 100;
    }
  };

  useEffect(() => {
    let lastYMData = 0;
    const q = query(
      collection(db, 'Relations'),
      where('updatedAt', '>=', new Date(`${year - 1}-12-01`)),
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
      for (let month = 0; month < 13; month++) {
        const docsInthatMonth = matchedDocs.filter(
          doc =>
            new Date(doc.data().updatedAt.seconds * 1000) >=
              new Date(`${year - (month === 0 ? 1 : 0)}-${months[month]}`) &&
            new Date(doc.data().updatedAt.seconds * 1000) <
              new Date(`${year + (month === 12 ? 1 : 0)}-${months[month + 1]}`),
        );
        if (month === 0) lastYMData = docsInthatMonth.length;
        else data[month - 1] = docsInthatMonth.length;
      }
      console.log(data);
      setLastYMData(lastYMData);
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
        <Typography variant="h5">課金件数</Typography>
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
      <Box sx={{minWidth: '40vw'}}>
        {data.map((item, key) => {
          return (
            <AnalyticsLine
              key={key}
              year={year}
              month={key + 1}
              percentage={calculate(key)}
              matchingCount={item}
            />
          );
        })}
      </Box>
    </Card>
  );
};

export default Analytics;
