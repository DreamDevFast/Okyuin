import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const Gradient = ({children}: any) => {
  return (
    <LinearGradient
      colors={['#fe3c72', '#f681df']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={{flex: 1}}
    >
      {children}
    </LinearGradient>
  );
};

export default Gradient;
