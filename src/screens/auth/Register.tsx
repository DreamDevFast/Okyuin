import React, {useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {IconButton, TextInput} from 'react-native-paper';
import {StyleSheet, TouchableHighlight} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import auth from '@react-native-firebase/auth';
// import RNSmtpMailer from 'react-native-smtp-mailer';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {
  setLoginMethod,
  setTempUser,
  setLoading,
} from '../../redux/features/globalSlice';

import {Colors} from '../../styles';
import {Container, CustomButton, CustomText} from '../../components';
import axios from 'axios';

import Loader from '../../components/Loader';
import CustomProgressBar from '../../components/CustomProgressBar';

var emailConfirmCodeBaseURL =
  'https://us-central1-okyuin-akiba.cloudfunctions.net/sendMail';

const Register = ({navigation}: any) => {
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const loginMethod = useAppSelector((state: any) => state.global.loginMethod); // 'mobile' or 'email'
  const isLoading = useAppSelector((state: any) => state.global.isLoading);

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>(tempUser.email);
  const [mobile, setMobile] = useState<string>(tempUser.mobile);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      return setError('');
    }, []),
  );

  const handleToConfirmCode = async () => {
    dispatch(
      setTempUser({
        ...tempUser,
        [loginMethod]: loginMethod === 'email' ? email : mobile,
      }),
    );
    let code = '',
      confirmation = null;
    if (loginMethod === 'email') {
      try {
        let regForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (regForEmail.test(email) === false) {
          return setError('入力内容が正しくないのでご確認ください。');
        } else {
          setError('');
        }
        dispatch(setLoading(true));
        for (let i = 0; i < 6; i++) {
          let each = Math.floor(Math.random() * 10) % 10;
          code += `${each}`;
        }
        const res = await axios.get(
          emailConfirmCodeBaseURL + `?dest=${email}&code=${code}`,
        );
        console.log(res.data);
        if (res.data === 'Sended') {
          dispatch(setLoading(false));
          return navigation.navigate('ConfirmCode', {
            code,
            confirmation,
            email,
          });
        }
      } catch (err) {
        console.log(err);
        setError('何かがうまくいかなかった');
      }
    } else if (loginMethod === 'mobile') {
      try {
        let regForMobile = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        if (regForMobile.test(email) === false) {
          return setError('入力内容が正しくないのでご確認ください。');
        } else {
          setError('');
        }
        dispatch(setLoading(true));
        confirmation = await auth().verifyPhoneNumber(`+${mobile}`);
        console.log('confirm finished');
        if (confirmation) {
          console.log(confirmation);
          dispatch(setLoading(false));
          return navigation.navigate('ConfirmCode', {
            confirmation,
            code,
            mobile,
          });
        }
      } catch (err) {
        console.log(err);
        setError('何かがうまくいかなかった');
      }
    }
  };

  return (
    <Container bottom centerH>
      <Loader isLoading={isLoading} />
      <CustomProgressBar current={0} />
      <IconButton
        icon="chevron-left"
        color={Colors.white}
        style={styles.backIcon}
        size={30}
        onPress={() => navigation.goBack()}
      />
      {loginMethod === 'mobile' ? (
        <>
          {tempUser.mobile !== '' ? (
            <CustomText marginB-30>
              この電話番号は登録されていません 新規登録いたしますか？
            </CustomText>
          ) : (
            <CustomText marginB-30>電話番号を入力してください</CustomText>
          )}
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
              theme={{colors: {text: Colors.white}}}
              value={mobile}
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
            label="はい"
            disabled={!!!mobile}
            onPress={handleToConfirmCode}
          />
          <View marginT-10></View>
          <TouchableHighlight
            onPress={() => {
              setError('');
              dispatch(setLoginMethod('email'));
            }}
          >
            <CustomText>メールアドレスで登録</CustomText>
          </TouchableHighlight>
          <View marginB-40></View>
        </>
      ) : (
        <>
          {tempUser.email !== '' ? (
            <CustomText marginB-30>
              このメールアドレスは登録されていません 新規登録いたしますか？
            </CustomText>
          ) : (
            <CustomText marginB-30>メールアドレスを入力してください</CustomText>
          )}
          <TextInput
            underlineColor={Colors.white}
            activeUnderlineColor={Colors.white}
            style={{...styles.emailInput}}
            theme={{colors: {text: Colors.white}}}
            value={email}
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
            label="はい"
            disabled={!!!email}
            onPress={handleToConfirmCode}
          />
          <View marginT-10></View>
          <TouchableHighlight
            onPress={() => {
              setError('');
              dispatch(setLoginMethod('mobile'));
            }}
          >
            <CustomText>電話番号で登録</CustomText>
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

export default Register;
