import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {StyleSheet, TouchableHighlight} from 'react-native';
import {TextInput, IconButton} from 'react-native-paper';
import {View, Text} from 'react-native-ui-lib';

import syncStorage from 'sync-storage';

import firestore from '@react-native-firebase/firestore';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {
  setAuthenticated,
  setLoading,
  setLoginMethod,
  setTempUser,
} from '../../redux/features/globalSlice';

import {Container, CustomButton, CustomText} from '../../components';
import {Colors} from '../../styles';

const Login = ({navigation}: any) => {
  const loginMethod = useAppSelector((state: any) => state.global.loginMethod); // 'mobile' or 'email'
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      return setError('');
    }, []),
  );

  const handleLogin = () => {
    const operator = loginMethod === 'email' ? email : mobile;

    if (loginMethod === 'email') {
      let regForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (regForEmail.test(operator) === false) {
        return setError('入力内容が正しくないのでご確認ください。');
      } else {
        setError('');
      }
    }
    if (loginMethod === 'mobile') {
      let regForMobile = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      if (regForMobile.test(operator) === false) {
        return setError('入力内容が正しくないのでご確認ください。');
      } else {
        setError('');
      }
    }
    firestore()
      .collection('Users')
      .where(loginMethod, '==', operator)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size === 1) {
          console.log(querySnapshot.docs[0].data());
          let {
            address,
            birthday,
            email,
            name,
            mobile,
            prefecture,
            role,
            avatar,
          } = querySnapshot.docs[0].data();

          birthday = new Date(birthday.seconds * 1000).toString();
          dispatch(
            setTempUser({
              id: querySnapshot.docs[0].id,
              address,
              birthday,
              email,
              name,
              mobile,
              prefecture,
              role,
              avatar,
            }),
          );
          dispatch(setAuthenticated(true));

          syncStorage.set('token', operator);
          console.log('storage token after login', syncStorage.get('token'));
          dispatch(setLoading(true));
          navigation.navigate('UserShopSearch');
        } else {
          dispatch(
            setTempUser({
              id: '',
              email: loginMethod === 'email' ? email : '',
              mobile: loginMethod === 'mobile' ? mobile : '',
              name: '',
              birthday: new Date().toString(),
              prefecture: 0,
              address: '',
              avatar: 'default.png',
              role: 'girl',
            }),
          );
          dispatch(setAuthenticated(false));
          navigation.navigate('Register');
        }
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
      {loginMethod === 'email' ? (
        <>
          {/* <CustomText marginB-30>メールアドレスを入力してください</CustomText> */}
          <TextInput
            underlineColor={Colors.white}
            activeUnderlineColor={Colors.white}
            style={{...styles.emailInput}}
            theme={{colors: {text: !!error ? Colors.red10 : Colors.white}}}
            value={email}
            placeholder="メールアドレスを入力してください。"
            placeholderTextColor={Colors.placeholder}
            onChangeText={text => setEmail(text)}
          />
          {error ? (
            <View>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : (
            <></>
          )}
          <CustomButton
            label="次へ"
            disabled={!!!email}
            onPress={handleLogin}
          />
          <View marginT-10></View>
          {/* <TouchableHighlight
            onPress={() => {
              dispatch(
                setTempUser({
                  id: '',
                  email: '',
                  mobile: '',
                  name: '',
                  birthday: new Date().toString(),
                  prefecture: 0,
                  address: '',
                  avatar: 'default.png',
                  role: 'girl',
                }),
              );
              navigation.navigate('Register');
            }}
          >
            <CustomText>新規会員登録</CustomText>
          </TouchableHighlight> */}
          <TouchableHighlight
            onPress={() => {
              setError('');
              dispatch(setLoginMethod('mobile'));
            }}
          >
            <CustomText>電話番号でログイン</CustomText>
          </TouchableHighlight>
          <View marginB-40></View>
        </>
      ) : (
        <>
          {/* <CustomText marginB-30>電話番号を入力してください</CustomText> */}
          <View row>
            {/* <TextInput
              underlineColor={Colors.white}
              activeUnderlineColor={Colors.white}
              style={{...styles.phonePrefixInput}}
              theme={{colors: {text: Colors.white}}}
              value={'+81'}
            /> */}
            <TextInput
              underlineColor={Colors.white}
              activeUnderlineColor={Colors.white}
              style={{...styles.phoneNumberInput}}
              theme={{colors: {text: !!error ? Colors.red10 : Colors.white}}}
              value={mobile}
              placeholder="電話番号を入力してください。"
              placeholderTextColor={Colors.placeholder}
              onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
            />
          </View>
          {error ? (
            <View>
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : (
            <></>
          )}
          <CustomButton
            label="次へ"
            disabled={!!!mobile}
            onPress={handleLogin}
          />
          <View marginT-10></View>
          {/* <TouchableHighlight
            onPress={() => {
              dispatch(
                setTempUser({
                  id: '',
                  email: '',
                  mobile: '',
                  name: '',
                  birthday: new Date().toString(),
                  prefecture: 0,
                  address: '',
                  avatar: 'default.png',
                  role: 'girl',
                }),
              );
              navigation.navigate('Register');
            }}
          >
            <CustomText>新規会員登録</CustomText>
          </TouchableHighlight> */}
          <TouchableHighlight
            onPress={() => {
              setError('');
              dispatch(setLoginMethod('email'));
            }}
          >
            <CustomText>メールアドレスでログイン</CustomText>
          </TouchableHighlight>
          <View marginB-40></View>
        </>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    left: 0,
    top: 30,
  },
  emailInput: {
    height: 30,
    width: '80%',
    marginBottom: 50,
    backgroundColor: 'transparent',
  },
  phonePrefixInput: {
    height: 30,
    width: '13%',
    marginBottom: 50,
    backgroundColor: 'transparent',
  },
  phoneNumberInput: {
    height: 30,
    width: '80%',
    // marginLeft: '3%',
    marginBottom: 50,
    backgroundColor: 'transparent',
  },
  error: {
    color: Colors.red10,
  },
});

export default Login;
