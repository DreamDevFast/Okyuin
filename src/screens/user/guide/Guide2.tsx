import React from 'react';
import {StyleSheet, TouchableHighlight, Dimensions} from 'react-native';
import {Container, CustomButton, CustomText} from '../../../components';
import CustomIconButton from '../../../components/CustomIconButton';
import {View} from 'react-native-ui-lib';

const likeIcon = require('../../../assets/icons/like-main.png');

const {width, height} = Dimensions.get('window');

const Guide2 = ({navigation}: any) => {
  return (
    <Container centerH centerV>
      <CustomText style={styles.header}>気になる人は右！</CustomText>
      <CustomText style={styles.desc}>
        お互いにlikeするとマッチが成立。さっそく試してみよう！
      </CustomText>
      <View style={styles.like} centerH centerV>
        <CustomIconButton
          imageSource={likeIcon}
          size={50}
          onPress={() => navigation.navigate('UserGuide3')}
        />
      </View>
      <TouchableHighlight
        onPress={() => navigation.navigate('UserGuide3')}
        style={styles.skip}
      >
        <CustomText>スキップ</CustomText>
      </TouchableHighlight>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  desc: {
    fontSize: 19,
    textAlign: 'center',
    width: '80%',
  },
  skip: {
    position: 'absolute',
    right: 3,
    top: 30,
  },
  like: {
    position: 'absolute',
    left: (width * 4) / 6 - 25,
    backgroundColor: '#fe3c72',
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default Guide2;
