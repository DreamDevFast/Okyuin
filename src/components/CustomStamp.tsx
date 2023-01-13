import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {View, Text} from 'react-native-ui-lib';

import {Colors} from '../styles';

const CustomStamp = ({
  text,
  style,
  text_style,
}: {
  text: string;
  style: any;
  text_style: any;
}) => {
  return (
    <Animated.View
      style={{...style, ...styles.container, borderColor: Colors[text]}}
    >
      <Text style={text_style}>{text.toLocaleUpperCase()}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 5,
  },
});

export default CustomStamp;
