import React, {useState} from 'react';
import {View, Text} from 'react-native-ui-lib';
import DatePicker from 'react-native-date-picker';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

import {Colors} from '../../styles';
import {Container, CustomButton, CustomText} from '../../components';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser} from '../../redux/features/globalSlice';
import CustomProgressBar from '../../components/CustomProgressBar';

const BirthdayInput = ({navigation}: any) => {
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const dispatch = useAppDispatch();

  const handleDate = (date: Date) => {
    dispatch(
      setTempUser({
        ...tempUser,
        birthday: date.toString(),
      }),
    );
  };

  return (
    <Container bottom centerH>
      <CustomProgressBar current={0.429} />
      <IconButton
        icon="chevron-left"
        color={Colors.white}
        style={styles.backIcon}
        size={30}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>生年月日</Text>
      </View>

      <CustomText marginB-30>
        生年月日を選択してください。登録後は変更出来ませんのでご注意ください。
      </CustomText>
      <DatePicker
        title={'birthday'}
        date={new Date(tempUser.birthday)}
        open={false}
        mode={'date'}
        locale={'ja'}
        fadeToColor={Colors.gradient1}
        textColor={Colors.white}
        onDateChange={handleDate}
      />
      <View marginB-30></View>
      <CustomButton
        label="次へ"
        onPress={() => navigation.navigate('LocationInput')}
      />
      <View marginB-100></View>
    </Container>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    left: 0,
    top: 30,
  },
  BirthdayInput: {
    height: 30,
    width: '70%',
    marginBottom: 50,
    backgroundColor: Colors.back,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    top: 100,
    width: '100%',
    textAlign: 'center',
  },
});

export default BirthdayInput;
