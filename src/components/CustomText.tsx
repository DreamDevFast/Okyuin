import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-ui-lib';
import {Colors} from '../styles';

const CustomText = ({children, ...props}: any) => {
  if (props.color === undefined) {
    props.color = Colors.white;
  }
  return (
    <Text style={styles.customText} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  customText: {
    width: '80%',
    textAlign: 'center',
  },
});
export default CustomText;
