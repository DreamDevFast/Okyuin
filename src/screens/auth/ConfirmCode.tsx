import React, {useState} from 'react';
import {View, Text} from 'react-native-ui-lib';
import {StyleSheet, TouchableHighlight, ScrollView} from 'react-native';
import {TextInput, IconButton} from 'react-native-paper';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

import {setLoading, setResendCount} from '../../redux/features/globalSlice';
import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {Colors} from '../../styles';
import {Container, CustomButton, CustomText} from '../../components';
import CustomProgressBar from '../../components/CustomProgressBar';

const CELL_COUNT = 6;

var emailConfirmCodeBaseURL =
  'https://us-central1-okyuin-akiba.cloudfunctions.net/sendMail';

const ConfirmCode = ({navigation, route}: any) => {
  let {code, confirmation, email, mobile} = route.params;
  const dispatch = useAppDispatch();
  const loginMethod = useAppSelector((state: any) => state.global.loginMethod);
  const resendCount = useAppSelector((state: any) => state.global.resendCount);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [params, setParams] = useState({
    code,
    confirmation,
    email,
    mobile,
  });
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleConfirm = async () => {
    if (loginMethod === 'email') {
      console.log(params.code, value);
      if (params.code === value) {
        setError('');
        navigation.navigate('NameInput');
      } else {
        setError('※コードが正しくないのでご確認ください');
      }
    } else if (loginMethod === 'mobile') {
      try {
        const credential = auth.PhoneAuthProvider.credential(
          params.confirmation.verificationId,
          value,
        );
        setError('');
        navigation.navigate('NameInput');
      } catch (err) {
        let error: any = err;
        if (error.code == 'auth/invalid-verification-code') {
          console.log('Invalid code.');
          setError('※コードが正しくないのでご確認ください');
        }
      }
    }
  };

  const resendCode = async () => {
    dispatch(setResendCount(resendCount + 1));
    let resentCode = '',
      resentConfirmation = null;
    if (loginMethod === 'email') {
      try {
        dispatch(setLoading(true));
        for (let i = 0; i < 6; i++) {
          let each = Math.floor(Math.random() * 10) % 10;
          resentCode += `${each}`;
        }
        const res = await axios.get(
          emailConfirmCodeBaseURL + `?dest=${email}&code=${resentCode}`,
        );
        console.log(res.data);
        if (res.data === 'Sended') {
          dispatch(setLoading(false));
          setParams({
            ...params,
            code: resentCode,
          });
          console.log('resentcode', code, resentCode);
        }
      } catch (err) {
        console.log(err);
        setError('何かがうまくいかなかった');
      }
    } else if (loginMethod === 'mobile') {
      try {
        setError('');
        dispatch(setLoading(true));
        resentConfirmation = await auth().verifyPhoneNumber(`+${mobile}`);
        console.log('confirm finished');
        if (resentConfirmation) {
          console.log(resentConfirmation);
          dispatch(setLoading(false));
          setParams({
            ...params,
            code: resentCode,
            confirmation: resentConfirmation,
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
      <CustomProgressBar current={0.143} />
      <IconButton
        icon="chevron-left"
        color={Colors.white}
        style={styles.backIcon}
        size={30}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>認証コード</Text>
      <View style={styles.divider}></View>
      <CustomText marginB-10>
        {loginMethod === 'email'
          ? '確認のために以下のメールアドレスにメールをお送りいたしました。'
          : '確認のために以下の電話番号に認証コードをお送りいたしました。'}
      </CustomText>
      <CustomText marginB-10>
        {loginMethod === 'email' ? email : mobile}
      </CustomText>

      {loginMethod === 'email' ? (
        <CustomText marginB-30>
          メールをご確認して認証コードを入力してください。
        </CustomText>
      ) : (
        <View marginB-30></View>
      )}

      <CustomText marginB-10={!!!error} style={styles.confirmLabel}>
        認証コードを入力してください
      </CustomText>
      {error ? (
        <CustomText marginB-10 style={styles.error}>
          {error}
        </CustomText>
      ) : (
        <></>
      )}

      <View>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>

      <CustomButton label="次へ" disabled={!!!value} onPress={handleConfirm} />
      {resendCount < 2 ? (
        <TouchableHighlight onPress={resendCode}>
          <CustomText marginB-40 marginT-10>
            認証コードの再送信をリクエストする
          </CustomText>
        </TouchableHighlight>
      ) : (
        <View marginT-50></View>
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
  confirmLabel: {
    width: '80%',
  },
  letter: {
    height: 30,
    width: '11.7%',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 50,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  codeFieldRoot: {
    marginTop: 20,
    width: '80%',
    marginBottom: 20,
    marginLeft: 15,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#ffffff77',
    borderRadius: 3,
    textAlign: 'center',
    backgroundColor: '#ffffff66',
    color: Colors.white,
  },
  focusCell: {
    borderColor: '#ffffff',
  },
  error: {
    color: Colors.red10,
    width: '80%',
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

export default ConfirmCode;
