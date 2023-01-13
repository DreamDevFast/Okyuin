import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Colors} from '../styles';

const Label = ({text, ...restProps}: any) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 4,
    backgroundColor: Colors.redBtn,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    color: '#fff',
  },
});

export default memo(Label);
