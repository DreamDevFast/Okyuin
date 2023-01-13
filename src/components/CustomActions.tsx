import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {ActionsProps} from 'react-native-gifted-chat';

import {Colors} from '../styles';

const CustomActions = (props: ActionsProps) => {
  const onActionsPress = () => {};

  const renderIcon = () => {
    return (
      <View style={[styles.wrapper, props.wrapperStyle]}>
        <EvilIcons
          name={'camera'}
          size={30}
          color={Colors.iconLabel}
          style={props.iconTextStyle}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, props.containerStyle]}
      onPress={onActionsPress}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    // borderRadius: 13,
    // borderColor: '#b2b2b2',
    // borderWidth: 2,
    flex: 1,
  },
});

export default CustomActions;
