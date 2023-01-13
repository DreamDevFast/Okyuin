import React, {useState} from 'react';
import {View} from 'react-native-ui-lib';
import {TextInput, IconButton} from 'react-native-paper';
import {StyleSheet} from 'react-native';

import firestore from '@react-native-firebase/firestore';

import {Colors} from '../../styles';
import {Container, CustomButton, CustomText} from '../../components';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser} from '../../redux/features/globalSlice';

const NameInput = ({navigation}: any) => {
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const [error, setError] = useState<string>('');

  const dispatch = useAppDispatch();

  const users = firestore().collection('Users');

  const handleNameInput = (name: string) => {
    dispatch(
      setTempUser({
        ...tempUser,
        name,
      }),
    );
  };

  const goToBirthdayInput = () => {
    console.log(tempUser.name);
    users
      .where('name', '==', tempUser.name)
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot.docs.length);
        if (querySnapshot.size) {
          setError('すでに使われています。別の名前にしてください。');
        } else {
          setError('');
          navigation.navigate('BirthdayInput');
        }
      })
      .catch(err => {
        setError(err);
        console.log(err);
      });
  };
  return (
    <Container bottom centerH>
      <IconButton
        icon="chevron-left"
        color={Colors.white}
        style={styles.backIcon}
        size={30}
        onPress={() => navigation.goBack()}
      />
      <CustomText marginB-50>
        アプリで表示されるニックネームを入力してください。
      </CustomText>
      {error ? (
        <CustomText marginB-10 style={styles.error}>
          {error}
        </CustomText>
      ) : (
        <></>
      )}
      <TextInput
        underlineColor={Colors.white}
        activeUnderlineColor={Colors.white}
        style={{...styles.nameInput}}
        theme={{colors: {text: Colors.white}}}
        placeholder="ニックネームを入力してください"
        placeholderTextColor={Colors.placeholder}
        value={tempUser.name}
        onChangeText={handleNameInput}
      />
      <CustomButton
        label="次へ"
        disabled={!!!tempUser.name}
        onPress={goToBirthdayInput}
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
  nameInput: {
    height: 30,
    width: '80%',
    marginBottom: 50,
    backgroundColor: 'transparent',
  },
  error: {
    color: Colors.red10,
  },
});

export default NameInput;
