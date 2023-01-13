import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {Colors} from '../styles';

type Props = {
  label: string;
  color?: string;
  mode?: 'text' | 'outlined' | 'contained' | undefined;
  props?: any;
};

const CustomButton = ({label, color, mode, ...props}: any) => {
  if (color === undefined) {
    color = Colors.white;
  }
  if (mode === undefined) {
    mode = 'contained';
  }

  return (
    <Button
      mode={mode}
      color={color}
      labelStyle={styles.label}
      style={styles.customBtn}
      {...props}
    >
      {label}
    </Button>
  );
};

const styles = StyleSheet.create({
  customBtn: {
    borderRadius: 50,
    width: '80%',
  },
  label: {
    color: Colors.iconLabel,
  },
});

export default CustomButton;
