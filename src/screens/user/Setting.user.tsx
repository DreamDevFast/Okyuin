import React, {useCallback, useState} from 'react';
import axios from 'axios';
import {Text, View} from 'react-native-ui-lib';
import {StyleSheet, ScrollView, Image, TouchableHighlight} from 'react-native';
import RangeSlider from 'rn-range-slider';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import {Container, CustomButton, CustomText} from '../../components';
import {Colors} from '../../styles';
import {Dropdown} from 'react-native-element-dropdown';
import {TextInput, Switch, IconButton, Modal} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';

import syncStorage from 'sync-storage';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {
  setTempUser,
  setLoading,
  setAuthenticated,
} from '../../redux/features/globalSlice';
import {
  setSetting,
  Range,
  setPriceRange,
} from '../../redux/features/settingSlice';
import {pref_city} from '../../constants/config';

import Thumb from '../../components/Thumb';
import Rail from '../../components/Rail';
import RailSelected from '../../components/RailSelected';
import Notch from '../../components/Notch';
import Label from '../../components/Label';

import Loader from '../../components/Loader';

const logoImage = require('../../assets/images/logo.png');

const CELL_COUNT = 6;
var emailConfirmCodeBaseURL =
  'https://us-central1-okyuin-akiba.cloudfunctions.net/sendMail';

var code = '';
var confirmation: any;

const UserSetting = ({navigation}: any) => {
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const isLoading = useAppSelector((state: any) => state.global.isLoading);
  const setting = useAppSelector((state: any) => state.setting);
  //----------------For Code Field-----------------//
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  //----------------For Code Field-----------------//

  const [error, setError] = useState('');

  const [visible, SetVisible] = useState<boolean>(false);
  const [whichCredentialChange, SetWhichCredentialChange] = useState<
    'email' | 'mobile'
  >('email');
  const [email, SetEmail] = useState<string>(tempUser.email);
  const [mobile, SetMobile] = useState<string>(tempUser.mobile);
  const [isNotifying, SetNotifying] = useState<boolean>(setting.isNotifying);
  const [searchLocation, SetSearchLocation] = useState<string>(
    setting.searchLocation,
  );
  const [keyword, SetKeyword] = useState<string>(setting.keyword);
  const [priceRange, SetPriceRange] = useState<Range>({
    low: setting.priceRange.low,
    high: setting.priceRange.high,
  });
  const [unlimitedLikesAndChat, SetUnlimited] = useState<string>(
    setting.unlimitedLikesAndChat,
  );
  const [ageRange, SetAgeRange] = useState<Range>({
    low: setting.ageRange.low,
    high: setting.ageRange.high,
  });

  const settings = firestore().collection('Settings');
  const users = firestore().collection('Users');

  const dispatch = useAppDispatch();

  console.log('refresh', setting.isNotifying, isNotifying);
  useFocusEffect(
    useCallback(() => {
      settings
        .doc(tempUser.id)
        .get()
        .then(doc => {
          if (doc.exists) {
            const setting = doc.data();
            console.log('doc', setting);
            if (setting !== undefined) {
              dispatch(
                setSetting({
                  id: doc.id,
                  isNotifying: setting.isNotifying,
                  searchLocation: setting.searchLocation,
                  keyword: setting.keyword === undefined ? '' : setting.keyword,
                  priceRange: setting.priceRange,
                  unlimitedLikesAndChat:
                    setting.unlimitedLikesAndChat === undefined
                      ? '0'
                      : setting.unlimitedLikesAndChat,
                  ageRange:
                    setting.ageRange === undefined
                      ? {low: 15, high: 30}
                      : setting.ageRange,
                }),
              );
              SetNotifying(setting.isNotifying);
              SetSearchLocation(setting.searchLocation);
              SetKeyword(setting.keyword === undefined ? '' : setting.keyword);
              SetPriceRange(setting.priceRange);
              SetUnlimited(
                setting.unlimitedLikesAndChat === undefined
                  ? '0'
                  : setting.unlimitedLikesAndChat,
              );
              SetAgeRange(
                setting.ageRange === undefined
                  ? {low: 15, high: 30}
                  : setting.ageRange,
              );
            }
          }
        });
    }, []),
  );

  const save = async (key: string, value: any) => {
    try {
      dispatch(setLoading(true));
      if (key === 'email' || key === 'mobile') {
        try {
          await users.doc(tempUser.id).update({
            [key]: value,
          });
          console.log('update user info succeeded!');
          dispatch(setTempUser({...tempUser, [key]: value}));
          dispatch(setLoading(false));
        } catch (err) {
          console.log('Update "Users" collection error: ', err);
        }
      } else if (setting.id === '') {
        await settings.doc(tempUser.id).set({
          ...{
            isNotifying,
            keyword,
            searchLocation,
            priceRange,
            unlimitedLikesAndChat,
            ageRange,
          },
          [key]: value,
        });
        console.log('save setting info succeeded!');
        dispatch(
          setSetting({
            ...{
              id: tempUser.id,
              isNotifying,
              searchLocation,
              keyword,
              priceRange,
              unlimitedLikesAndChat,
              ageRange,
            },
            [key]: value,
          }),
        );
        dispatch(setLoading(false));
      } else if (setting.id === tempUser.id) {
        await settings.doc(setting.id).update({
          ...{
            isNotifying,
            keyword,
            searchLocation,
            priceRange,
            unlimitedLikesAndChat,
            ageRange,
          },
          [key]: value,
        });
        console.log('update setting info succeeded!', ageRange);
        dispatch(
          setSetting({
            ...{
              id: tempUser.id,
              isNotifying,
              searchLocation,
              keyword,
              priceRange,
              unlimitedLikesAndChat,
              ageRange,
            },
            [key]: value,
          }),
        );
        dispatch(setLoading(false));
      } else {
        console.log('setting id is NOT equal to tempUser id');
      }
    } catch (err) {
      console.log('Create or Update "Settings" collection error: ', err);
    }
  };

  const onToggleSwitch = async () => {
    SetNotifying(!isNotifying);
    await save('isNotifying', !isNotifying);
  };

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(
    (value: number) => <Label text={value} />,
    [],
  );
  const renderNotch = useCallback(() => <Notch />, []);
  const handlePriceValueChange = useCallback(
    async (low: number, high: number) => {
      SetPriceRange({low, high});
      await save('priceRange', {low, high});
    },
    [],
  );

  const handleAgeValueChange = useCallback(
    async (low: number, high: number) => {
      console.log(low, high);
      SetAgeRange({low, high});
      await save('ageRange', {low, high});
    },
    [],
  );

  const handleUserInfo = useCallback(
    (method: 'email' | 'mobile') => (value: string) => {
      if (method === 'email') {
        console.log(value);
        SetEmail(value);
      } else if (method === 'mobile') {
        SetMobile(value);
      }
    },
    [],
  );

  const handleEndEditing = (method: 'email' | 'mobile') => async () => {
    if (method === 'email') {
      let regForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (regForEmail.test(email) === false) {
        return setError('入力内容が正しくないのでご確認ください。');
      } else {
        setError('');
      }
      if (email !== tempUser.email) {
        const querySnapshot = await users.where('email', '==', email).get();
        if (querySnapshot.docs.length) {
          return setError('資格情報は既に存在します。');
        } else {
          setError('');
        }
        SetWhichCredentialChange('email');
        dispatch(setLoading(true));
        code = '';
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
          showModal();
        }
      }
    } else if (method === 'mobile') {
      let regForMobile = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      if (regForMobile.test(email) === false) {
        return setError('入力内容が正しくないのでご確認ください。');
      } else {
        setError('');
      }
      if (mobile !== tempUser.mobile) {
        const querySnapshot = await users.where('mobile', '==', mobile).get();
        if (querySnapshot.docs.length) {
          return setError('資格情報は既に存在します。');
        } else {
          setError('');
        }
        SetWhichCredentialChange('mobile');
        dispatch(setLoading(true));
        confirmation = await auth().verifyPhoneNumber(`+${mobile}`);
        console.log('confirm finished');
        if (confirmation) {
          dispatch(setLoading(false));
          showModal();
        }
      }
    }
  };

  const confirmVerificationCode = () => {
    if (whichCredentialChange === 'email') {
      if (code === value) {
        save('email', email);
        setValue('');
        hideModal();
      } else {
        hideModal();
        SetEmail(tempUser.email);
        setValue('');
        setError('※コードが正しくないのでご確認ください');
      }
    } else if (whichCredentialChange === 'mobile') {
      try {
        const credential = auth.PhoneAuthProvider.credential(
          confirmation.verificationId,
          value,
        );
        save('mobile', mobile);
        setValue('');
        hideModal();
      } catch (err) {
        let error: any = err;
        if (error.code == 'auth/invalid-verification-code') {
          hideModal();
          SetMobile(tempUser.mobile);
          setValue('');
          setError('※コードが正しくないのでご確認ください');
        }
      }
    }
  };

  const handleSettingValue = useCallback(
    (key: 'searchLocation' | 'keyword' | 'unlimitedLikesAndChat') => async (
      value: string,
    ) => {
      if (key === 'searchLocation') {
        SetSearchLocation(value);
      } else if (key === 'keyword') {
        SetKeyword(value);
      } else if (key === 'unlimitedLikesAndChat') {
        SetUnlimited(value);
      }
      await save(key, value);
    },
    [],
  );

  const logout = async () => {
    await syncStorage.remove('token');
    dispatch(setAuthenticated(false));
  };

  const showModal = () => SetVisible(true);
  const hideModal = () => SetVisible(false);

  const dismiss = () => {
    if (whichCredentialChange === 'email') SetEmail(tempUser.email);
    if (whichCredentialChange === 'mobile') SetMobile(tempUser.mobile);
    setValue('');
    hideModal();
  };

  const handlePlanClick = (plan: 'platinum' | 'gold') => () => {
    navigation.navigate('UserPlan', {plan});
  };

  console.log('email', email);
  return (
    <Container centerH>
      <Loader isLoading={isLoading} />
      <ScrollView style={{width: '100%'}}>
        <View centerH>
          <IconButton
            icon="chevron-left"
            color={Colors.white}
            style={styles.backIcon}
            size={30}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.block} centerH marginT-27>
            <Text style={styles.title}>設定</Text>
          </View>
          <View marginT-20></View>
          {error ? (
            <CustomText marginB-10 style={styles.error}>
              {error}
            </CustomText>
          ) : (
            <></>
          )}
          {tempUser.role === 'shop' ? (
            <>
              <TouchableHighlight onPressOut={handlePlanClick('platinum')}>
                <View style={styles.block}>
                  <View centerH marginB-10 style={styles.planContainer}>
                    <View row centerV>
                      <Image source={logoImage} style={styles.logoImage} />
                      <Text style={styles.appName}>おきゅいん</Text>
                      <Text style={styles.platinum}>PLATINUM</Text>
                    </View>
                    <View>
                      <Text style={{textAlign: 'center'}}>
                        優先LIKEを送ったり、自分をLIKEした人を確認したり、便利な機能がたくさん！
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPressOut={handlePlanClick('gold')}>
                <View style={styles.block}>
                  <View centerH marginB-10 style={styles.planContainer}>
                    <View row centerV>
                      <Image source={logoImage} style={styles.logoImage} />
                      <Text style={styles.appName}>おきゅいん</Text>
                      <Text style={styles.gold}>GOLD</Text>
                    </View>
                    <View>
                      <Text style={{textAlign: 'center'}}>
                        優先LIKEを送ったり、自分をLIKEした人を確認したり、便利な機能がたくさん！
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableHighlight>
              <View style={styles.block}>
                <Text color={Colors.subLabel}>無制限のいいねとチャット</Text>
                <View centerV right style={styles.part} marginB-10 marginT-10>
                  <TextInput
                    style={styles.input}
                    selectionColor={Colors.black}
                    underlineColor={'#ffffff'}
                    activeUnderlineColor={'#ffffff'}
                    theme={{colors: {text: Colors.dark}}}
                    value={unlimitedLikesAndChat}
                    onChangeText={handleSettingValue('unlimitedLikesAndChat')}
                  />
                </View>
              </View>
            </>
          ) : (
            <></>
          )}

          <View style={styles.block}>
            <Text color={Colors.subLabel}>アカウント設定</Text>
            <View row spread centerV style={styles.part} marginB-10 marginT-10>
              <Text style={styles.partLabel}>メールアドレス</Text>
              <TextInput
                style={styles.input}
                selectionColor={Colors.black}
                underlineColor={'#ffffff'}
                activeUnderlineColor={'#ffffff'}
                theme={{colors: {text: Colors.dark}}}
                value={email}
                onChangeText={handleUserInfo('email')}
                onEndEditing={handleEndEditing('email')}
              />
            </View>
            <View row spread centerV style={styles.part} marginB-10>
              <Text style={styles.partLabel}>電話番号</Text>
              <TextInput
                style={styles.input}
                selectionColor={Colors.black}
                underlineColor={'#ffffff'}
                activeUnderlineColor={'#ffffff'}
                theme={{colors: {text: Colors.dark}}}
                value={mobile}
                onChangeText={text =>
                  handleUserInfo('mobile')(text.replace(/[^0-9]/g, ''))
                }
                onEndEditing={handleEndEditing('mobile')}
              />
            </View>
            <View row spread centerV style={styles.part} marginB-10>
              <Text style={styles.partLabel}>通知</Text>
              <Switch
                color={Colors.redBtn}
                value={isNotifying}
                style={styles.switch}
                onValueChange={onToggleSwitch}
              />
            </View>
          </View>
          <View style={styles.block} marginT-10>
            <Text color={Colors.subLabel}>検索条件</Text>
            <View marginT-10></View>
            {tempUser.role === 'girl' ? (
              <View row spread centerV style={styles.part} marginB-10>
                <Text style={styles.partLabel}>希望エリア</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={pref_city.map(item => ({
                    label: item.pref,
                    value: item.id,
                  }))}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={''}
                  searchPlaceholder={''}
                  onChange={(item: any) =>
                    handleSettingValue('searchLocation')(item.value)
                  }
                  value={searchLocation}
                />
              </View>
            ) : (
              <></>
            )}
            <View style={{...styles.part, height: 70}} centerV marginB-10>
              <View row spread centerV marginT-10>
                <Text style={styles.partLabel}>希望時給</Text>
              </View>
              <View marginT-20 marginB-20 centerH>
                <RangeSlider
                  style={styles.slider}
                  min={1500}
                  max={10000}
                  low={priceRange.low}
                  high={priceRange.high}
                  step={100}
                  floatingLabel
                  renderThumb={renderThumb}
                  renderRail={renderRail}
                  renderRailSelected={renderRailSelected}
                  renderLabel={renderLabel}
                  renderNotch={renderNotch}
                  onValueChanged={handlePriceValueChange}
                />
              </View>
            </View>
            {tempUser.role === 'shop' ? (
              <View style={{...styles.part, height: 70}} centerV marginB-10>
                <View row spread centerV marginT-10>
                  <Text style={styles.partLabel}>年齢</Text>
                </View>
                <View marginT-20 marginB-20 centerH>
                  <RangeSlider
                    style={styles.slider}
                    min={15}
                    max={30}
                    low={ageRange.low}
                    high={ageRange.high}
                    step={1}
                    floatingLabel
                    renderThumb={renderThumb}
                    renderRail={renderRail}
                    renderRailSelected={renderRailSelected}
                    renderLabel={renderLabel}
                    renderNotch={renderNotch}
                    onValueChanged={handleAgeValueChange}
                  />
                </View>
              </View>
            ) : (
              <></>
            )}

            {tempUser.role === 'girl' ? (
              <View row spread centerV style={styles.part} marginB-10>
                <Text style={styles.partLabel}>キーワード</Text>
                <TextInput
                  style={styles.input}
                  selectionColor={Colors.black}
                  underlineColor={'#ffffff'}
                  activeUnderlineColor={'#ffffff'}
                  theme={{colors: {text: Colors.dark}}}
                  value={keyword}
                  onChangeText={handleSettingValue('keyword')}
                />
              </View>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.block} marginT-10>
            <Text color={Colors.subLabel}>お問い合わせ</Text>
            <CustomButton
              label="ヘルプとお問い合わせ"
              color={Colors.white}
              labelStyle={styles.help}
              style={styles.logout}
              onPress={() => navigation.navigate('Help')}
            />
          </View>
          <View style={styles.block} marginT-10 marginB-10>
            <CustomButton
              label="ログアウト"
              color={Colors.redBtn}
              labelStyle={styles.logoutLabel}
              style={styles.logout}
              onPress={logout}
            />
          </View>
        </View>
        <Modal
          visible={visible}
          onDismiss={dismiss}
          contentContainerStyle={styles.containerStyle}
        >
          <Text style={styles.modalText} marginB-10>
            {whichCredentialChange === 'email'
              ? '確認のために以下のメールアドレスにメールをお送りいたしました。'
              : '確認のために以下の電話番号に認証コードをお送りいたしました。'}
          </Text>
          <Text style={styles.modalText} marginB-10>
            {whichCredentialChange === 'email' ? email : mobile}
          </Text>

          {whichCredentialChange === 'email' ? (
            <Text style={styles.modalText} marginB-30>
              メールをご確認して認証コードを入力してください。
            </Text>
          ) : (
            <View marginB-30></View>
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
          <View style={styles.buttonWrapper} marginT-10 marginB-10>
            <CustomButton
              label="確認"
              color={Colors.redBtn}
              labelStyle={styles.logoutLabel}
              style={styles.logout}
              onPress={confirmVerificationCode}
            />
          </View>
          <View style={styles.buttonWrapper} marginT-10 marginB-10>
            <CustomButton
              label="キャンセル"
              color={Colors.partLabel}
              labelStyle={styles.logoutLabel}
              style={styles.logout}
              onPress={dismiss}
            />
          </View>
        </Modal>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    left: 0,
    top: 10,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
  },
  block: {
    width: '80%',
  },
  planContainer: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  logoImage: {
    width: 20,
    height: 20,
  },
  appName: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  platinum: {
    backgroundColor: Colors.grey1,
    color: Colors.white,
    borderRadius: 5,
    fontSize: 10,
    padding: 2,
  },
  gold: {
    backgroundColor: Colors.yellow10,
    color: Colors.white,
    borderRadius: 5,
    fontSize: 10,
    padding: 2,
  },
  part: {
    backgroundColor: Colors.white,
    borderRadius: 30,
  },
  input: {
    height: 50,
    borderRadius: 30,
    marginRight: 20,
    backgroundColor: Colors.white,
    paddingHorizontal: 0,
    borderColor: '#00000000',
    borderWidth: 0,
    width: '60%',
    textAlign: 'right',
  },
  switch: {
    marginRight: 20,
    height: 50,
  },
  partLabel: {
    color: Colors.partLabel,
    marginLeft: 20,
    fontSize: 10,
  },
  logout: {
    borderRadius: 50,
  },
  logoutLabel: {
    color: Colors.white,
  },
  slider: {
    width: '90%',
  },
  help: {
    color: Colors.iconLabel,
  },
  dropdown: {
    height: 30,
    paddingLeft: 12,
    paddingRight: 12,
    width: '80%',
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: 'transparent',
    borderBottomWidth: 1,
  },
  inputSearchStyle: {
    height: 40,
    color: Colors.white,
  },
  selectedTextStyle: {
    color: Colors.black,
    textAlign: 'right',
  },
  placeholderStyle: {
    color: Colors.white,
  },
  containerStyle: {
    backgroundColor: Colors.modalBack,
    padding: 20,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 20,
  },
  modalText: {
    color: Colors.white,
    textAlign: 'center',
  },
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 20,
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
  buttonWrapper: {
    width: '100%',
  },
  error: {
    color: Colors.red10,
  },
});

export default UserSetting;
