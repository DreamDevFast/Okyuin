import React from 'react';
import Analytics from '../atoms/Analytics';
import Chart from '../atoms/Chart';

const ChartManagePanel = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Chart />
      <Analytics />
    </div>
  );
};

export default ChartManagePanel;
