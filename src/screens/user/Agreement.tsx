import React from 'react';
import {StyleSheet} from 'react-native';
import {Container, CustomButton, CustomText} from '../../components';
import {View} from 'react-native-ui-lib';

const Agreement = ({navigation}: any) => {
  return (
    <Container centerH centerV>
      <CustomText style={styles.header}>おきゅいんへようこそ！</CustomText>
      <CustomText>
        おきゅいんは、理想の職場や人材と出会えるマッチングアプリです。
      </CustomText>
      <CustomText>以下のルールにご協力お願いします。</CustomText>

      <CustomText style={styles.header}>情報は正しく</CustomText>
      <CustomText>
        写真やプロフィールは、偽らず、本当の事を載せてください
      </CustomText>
      <CustomText style={styles.header}>違反は即報告</CustomText>
      <CustomText>
        違反行為を見つけたら、報告ボタンからおきゅいんに報告してください
      </CustomText>
      <View marginT-30 />
      <CustomButton
        label="同意する"
        onPress={() => {
          navigation.navigate('UserPhoto');
        }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
  },
});

export default Agreement;
