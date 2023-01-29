import React, {useState, useCallback, useEffect} from 'react';
import {View, Text} from 'react-native-ui-lib';
import {StyleSheet} from 'react-native';
import {TextInput, IconButton} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';

import syncStorage from 'sync-storage';

import {pref_city} from '../../constants/config';
import {Colors} from '../../styles';
import {Container, CustomButton, CustomText} from '../../components';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setAuthenticated, setTempUser} from '../../redux/features/globalSlice';
import {setId, setSearchLocation} from '../../redux/features/settingSlice';
import CustomProgressBar from '../../components/CustomProgressBar';

const SearchLocation = ({navigation}: any) => {
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const setting = useAppSelector((state: any) => state.setting);
  const loginMethod = useAppSelector((state: any) => state.global.loginMethod);

  const dispatch = useAppDispatch();

  const users = firestore().collection('Users');
  const settings = firestore().collection('Settings');

  const handlePrefecture = (item: any) => {
    dispatch(setSearchLocation(item.value));
  };

  const register = async () => {
    // TODO register user with firestore
    const {
      name,
      birthday,
      prefecture,
      address,
      email,
      mobile,
      role,
      avatar,
    } = tempUser;

    const documentSnapShot = await users.add({
      email,
      mobile,
      name,
      birthday: new Date(birthday),
      prefecture,
      address,
      avatar,
      role,
      createdAt: new Date(),
    });

    console.log('save succeeded!', documentSnapShot.id);
    await settings.doc(documentSnapShot.id).set({...setting});

    console.log('setting saved!');
    dispatch(setId(tempUser.id));

    dispatch(
      setTempUser({
        id: documentSnapShot.id,
        email,
        mobile,
        name,
        birthday: new Date(birthday).toString(),
        prefecture,
        address,
        avatar,
        role,
      }),
    );
    dispatch(setAuthenticated(true));

    syncStorage.set('token', loginMethod === 'email' ? email : mobile);
    navigation.navigate('UserAgreement');
  };
  return (
    <Container bottom centerH>
      <CustomProgressBar current={0.572} />
      <IconButton
        icon="chevron-left"
        color={Colors.white}
        style={styles.backIcon}
        size={30}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>エリア</Text>
      <View style={styles.divider}></View>
      <CustomText marginB-40>
        マッチングしたいエリアを選択してください。
      </CustomText>
      <View style={styles.block} marginB-10>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={pref_city.map(item => ({label: item.pref, value: item.id}))}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={'都道府県'}
          searchPlaceholder={''}
          onChange={handlePrefecture}
          value={tempUser.prefecture}
        />
      </View>
      <CustomButton label="次へ" onPress={register} />
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
  confirmLabel: {
    width: '80%',
  },
  address: {
    height: 30,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  dropdown: {
    height: 30,
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 15,
    marginBottom: 5,
  },
  inputSearchStyle: {
    height: 40,
    color: Colors.white,
  },
  selectedTextStyle: {
    color: Colors.white,
    textAlign: 'center',
  },
  placeholderStyle: {
    color: Colors.placeholder,
    textAlign: 'center',
  },
  block: {
    backgroundColor: '#c25f94',
    width: '80%',
    borderRadius: 100,
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  divider: {
    height: '30%',
  },
});

export default SearchLocation;
