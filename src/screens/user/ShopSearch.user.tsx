import React, {useRef, useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableHighlight,
  PanResponder,
  Animated,
  Image,
  AppState,
} from 'react-native';
import {View, Button, Text} from 'react-native-ui-lib';
import {Divider, FAB, IconButton} from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useFocusEffect} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser, setLoading} from '../../redux/features/globalSlice';

import CustomTabnav from '../../components/CustomTabnav';
import {Colors} from '../../styles';
import CustomStamp from '../../components/CustomStamp';
import Loader from '../../components/Loader';
import {pref_city} from '../../constants/config';
import CustomIconButton from '../../components/CustomIconButton';
import FavoriteGradient from '../../components/FavoriteGradient';

const defaultImage = require('../../assets/images/empty.jpg');
const refreshIcon = require('../../assets/icons/refresh-main.png');
const likeIcon = require('../../assets/icons/like-main.png');
const dislikeIcon = require('../../assets/icons/dislike-main.png');
const favoriteIcon = require('../../assets/icons/favorite-main.png');
const boostIcon = require('../../assets/icons/boost-main.png');

const {width, height} = Dimensions.get('window');
const threshold = width * 0.1;

enum Relation {
  initial,
  like,
  dislike,
  favorite,
}

const CYCLE_COUNT = 10;

var index = 0;
var targetUsers_alt: Array<any>;
var tempUsers: Array<any>;

const UserShopSearch = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();

  const users = firestore().collection('Users');
  const relations = firestore().collection('Relations');
  const settings = firestore().collection('Settings');
  const profiles = firestore().collection('Profiles');

  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const isLoading = useAppSelector((state: any) => state.global.isLoading);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [targetUsers, setTargetUsers] = useState<Array<any>>([]);

  const [state, setState] = useState<Relation>(Relation.initial);

  const appState = useRef(AppState.currentState);

  const pan = useRef(new Animated.ValueXY()).current;
  const favoriteValue = Animated.multiply(
    pan.x.interpolate({
      inputRange: [
        -width,
        -threshold,
        -(threshold - 1),
        0,
        threshold - 1,
        threshold,
        width,
      ],
      outputRange: [0, 0, 1, 1, 1, 0, 0],
    }),
    pan.y,
  );

  const [direction, setDirection] = useState<1 | -1>(1);

  targetUsers_alt = targetUsers;
  index = currentIndex;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.y0 > height * 0.5) {
          setDirection(-1);
        } else {
          setDirection(1);
        }
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        console.log(gestureState.dx, width * 0.3);
        if (
          Math.abs(gestureState.dx) < width * 0.3 &&
          gestureState.dy > width * -0.3
        ) {
          Animated.spring(pan, {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: false,
          }).start();
          return;
        }
        Animated.spring(pan, {
          toValue: {
            x:
              gestureState.dx === 0
                ? 0
                : width * (gestureState.dx / Math.abs(gestureState.dx)),
            y: 0,
          },
          useNativeDriver: false,
        }).start(({finished}) => {
          if (finished) {
          }
        });

        console.log('release: ', currentIndex);

        index++;
        Animated.timing(pan, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: false,
          duration: 0,
        }).start();
        if (gestureState.dx >= width * 0.3) {
          console.log(index);
          handleRelation(Relation.like)();
        } else if (gestureState.dx <= width * -0.3) {
          handleRelation(Relation.dislike)();
        } else if (gestureState.dy <= width * -0.3)
          handleRelation(Relation.favorite)();
        else setCurrentIndex(index);
      },
    }),
  ).current;

  const fetchUsers = (count: number) => {
    return new Promise((resolve, reject) => {
      users
        .where('role', '!=', tempUser.role)
        .get()
        .then(async querySnapshot => {
          const mySetting = await settings.doc(tempUser.id).get();
          const users = [];
          console.log(querySnapshot.docs.length);
          if (querySnapshot.docs.length === 0) return;
          querySnapshot.docs.sort((docA: any, docB: any) => {
            if (docA.data().boostedAt !== undefined) {
              if (
                Date.now() - docA.data().boostedAt.seconds * 1000 <
                30 * 60 * 1000
              ) {
                return -1;
              }
            }

            return 1;
          });
          console.log('Here A area is reached');

          let myReactedRelations: Array<any> = [];
          let reactedRelations1 = await relations
            .where('user1', '==', tempUser.id)
            .where('relation1', '!=', Relation.initial)
            .get();
          console.log(reactedRelations1.size);

          let reactedRelations2 = await relations
            .where('user2', '==', tempUser.id)
            .where('relation2', '!=', Relation.initial)
            .get();

          if (reactedRelations1.size) {
            myReactedRelations.push(...reactedRelations1.docs);
          }

          if (reactedRelations2.size) {
            myReactedRelations.push(...reactedRelations2.docs);
          }

          console.log('Here is reached');
          const docListWithoutFavorite = [];
          // process favorite
          for (let i = 0; i < querySnapshot.docs.length; i++) {
            let doc = querySnapshot.docs[i];

            if (
              myReactedRelations.length &&
              myReactedRelations.findIndex(relation => {
                if (
                  relation.data().user1 === doc.id ||
                  relation.data().user2 === doc.id
                ) {
                  return true;
                }
                return false;
              }) !== -1
            )
              continue;

            const favoriteRelation1 = await relations
              .where('user1', '==', tempUser.id)
              .where('relation1', '==', Relation.initial)
              .where('user2', '==', doc.id)
              .where('relation2', '==', Relation.favorite)
              .get();
            const favoriteRelation2 = await relations
              .where('user2', '==', tempUser.id)
              .where('relation2', '==', Relation.initial)
              .where('user1', '==', doc.id)
              .where('relation1', '==', Relation.favorite)
              .get();
            if (
              favoriteRelation1.docs.length ||
              favoriteRelation2.docs.length
            ) {
              const profile = await profiles.doc(doc.id).get();
              const setting = await settings.doc(doc.id).get();

              let bio = '',
                priceRange = {low: 1500, high: 10000};

              if (profile.exists) {
                let data = profile.data();
                if (data !== undefined) {
                  bio = data.bio;
                }
              }

              if (setting.exists) {
                let data = setting.data();
                if (data !== undefined) {
                  priceRange = data.priceRange;
                }
              }

              const matchedPrefs = pref_city.filter(
                each => each.id === doc.data().prefecture,
              );
              let prefecture_name = '';
              if (matchedPrefs.length) {
                prefecture_name = matchedPrefs[0].pref;
              }
              let online = false;
              if (doc.data().loginState && doc.data().loginState === 'active') {
                online = true;
              }

              users.push({
                id: doc.id,
                name: doc.data().name,
                avatar: doc.data().avatar,
                prefecture_name,
                bio,
                low: priceRange.low,
                hight: priceRange.high,
                favorite: true,
                online,
              });

              if (users.length === count) return resolve(users);
            } else {
              docListWithoutFavorite.push(doc);
            }
          }
          // end process
          for (let i = 0; i < docListWithoutFavorite.length; i++) {
            let doc = docListWithoutFavorite[i];

            if (
              myReactedRelations.length &&
              myReactedRelations.findIndex(relation => {
                if (
                  relation.data().user1 === doc.id ||
                  relation.data().user2 === doc.id
                ) {
                  return true;
                }
                return false;
              }) !== -1
            )
              continue;

            const profile = await profiles.doc(doc.id).get();
            const setting = await settings.doc(doc.id).get();

            let bio = '',
              priceRange = {low: 1500, high: 10000};

            if (profile.exists) {
              let data = profile.data();
              if (data !== undefined) {
                bio = data.bio;
              }
            }

            if (setting.exists) {
              let data = setting.data();
              if (data !== undefined) {
                priceRange = data.priceRange;
              }
            }

            // filter by setting
            if (tempUser.role === 'girl') {
              if (mySetting.exists) {
                const data = mySetting.data();
                if (data) {
                  const {
                    searchLocation,
                    keyword,
                    priceRange: myPriceRange,
                  } = data;
                  console.log(searchLocation, keyword, priceRange);
                  if (
                    searchLocation &&
                    searchLocation !== doc.data().prefecture
                  )
                    continue;
                  if (
                    myPriceRange.low > priceRange.high ||
                    myPriceRange.high < priceRange.low
                  )
                    continue;
                  if (
                    keyword &&
                    !doc.data().name.includes(keyword) &&
                    !bio.includes(keyword)
                  )
                    continue;
                }
              }
            } else if (tempUser.role === 'shop') {
              const data = mySetting.data();
              if (data) {
                const {ageRange, priceRange: myPriceRange} = data;
                if (
                  myPriceRange.low > priceRange.high ||
                  myPriceRange.high < priceRange.low
                )
                  continue;
                const birthday = new Date(doc.data().birthday.seconds * 1000);
                const age = new Date().getFullYear() - birthday.getFullYear();
                console.log('age', age);
                if (age < ageRange.low || age > ageRange.high) continue;
              }
            }
            // filtered by setting
            console.log('passed');
            const matchedPrefs = pref_city.filter(
              each => each.id === doc.data().prefecture,
            );
            let prefecture_name = '';
            if (matchedPrefs.length) {
              prefecture_name = matchedPrefs[0].pref;
            }

            let online = false;
            if (doc.data().loginState && doc.data().loginState === 'active') {
              online = true;
            }

            users.push({
              id: doc.id,
              name: doc.data().name,
              avatar: doc.data().avatar,
              prefecture_name,
              bio,
              low: priceRange.low,
              hight: priceRange.high,
              favorite: false,
              online,
            });

            if (users.length === count) break;
          }
          console.log('====Users Length======\n', users.length);
          resolve(users);
        })
        .catch(err => reject(err));
    });
  };

  useFocusEffect(
    useCallback(() => {
      _handleAppStateChange('active');
      AppState.addEventListener('change', _handleAppStateChange);

      fetchUsers(CYCLE_COUNT)
        .then((users: any) => {
          console.log(users);
          setTargetUsers(users);
          dispatch(setLoading(false));
        })
        .catch(err => console.log(err));

      return () => {
        index = 0;
      };
    }, []),
  );

  const _handleAppStateChange = async (nextAppState: any) => {
    // console.log(nextAppState);
    // if (
    //   appState.current.match(/inactive|background/) &&
    //   nextAppState === 'active'
    // ) {
    //   // TODO SET USERS ONLINE STATUS TO TRUE
    //   console.log(nextAppState);

    // } else {
    //   // TODO SET USERS ONLINE STATUS TO FALSE
    //   console.log(nextAppState);
    //   users.doc(tempUser.id).update({
    //     loginState: nextAppState
    //   })
    // }
    await users.doc(tempUser.id).update({
      loginState: nextAppState,
      stateChangeDate: new Date(),
    });
    appState.current = nextAppState;
    console.log('AppState', appState.current);
  };

  const getTargetUserFromIndex = async (users: Array<any>, index: number) => {
    let bio = '',
      priceRange = {low: 1500, high: 10000};

    const profile = await profiles.doc(users[index].id).get();
    const setting = await settings.doc(users[index].id).get();

    if (profile.exists) {
      let data = profile.data();
      if (data !== undefined) {
        bio = data.bio;
      }
    }

    if (setting.exists) {
      let data = setting.data();
      if (data !== undefined) {
        priceRange = data.priceRange;
      }
    }

    const matchedPrefs = pref_city.filter(
      each => each.id === users[index].data().prefecture,
    );
    let prefecture_name = '';
    if (matchedPrefs.length) {
      prefecture_name = matchedPrefs[0].pref;
    }

    return {
      id: users[index].id,
      name: users[index].data().name,
      avatar: users[index].data().avatar,
      prefecture_name,
      bio,
      low: priceRange.low,
      high: priceRange.high,
    };
  };

  const handleFilter = async (filterName: Relation) => {
    dispatch(setLoading(true));

    const querySnapshot = await users.where('role', '!=', tempUser.role).get();
    console.log('out', querySnapshot.size);
    if (querySnapshot.size) {
      console.log('in', querySnapshot.size);
      const users = querySnapshot.docs;
      console.log(tempUser.id, filterName);
      console.log(users);
      const relationQuerySnapshot1 = await relations
        .where('user1', '==', tempUser.id)
        .where('relation1', '==', filterName)
        .get();
      const relationQuerySnapshot2 = await relations
        .where('user2', '==', tempUser.id)
        .where('relation2', '==', filterName)
        .get();

      let resultUsers = [];
      console.log('relation1 size: ', relationQuerySnapshot1.docs);
      console.log('relation2 size: ', relationQuerySnapshot2.docs);
      for (let i = 0; i < relationQuerySnapshot1.size; i++) {
        let index = users.findIndex(
          user => user.id === relationQuerySnapshot1.docs[i].data().user2,
        );

        if (index > -1) {
          let newUser = await getTargetUserFromIndex(users, index);
          resultUsers.push(newUser);
        }
      }

      for (let i = 0; i < relationQuerySnapshot2.size; i++) {
        let index = users.findIndex(
          user => user.id === relationQuerySnapshot2.docs[i].data().user1,
        );

        if (index > -1) {
          let newUser = await getTargetUserFromIndex(users, index);
          resultUsers.push(newUser);
        }
      }
      console.log(resultUsers);
      setTargetUsers(resultUsers);
    }

    dispatch(setLoading(false));
  };

  const handleRelation = (relation: Relation) => () => {
    console.log('relation: ', relation);
    console.log('current index: ', index - 1);
    console.log('target users: ', targetUsers_alt);
    const targetUser = targetUsers_alt[index - 1];
    console.log(tempUser, targetUser);

    relations
      .where('user1', 'in', [tempUser.id, targetUser.id])
      .get()
      .then(querySnapshot => {
        const results = querySnapshot.docs.filter(doc => {
          if (
            doc.data().user2 === tempUser.id ||
            doc.data().user2 === targetUser.id
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (results.length === 1) {
          const doc = results[0];
          const docId = doc.id;
          const whichRelation =
            tempUser.id === doc.data().user1 ? 'relation1' : 'relation2';
          relations
            .doc(docId)
            .update({
              [whichRelation]: relation,
              updatedAt: new Date(),
            })
            .then(() => console.log('Updated'));
        } else {
          if (results.length > 0) {
            console.log(
              'Database error: more than two documents exist between two users in one direction!',
            );
          } else {
            relations
              .add({
                user1: tempUser.id,
                relation1: relation,
                user2: targetUser.id,
                relation2: Relation.initial,
                updatedAt: new Date(),
              })
              .then(() => console.log('Added'));
          }
        }
      });
    if (targetUsers_alt.length < CYCLE_COUNT) {
      if (index < targetUsers_alt.length) {
        setCurrentIndex(index);
      } else {
        index = 0;
        setCurrentIndex(0);
        // TODO consider if would fetch from database or not
        setTargetUsers([]);
      }
    } else {
      if (index === CYCLE_COUNT / 2) {
        fetchUsers(CYCLE_COUNT - 1)
          .then((users: any) => {
            console.log('fetched!!!', users.lenght);
            tempUsers = users;
          })
          .catch(err =>
            console.log(
              'While fetching user datas in the handleRelation function: ',
              err,
            ),
          );
      }
      if (index < targetUsers_alt.length) {
        if (index === targetUsers_alt.length - 1) {
          setTargetUsers([targetUsers_alt[index], ...tempUsers]);
          setCurrentIndex(0);
          index = 0;
          tempUsers = [];
          return;
        }
        setCurrentIndex(index);
      } else {
        index = 0;
        setCurrentIndex(0);
      }
    }
  };

  const boost = () => {
    users.doc(tempUser.id).update({
      boostedAt: new Date(),
    });
  };

  // console.log(targetUsers_alt);
  console.log(isLoading);
  return (
    <CustomTabnav
      navigation={navigation}
      route={route}
      handleFilter={handleFilter}
    >
      <Loader isLoading={isLoading} />
      {(currentIndex + 2 > targetUsers.length && targetUsers.length
        ? [targetUsers[currentIndex], targetUsers[0]]
        : targetUsers.slice(currentIndex, currentIndex + 2)
      )
        .reverse()
        .map((user, key) => {
          if (key === 1) {
            return (
              <Animated.View
                key={key}
                style={{
                  ...styles.animated_view,
                  transform: [
                    {
                      translateX: pan.x,
                    },
                    {
                      translateY: pan.y,
                    },
                    {
                      rotateZ: pan.x.interpolate({
                        inputRange: [-width, 0, width],
                        outputRange:
                          direction === 1
                            ? ['-10deg', '0deg', '10deg']
                            : ['10deg', '0deg', '-10deg'],
                      }),
                    },
                  ],
                }}
                {...panResponder.panHandlers}
              >
                <TouchableHighlight
                  onPress={() =>
                    navigation.navigate('UserShopDetail', {
                      ...user,
                    })
                  }
                >
                  <ImageBackground
                    source={
                      user.avatar === 'default.png'
                        ? defaultImage
                        : {
                            uri: user.avatar,
                          }
                    }
                    style={styles.imagebackground}
                    imageStyle={styles.image}
                  >
                    <CustomStamp
                      text={'like'}
                      style={{
                        ...styles.like_stamp,
                        opacity: pan.x.interpolate({
                          inputRange: [-width, 0, width],
                          outputRange: [0, 0, 3],
                        }),
                      }}
                      text_style={styles.like_text}
                    />
                    <CustomStamp
                      text={'dislike'}
                      style={{
                        ...styles.dislike_stamp,
                        opacity: pan.x.interpolate({
                          inputRange: [-width, 0, width],
                          outputRange: [3, 0, 0],
                        }),
                      }}
                      text_style={styles.dislike_text}
                    />

                    <CustomStamp
                      text={'favorite'}
                      style={{
                        ...styles.favorite_stamp,
                        opacity: favoriteValue.interpolate({
                          inputRange: [-width, 0, width],
                          outputRange: [3, 0, 0],
                        }),
                      }}
                      text_style={styles.favorite_text}
                    />
                    <View bottom style={styles.container}>
                      {user.favorite ? (
                        <View centerH style={styles.favoriteMarkContainer}>
                          <FavoriteGradient>
                            <Image
                              source={favoriteIcon}
                              style={styles.favoriteMark}
                            />
                          </FavoriteGradient>
                        </View>
                      ) : (
                        <></>
                      )}

                      <View style={styles.desc}>
                        <View row centerV>
                          <Text style={styles.title}>{user.name}</Text>
                          {user.online ? (
                            <>
                              <View style={styles.onlineMark}></View>
                              <Text>オンライン中</Text>
                            </>
                          ) : (
                            <></>
                          )}
                        </View>
                        <View row spread>
                          <SimpleLineIcons
                            name="location-pin"
                            size={20}
                            color={Colors.redBtn}
                          />
                          <Text style={styles.label}>
                            {user.prefecture_name}
                          </Text>
                          <View style={{width: width * 0.2}}></View>
                          <MaterialCommunityIcons
                            name="piggy-bank-outline"
                            size={20}
                            color={Colors.redBtn}
                          />
                          <Text style={styles.label}>{user.low}円〜</Text>
                        </View>
                        <Divider style={styles.divider} />
                        <Text>{user.bio}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableHighlight>
              </Animated.View>
            );
          } else if (key === 0) {
            return (
              <Animated.View
                key={key}
                style={{
                  ...styles.animated_view,
                  transform: [
                    {
                      scaleX: pan.x.interpolate({
                        inputRange: [
                          -width,
                          -width * 0.3,
                          0,
                          width * 0.3,
                          width,
                        ],
                        outputRange: [1, 1, 0.9, 1, 1],
                      }),
                    },
                    {
                      scaleY: pan.x.interpolate({
                        inputRange: [
                          -width,
                          -width * 0.3,
                          0,
                          width * 0.3,
                          width,
                        ],
                        outputRange: [1, 1, 0.9, 1, 1],
                      }),
                    },
                  ],
                }}
                {...panResponder.panHandlers}
              >
                <ImageBackground
                  source={
                    user.avatar === 'default.png'
                      ? defaultImage
                      : {
                          uri: user.avatar,
                        }
                  }
                  style={styles.imagebackground}
                  imageStyle={styles.image}
                >
                  <View bottom style={styles.container}>
                    <View style={styles.desc}>
                      <View row centerV>
                        <Text style={styles.title}>{user.name}</Text>
                        {user.online ? (
                          <>
                            <View style={styles.onlineMark}></View>
                            <Text>オンライン中</Text>
                          </>
                        ) : (
                          <></>
                        )}
                      </View>
                      <View row spread>
                        <SimpleLineIcons
                          name="location-pin"
                          size={20}
                          color={Colors.redBtn}
                        />
                        <Text style={styles.label}>池袋</Text>
                        <View style={{width: width * 0.2}}></View>
                        <MaterialCommunityIcons
                          name="piggy-bank-outline"
                          size={20}
                          color={Colors.redBtn}
                        />
                        <Text style={styles.label}>{user.low}円〜</Text>
                      </View>
                      <Divider style={styles.divider} />
                      <Text>{user.bio}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </Animated.View>
            );
          }
        })}
      <View style={styles.return} centerH centerV>
        {/* <IconButton
          icon={refreshIcon}
          color={Colors.white}
          size={15}
          onPress={handleRelation(Relation.like)}
        /> */}
        <CustomIconButton
          imageSource={refreshIcon}
          size={40}
          onPress={handleRelation(Relation.like)}
        />
      </View>
      <View style={styles.dislike} centerH centerV>
        {/* <IconButton
          icon={dislikeIcon}
          color={Colors.white}
          size={20}
          onPress={handleRelation(Relation.dislike)}
        /> */}
        <CustomIconButton
          imageSource={dislikeIcon}
          size={50}
          onPress={handleRelation(Relation.dislike)}
        />
      </View>
      <View style={styles.favorite} centerH centerV>
        {/* <IconButton
          icon={favoriteIcon}
          color={Colors.white}
          size={15}
          onPress={handleRelation(Relation.favorite)}
        /> */}
        <CustomIconButton
          imageSource={favoriteIcon}
          size={40}
          onPress={handleRelation(Relation.favorite)}
        />
      </View>
      <View style={styles.like} centerH centerV>
        {/* <IconButton
          icon={{uri: likeIcon}}
          color={Colors.white}
          size={20}
          onPress={handleRelation(Relation.like)}
        /> */}
        <CustomIconButton
          imageSource={likeIcon}
          size={50}
          onPress={handleRelation(Relation.like)}
        />
      </View>
      <View style={styles.boost} centerH centerV>
        {/* <IconButton
          icon={{uri: boostIcon}}
          color={Colors.white}
          size={15}
          onPress={handleRelation(Relation.like)}
        /> */}
        <CustomIconButton imageSource={boostIcon} size={40} onPress={boost} />
      </View>
    </CustomTabnav>
  );
};

const styles = StyleSheet.create({
  imagebackground: {
    width: width,
    height: height,
  },
  image: {
    width,
    height: height * 0.6,
  },
  container: {
    height: '100%',
    width,
  },
  desc: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingBottom: 0,
    height: height * 0.45,
  },
  favoriteMarkContainer: {
    height: height * 0.12,
    marginBottom: -30,
  },
  favoriteMark: {
    height: 40,
    width: 40,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 20,
  },
  title: {
    height: 50,
    fontSize: 30,
  },
  label: {
    color: Colors.iconLabel,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.iconLabel,
    marginVertical: 10,
  },
  reaction_icon: {
    position: 'absolute',
    bottom: height * 0.5 - width * 0.25,
    right: width * 0.25,
    zIndex: 1,
  },
  return: {
    position: 'absolute',
    left: (width * 1) / 6 - 20,
    bottom: 25,
    backgroundColor: '#a4a9ad',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  dislike: {
    position: 'absolute',
    left: (width * 2) / 6 - 25,
    bottom: 20,
    backgroundColor: '#20a39e',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  favorite: {
    position: 'absolute',
    left: (width * 3) / 6 - 20,
    bottom: 25,
    backgroundColor: '#ffba49',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  like: {
    position: 'absolute',
    left: (width * 4) / 6 - 25,
    backgroundColor: '#fe3c72',
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  boost: {
    position: 'absolute',
    left: (width * 5) / 6 - 20,
    backgroundColor: '#b780ff',
    bottom: 25,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  animated_view: {
    position: 'absolute',
  },
  box: {
    height: 250,
    width: 150,
    borderRadius: 5,
  },
  alt_box: {
    height: 250,
    width: 150,
    borderRadius: 5,
  },
  nope: {
    color: 'white',
    size: 10,
  },
  like_stamp: {
    borderColor: Colors.like,
    position: 'absolute',
    top: width * 0.2,
    left: width * 0.2,
    padding: 5,
    transform: [
      {
        rotateZ: '-20deg',
      },
    ],
  },
  like_text: {
    fontSize: 30,
    color: Colors.like,
    fontWeight: 'bold',
  },
  dislike_stamp: {
    borderColor: Colors.dislike,
    position: 'absolute',
    top: width * 0.2,
    right: width * 0.1,
    padding: 5,
    transform: [
      {
        rotateZ: '20deg',
      },
    ],
  },
  dislike_text: {
    fontSize: 30,
    color: Colors.dislike,
    fontWeight: 'bold',
  },
  favorite_stamp: {
    borderColor: Colors.favorite,
    position: 'absolute',
    bottom: height * 0.5,
    left: width * 0.3,
    padding: 5,
    zIndex: 2,
  },
  favorite_text: {
    fontSize: 30,
    color: Colors.favorite,
    fontWeight: 'bold',
  },
  onlineMark: {
    marginLeft: 20,
    width: 10,
    height: 10,
    backgroundColor: Colors.green40,
    borderRadius: 20,
  },
});

export default UserShopSearch;
