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
        <Image
          source={uri === undefined ? userIcon : {uri}}
          style={styles.thumb_image}
        />
      </TouchableHighlight>
      {/* <AntDesign name={'plus'} size={10} style={styles.badge} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  portfolio: {
    borderRadius: 30,
  },
  thumb_image: {
    height: width * 0.2,
    width: width * 0.2,
    borderRadius: 10,
  },
  badge: {
    backgroundColor: Colors.redBtn,
    width: 15,
    height: 15,
    borderRadius: 10,
    padding: 2.5,
    position: 'absolute',
    color: Colors.white,
    fontWeight: 'bold',
  },
});
export default Portfolio;
