import React from 'react';
import {StyleSheet, TouchableHighlight, Image} from 'react-native';
import {Container, CustomButton, CustomText} from '../../../components';
import {View} from 'react-native-ui-lib';

const refreshIcon = require('../../../assets/icons/refresh-main.png');
const favoriteIcon = require('../../../assets/icons/favorite-main.png');
const boostIcon = require('../../../assets/icons/boost-main.png');

const Guide4 = ({navigation}: any) => {
  return (
    <Container centerH centerV>
      <CustomText style={styles.header}>ほかにも便利な機能があるよ</CustomText>
      <View centerH marginT-30>
        <Image source={refreshIcon} style={styles.icon} />
      </View>
      <CustomText style={styles.desc}>
        間違えてlikeやsuperlike、またはNopeしてしまったときに、やりなおすことができます
      </CustomText>
      <View centerH marginT-30>
        <Image source={favoriteIcon} style={styles.icon} />
      </View>
      <CustomText style={styles.desc}>
        superlike「とっても気になってます」を特別な人に伝えよう
      </CustomText>
      <View centerH marginT-30>
        <Image source={boostIcon} style={styles.icon} />
      </View>
      <CustomText style={styles.desc}>
        ブースト、自分のプロフィールが普段の10倍以上表示されるよ
      </CustomText>
      <View marginT-30></View>
      <CustomButton
        label="さっそくはじめる"
        onPress={() => {
          navigation.navigate('UserGuide5');
        }}
      />
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
  icon: {
    width: 50,
    height: 50,
  },
});

export default Guide4;
