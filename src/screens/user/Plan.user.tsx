import React from 'react';
import {Text, View} from 'react-native-ui-lib';
import {IconButton} from 'react-native-paper';
import {StyleSheet, TouchableHighlight} from 'react-native';

import {Colors} from '../../styles';
import {CustomButton} from '../../components';

const UserPlan = ({route, navigation}: any) => {
  const {plan} = route.params;

  return (
    <View centerH>
      <View centerH style={styles.appBar}>
        <IconButton
          icon="chevron-left"
          color={Colors.white}
          style={styles.backIcon}
          size={30}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.block} centerH marginT-27>
          <Text style={styles.title}>有料会員</Text>
        </View>
      </View>

      <View style={styles.block} centerH marginT-27>
        <TouchableHighlight style={{width: '100%'}}>
          <View row centerV centerH style={styles.plan}>
            <Text style={styles.period}>12ヶ月プラン</Text>
            <Text style={styles.price}>300,000</Text>
            <View centerH>
              <Text style={styles.desc}>(税込)</Text>
              <Text style={styles.unit}>円</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.block} centerH marginT-27>
        <TouchableHighlight style={{width: '100%'}}>
          <View row centerV centerH style={styles.plan}>
            <Text style={styles.period}>6ヶ月プラン</Text>
            <Text style={styles.price}>140,000</Text>
            <View centerH>
              <Text style={styles.desc}>(税込)</Text>
              <Text style={styles.unit}>円</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.block} centerH marginT-27>
        <TouchableHighlight style={{width: '100%'}}>
          <View row centerV centerH style={styles.plan}>
            <Text style={styles.period}>3ヶ月プラン</Text>
            <Text style={styles.price}>70,000</Text>
            <View centerH>
              <Text style={styles.desc}>(税込)</Text>
              <Text style={styles.unit}>円</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.block} centerH marginT-27>
        <TouchableHighlight style={{width: '100%'}}>
          <View row centerV centerH style={styles.plan}>
            <Text style={styles.period}>1ヶ月プラン</Text>
            <Text style={styles.price}>25,000</Text>
            <View centerH>
              <Text style={styles.desc}>(税込)</Text>
              <Text style={styles.unit}>円</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.buttonWrapper} marginT-27 marginB-10>
        <CustomButton
          label="リストアする"
          color={Colors.partLabel}
          labelStyle={styles.confirmLabel}
          style={styles.confirm}
          onPress={() => {
            console.log('pressed');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    left: 0,
    top: 10,
  },
  title: {
    color: Colors.iconLabel,
    fontSize: 20,
  },
  block: {
    width: '80%',
  },
  appBar: {
    backgroundColor: Colors.grey50,
    width: '100%',
    paddingBottom: 20,
  },
  plan: {
    backgroundColor: Colors.gradient1,
    width: '100%',
    padding: 5,
    borderRadius: 30,
    elevation: 3,
  },
  period: {
    color: Colors.white,
    fontSize: 15,
  },
  price: {
    marginLeft: 10,
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 40,
  },
  desc: {
    color: Colors.white,
    fontSize: 12,
  },
  unit: {
    color: Colors.white,
    fontSize: 20,
  },
  buttonWrapper: {
    width: '80%',
  },
  confirm: {
    borderRadius: 50,
  },
  confirmLabel: {
    color: Colors.white,
  },
});

export default UserPlan;
