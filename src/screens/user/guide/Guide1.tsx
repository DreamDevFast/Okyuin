import React from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';
import {Container, CustomButton, CustomText} from '../../../components';
import {View} from 'react-native-ui-lib';

const Guide1 = ({navigation}: any) => {
  return (
    <Container centerH centerV>
      <CustomText style={styles.header}>さっそくはじめよう！</CustomText>
      <CustomText style={styles.desc}>
        実際にマッチする前に、使い方を練習できるよ
      </CustomText>
      <View marginT-30></View>
      <CustomButton
        label="練習する"
        onPress={() => {
          navigation.navigate('UserGuide2');
        }}
      />
      <View marginB-20></View>
      <TouchableHighlight>
        <CustomText>スキップ</CustomText>
      </TouchableHighlight>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  desc: {
    fontSize: 19,
    textAlign: 'center',
    width: '80%',
  },
});

export default Guide1;
