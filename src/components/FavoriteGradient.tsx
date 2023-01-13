import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const FavoriteGradient = ({children}: any) => {
  return (
    <LinearGradient
      colors={['#00000000', '#f5bd45']}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={{flex: 1, width: '100%', alignItems: 'center'}}
    >
      {children}
    </LinearGradient>
  );
};

export default FavoriteGradient;
