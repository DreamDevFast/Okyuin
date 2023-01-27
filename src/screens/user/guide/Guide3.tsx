import React from 'react';
import {StyleSheet, TouchableHighlight, Dimensions} from 'react-native';
import {Container, CustomButton, CustomText} from '../../../components';
import CustomIconButton from '../../../components/CustomIconButton';
import {useAppDispatch, useAppSelector} from '../../../redux/reduxHooks';

import {View} from 'react-native-ui-lib';

const likeIcon = require('../../../assets/icons/dislike-main.png');
const {width, height} = Dimensions.get('window');

const Guide3 = ({navigation}: any) => {
  const tempUser = useAppSelector((state: any) => state.global.tempUser);

  const handlePress = () => {
    if (tempUser.role === 'shop') navigation.navigate('UserGuide4');
    else navigation.navigate('UserGuide5');
  };

  return (
    <Container centerH centerV>
      <CustomText style={styles.header}>うーん…のときは左</CustomText>
      <CustomText style={styles.desc}>
        ちょっと違うかも…と思ったら、左にクリックしよう。
      </CustomText>
      <CustomText style={styles.desc}>
        Nopeしたことは相手に伝わらないから大丈夫。
      </CustomText>
      <View style={styles.dislike} centerH centerV>
        <CustomIconButton
          imageSource={likeIcon}
          size={50}
          onPress={handlePress}
        />
      </View>
      <TouchableHighlight style={styles.skip}>
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
  dislike: {
    position: 'absolute',
    left: (width * 2) / 6 - 25,
    backgroundColor: '#fe3c72',
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default Guide3;
