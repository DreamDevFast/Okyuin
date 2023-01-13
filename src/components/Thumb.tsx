import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';

import {Colors} from '../styles';

const THUMB_RADIUS_LOW = 4;
const THUMB_RADIUS_HIGH = 4;

const Thumb = ({name}: any) => {
  return <View style={name === 'high' ? styles.rootHigh : styles.rootLow} />;
};

const styles = StyleSheet.create({
  rootLow: {
    width: THUMB_RADIUS_LOW * 2,
    height: THUMB_RADIUS_LOW * 2,
    borderRadius: THUMB_RADIUS_LOW,
    backgroundColor: Colors.redBtn,
  },
  rootHigh: {
    width: THUMB_RADIUS_HIGH * 2,
    height: THUMB_RADIUS_HIGH * 2,
    borderRadius: THUMB_RADIUS_HIGH,
    backgroundColor: Colors.redBtn,
  },
});

export default memo(Thumb);
