import React from 'react';
import {Typography} from '@mui/material';
import {ArrowUpward, ArrowDownward, AllInclusive} from '@mui/icons-material';

const AnalyticsLine = props => {
  const {year, month, matchingCount, percentage} = props;

  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <Typography>
        {year}/{month}
      </Typography>
      <Typography>{matchingCount}件</Typography>
      {percentage !== 'infinite' ? (
        <Typography>
          {percentage >= 0 ? '+' : ''}
          {percentage}%
        </Typography>
      ) : (
        <AllInclusive />
      )}
      {percentage === 'infinite' || percentage >= 0 ? (
        <ArrowUpward color="success" />
      ) : (
        <ArrowDownward color="warning" />
      )}
    </div>
  );
};

export default AnalyticsLine;
