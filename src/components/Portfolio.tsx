import React, {useState} from 'react';
import {StyleSheet, Dimensions, TouchableHighlight} from 'react-native';
import {View, Image} from 'react-native-ui-lib';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {Colors} from '../styles';

const userIcon = require('../assets/images/empty.jpg');

const {width, height} = Dimensions.get('window');

const Portfolio = (props: any) => {
  const {uri, openImagePickerModal} = props;
  console.log(uri);

  return (
    <View padding-5 style={styles.portfolio}>
      <TouchableHighlight onPress={openImagePickerModal}>
        <View style={styles.dashedContainer}>
          <Image
            source={uri === undefined ? userIcon : {uri}}
            style={styles.thumb_image}
          />
        </View>
      </TouchableHighlight>
      {uri === undefined ? (
        <AntDesign name={'plus'} size={25} style={styles.badge} />
      ) : (
        <AntDesign name={'edit'} size={25} style={styles.activeBadge} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  portfolio: {
    borderRadius: 30,
  },
  dashedContainer: {
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.iconLabel,
  },
  thumb_image: {
    height: width * 0.45,
    width: width * 0.3,
    borderRadius: 10,
  },
  badge: {
    bottom: 0,
    right: 0,
    backgroundColor: Colors.redBtn,
    width: 30,
    height: 30,
    borderRadius: 20,
    padding: 2.5,
    position: 'absolute',
    color: Colors.white,
    fontWeight: 'bold',
  },
  activeBadge: {
    bottom: 0,
    right: 0,
    backgroundColor: Colors.white,
    width: 30,
    height: 30,
    borderRadius: 20,
    padding: 2.5,
    position: 'absolute',
    color: Colors.redBtn,
    fontWeight: 'bold',
  },
});
export default Portfolio;
