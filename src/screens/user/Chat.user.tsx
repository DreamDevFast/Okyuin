import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, Dimensions} from 'react-native';
import {List} from 'react-native-paper';
import {Text, View, Avatar} from 'react-native-ui-lib';
import {useFocusEffect} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser, setLoading} from '../../redux/features/globalSlice';

import Loader from '../../components/Loader';
import CustomTabnav from '../../components/CustomTabnav';
import {Colors} from '../../styles';

const userIcon = require('../../assets/images/user.png');

const {width, height} = Dimensions.get('window');

enum Relation {
  initial,
  like,
  dislike,
  favorite,
}

const UserChat = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();

  const users = firestore().collection('Users');
  const relations = firestore().collection('Relations');

  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const isLoading = useAppSelector((state: any) => state.global.isLoading);

  const [targetUsers, setTargetUsers] = useState<Array<any>>([]);

  useFocusEffect(
    useCallback(() => {
      users
        .where('role', '!=', tempUser.role)
        .get()
        .then(async querySnapshot => {
          let results: Array<any> = [];
          for (let i = 0; i < querySnapshot.size; i++) {
            const userDoc = querySnapshot.docs[i];
            const queryResults = await relations
              .where('user1', 'in', [userDoc.id, tempUser.id])
              .get();
            const result = queryResults.docs.filter(doc => {
              return (
                (doc.data().user2 === tempUser.id ||
                  doc.data().user2 === userDoc.id) &&
                (doc.data().relation1 === Relation.like ||
                  doc.data().relation1 === Relation.favorite) &&
                (doc.data().relation2 === Relation.like ||
                  doc.data().relation2 === Relation.favorite)
              );
            });
            console.log(result);
            if (result.length === 1) {
              results.push(userDoc);
            }
          }

          setTargetUsers(
            results.map(doc => ({
              id: doc.id,
              name: doc.data().name,
              avatar: doc.data().avatar,
              sendable: !!doc.data().fcmToken,
            })),
          );

          dispatch(setLoading(false));
        });
    }, []),
  );

  return (
    <CustomTabnav navigation={navigation} route={route}>
      <Loader isLoading={isLoading} />
      <ScrollView>
        <View marginT-50></View>
        {targetUsers.map(user => (
          <List.Item
            key={user.id}
            title={user.name}
            titleStyle={{color: Colors.white}}
            // description={() => {
            //   return (
            //     <View style={{top: -10}}>
            //       <Text style={{color: Colors.iconLabel}}>
            //         diam accumsan ut. Ut imperdiet et leo in vulputate
            //       </Text>
            //       <Text style={{color: Colors.iconLabel, fontSize: 10}}>
            //         5min ago
            //       </Text>
            //     </View>
            //   );
            // }}
            left={() => {
              return (
                <View row>
                  <Avatar
                    size={50}
                    source={
                      user.avatar === 'default.png'
                        ? userIcon
                        : {uri: user.avatar}
                    }
                    label={'IMG'}
                    imageStyle={styles.avatar}
                  />
                </View>
              );
            }}
            style={styles.list_item}
            onPress={() => {
              navigation.navigate('UserChatRoom', {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                sendable: user.sendable,
              });
            }}
          />
        ))}
      </ScrollView>
    </CustomTabnav>
  );
};

const styles = StyleSheet.create({
  list_item: {
    width,
  },
  avatar: {
    borderColor: Colors.white,
    borderWidth: 2,
  },
});
export default UserChat;
