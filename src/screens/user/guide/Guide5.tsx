import React from 'react';
import {StyleSheet, TouchableHighlight, Dimensions, Alert} from 'react-native';
import {Container, CustomButton, CustomText} from '../../../components';
import {useAppDispatch, useAppSelector} from '../../../redux/reduxHooks';
import {View} from 'react-native-ui-lib';
import {setFirstLogin} from '../../../redux/features/globalSlice';

import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

const Guide5 = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const users = firestore().collection('Users');
  const tempUser = useAppSelector((state: any) => state.global.tempUser);

  const handlePress = async () => {
    try {
      await users.doc(tempUser.id).update({
        isFirstLogin: false,
      });
      dispatch(setFirstLogin(false));
      navigation.navigate('UserShopSearch');
    } catch (err) {
      Alert.alert('Network connection problem');
    }
  };
  return (
    <Container centerH bottom>
      <TouchableHighlight onPress={handlePress}>
        <>
          <View row style={styles.upper}>
            <View centerH centerV style={{...styles.border, ...styles.w_50}}>
              <CustomText style={styles.desc}>左をタップで前の写真</CustomText>
            </View>
            <View centerV centerH style={{...styles.border, ...styles.w_50}}>
              <CustomText style={styles.desc}>右をタップで次の写真</CustomText>
            </View>
          </View>
          <View centerH centerV style={{...styles.border, ...styles.lower}}>
            <CustomText style={styles.desc}>
              下をタップでプロフィール
            </CustomText>
          </View>
        </>
      </TouchableHighlight>
    </Container>
  );
};

const styles = StyleSheet.create({
  upper: {
    height: height * 0.7,
    width: width,
  },
  desc: {
    fontSize: 19,
    textAlign: 'center',
    width: '80%',
  },
  border: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'white',
  },
  lower: {
    width: width,
    height: height * 0.2,
  },
  w_50: {
    width: '50%',
  },
});

export default Guide5;
