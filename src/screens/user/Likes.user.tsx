import React, {useCallback, useState} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import {Text, View, GridView} from 'react-native-ui-lib';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser, setLoading} from '../../redux/features/globalSlice';

import CustomTabnav from '../../components/CustomTabnav';
import CustomLikeCard from '../../components/CustomLikeCard';
import Loader from '../../components/Loader';

import {useFocusEffect} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

enum Relation {
  initial,
  like,
  dislike,
  favorite,
}

const {width, height} = Dimensions.get('window');

const UserLikes = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const isLoading = useAppSelector((state: any) => state.global.isLoading);
  const [started, setStarted] = useState<boolean>(false);

  const [targetUsers, setTargetUsers] = useState<Array<any>>([]);

  const users = firestore().collection('Users');
  const relations = firestore().collection('Relations');

  useFocusEffect(
    useCallback(() => {
      relations
        .where('user1', '==', tempUser.id)
        .where('relation1', '==', Relation.initial)
        .where('relation2', 'in', [Relation.like, Relation.favorite])
        .get()
        .then(snapShot1 => {
          relations
            .where('user2', '==', tempUser.id)
            .where('relation2', '==', Relation.initial)
            .where('relation1', 'in', [Relation.like, Relation.favorite])
            .get()
            .then(async snapShot2 => {
              let result = [];
              let relations1 = snapShot1.docs;
              let relations2 = snapShot2.docs;
              for (let i = 0; i < relations1.length; i++) {
                try {
                  let userSnapshot = await users
                    .doc(relations1[i].data().user2)
                    .get();
                  result.push({
                    id: userSnapshot.id,
                    relationId: relations1[i].id,
                    relationToUpdate: 'relation1',
                    data: userSnapshot.data(),
                  });
                } catch (err) {
                  console.log(err);
                }
              }

              for (let i = 0; i < relations2.length; i++) {
                try {
                  let userSnapshot = await users
                    .doc(relations2[i].data().user1)
                    .get();
                  result.push({
                    id: userSnapshot.id,
                    relationId: relations2[i].id,
                    relationToUpdate: 'relation2',
                    data: userSnapshot.data(),
                  });
                } catch (err) {
                  console.log(err);
                }
              }

              setTargetUsers(result);
              dispatch(setLoading(false));
            });
        });
    }, []),
  );

  const handleLikeCard = (key: number) => async (
    reaction: 'like' | 'dislike',
  ) => {
    try {
      let user = targetUsers.splice(key, 1)[0];
      if (reaction === 'like') {
        await relations.doc(user.relationId).update({
          [user.relationToUpdate]: Relation.like,
        });
      } else {
        await relations.doc(user.relationId).update({
          [user.relationToUpdate]: Relation.dislike,
        });
      }

      setTargetUsers([...targetUsers]);
    } catch (err) {
      console.log('while handling like card:', err);
    }
  };

  console.log('reloaded', targetUsers);
  return (
    <CustomTabnav navigation={navigation} route={route}>
      <Loader isLoading={isLoading} />
      <ScrollView
        onScrollBeginDrag={() => setStarted(true)}
        onScrollEndDrag={() => setStarted(false)}
      >
        <View row style={{height, width, flexWrap: 'wrap'}}>
          {targetUsers.map((user, key) => (
            <CustomLikeCard
              key={key}
              user={user}
              handleLikeCard={handleLikeCard(key)}
              scrollBegin={started}
            />
          ))}
        </View>
      </ScrollView>
    </CustomTabnav>
  );
};

export default UserLikes;
