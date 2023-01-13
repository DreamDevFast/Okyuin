import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native-ui-lib';

import {Colors} from '../styles';
import Gradient from './Gradient';

const Container = ({children, ...props}: any) => {
  return (
    <Gradient>
      <View style={styles.container} {...props}>
        {children}
      </View>
    </Gradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    resizeMode: 'contain',
  },
});

export default Container;
