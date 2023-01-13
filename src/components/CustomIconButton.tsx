import React from 'react';
import {Image, TouchableHighlight} from 'react-native';
import {View} from 'react-native-ui-lib';

const CustomIconButton = ({imageSource, size, onPress}: any) => {
  return (
    <TouchableHighlight onPress={onPress}>
      <Image source={imageSource} style={{width: size, height: size}} />
    </TouchableHighlight>
  );
};

export default CustomIconButton;
