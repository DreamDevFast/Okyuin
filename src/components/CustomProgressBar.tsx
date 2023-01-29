import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native-ui-lib';
import {ProgressBar} from 'react-native-paper';
import {Colors} from '../styles';

const CustomProgressBar = ({current}: {current: number}) => {
  return (
    <View style={styles.progressBarContainer}>
      <ProgressBar
        progress={current}
        color={Colors.progressBar}
        style={styles.progressBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    width: '90%',
    height: 7,
    marginHorizontal: '5%',
    backgroundColor: Colors.progressBarBack,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    width: '100%',
  },
});

export default CustomProgressBar;
