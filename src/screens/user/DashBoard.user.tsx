import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Pressable,
  Platform,
  BackHandler,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import {IconButton, Modal} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

import {CustomButton, Container, CustomText} from '../../components';
import {Colors} from '../../styles';
import {Text, View, Avatar, Carousel} from 'react-native-ui-lib';
import UserShopSearch from './ShopSearch.user';
import CustomTabnav from '../../components/CustomTabnav';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {
  setTempUser,
  setLoading,
  setNewMatchedUsers,
  setEntering,
} from '../../redux/features/globalSlice';
import Loader from '../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';

const userIcon = require('../../assets/images/user.png');
const defaultImage = require('../../assets/images/empty.jpg');
const {width, height} = Dimensions.get('window');

enum Relation {
  initial,
  like,
  dislike,
  favorite,
}

const DefaultTab = ({navigation}: any) => {
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const isLoading = useAppSelector((state: any) => state.global.isLoading);

  const dispatch = useAppDispatch();

  const [openImagePickerModal, setOpenImagePickerModal] = useState<boolean>(
    false,
  );

  useFocusEffect(
    useCallback(() => {
      // BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      // return () => {
      //   BackHandler.removeEventListener(
      //     'hardwareBackPress',
      //     handleBackButtonClick,
      //   );
      // };
    }, []),
  );

  const handleBackButtonClick = () => {
    console.log('back button pressed');
    return true;
  };
  const handleAvatar = async (avatar: string) => {
    try {
      await firestore().collection('Users').doc(tempUser.id).update({avatar});
      dispatch(
        setTempUser({
          ...tempUser,
          avatar,
        }),
      );
    } catch (err) {
      console.log('update avatar error: ', err);
    }
  };

  const pickPictureOnGallery = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 600,
      cropping: true,
    })
      .then(async image => {
        dispatch(setLoading(true));
        setOpenImagePickerModal(false);
        const now = Date.now();

        const filenameInStore = `${tempUser.name}-${now}.png`;
        const reference = storage().ref(`/${tempUser.name}/${filenameInStore}`);
        await reference.putFile(
          Platform.OS === 'ios'
            ? image.path.replace('file://', '')
            : image.path,
        );
        const url = await reference.getDownloadURL();

        await handleAvatar(url);

        dispatch(setLoading(false));
      })
      .catch(err => {
        setOpenImagePickerModal(false);
      });
  };

  const pickPictureOnCamera = () => {
    ImagePicker.openCamera({
      width: 800,
      height: 600,
      cropping: true,
    })
      .then(async image => {
        dispatch(setLoading(true));
        setOpenImagePickerModal(false);
        const now = Date.now();

        const filenameInStore = `${tempUser.name}-${now}.png`;
        const reference = storage().ref(`/${tempUser.name}/${filenameInStore}`);
        await reference.putFile(
          Platform.OS === 'ios'
            ? image.path.replace('file://', '')
            : image.path,
        );
        const url = await reference.getDownloadURL();

        await handleAvatar(url);

        dispatch(setLoading(false));
      })
      .catch(err => {
        setOpenImagePickerModal(false);
      });
  };

  return (
    <>
      <Loader isLoading={isLoading} />
      <View bottom style={styles.container}>
        <View centerH style={styles.avatar_container}>
          <Avatar
            size={250}
            source={
              tempUser.avatar === 'default.png' || '' || undefined
                ? userIcon
                : {uri: tempUser.avatar}
            }
            label={'IMG'}
          />
          <Text style={styles.name}>{tempUser.name}</Text>
        </View>
        <View row spread bottom style={styles.toolBar1}>
          <View centerH>
            <View style={styles.whiteIcon}>
              <IconButton
                icon="cog"
                color={Colors.back}
                rippleColor={Colors.white}
                size={30}
                onPress={() => navigation.navigate('UserSetting')}
              />
            </View>
            <Text style={styles.iconLabel}>{'       設定       '}</Text>
          </View>
          <View centerH>
            <View style={styles.whiteIcon}>
              <IconButton
                icon="camera"
                color={Colors.redBtn}
                rippleColor={Colors.white}
                size={30}
                onPress={() => setOpenImagePickerModal(true)}
              />
            </View>
            <Text style={styles.iconLabel}>画像を追加</Text>
          </View>
          <View centerH>
            <View style={styles.whiteIcon}>
              <IconButton
                icon="pencil-alt"
                color={Colors.back}
                rippleColor={Colors.white}
                size={30}
                onPress={() => navigation.navigate('UserProfile')}
              />
            </View>
            <Text style={styles.iconLabel}>プロフィール</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={openImagePickerModal}
        dismissable
        onDismiss={() => setOpenImagePickerModal(false)}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          margin: 20,
          borderRadius: 10,
        }}
      >
        <View row>
          <View flex center>
            <Pressable onPress={pickPictureOnGallery}>
              <Ionicons name={'ios-images'} size={40} color={Colors.grey10} />
              <Text>Gallery</Text>
            </Pressable>
          </View>
          <View flex center>
            <Pressable onPress={pickPictureOnCamera}>
              <Ionicons name={'md-camera'} size={40} color={Colors.grey10} />
              <Text>Camera</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

const UserDashBoard = ({navigation, route}: any) => {
  const dispatch = useAppDispatch();

  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const newMatchedUsers = useAppSelector(
    (state: any) => state.global.newMatchedUsers,
  );
  const isEntering = useAppSelector((state: any) => state.global.isEntering);

  const users = firestore().collection('Users');
  const relations = firestore().collection('Relations');
  const settings = firestore().collection('Settings');

  useFocusEffect(
    useCallback(() => {
      console.log(isEntering);
      if (isEntering) {
        dispatch(setEntering(false));
        checkToken();
        settings
          .doc(tempUser.id)
          .get()
          .then(docSnapshot => {
            if (!docSnapshot.exists) return;
            const docData = docSnapshot.data();
            if (docData) {
              if (!docData.isNotifying) return;
            } else {
              return;
            }
            relations
              .where('user1', '==', tempUser.id)
              .where('relation1', 'in', [Relation.favorite, Relation.like])
              .get()
              .then(querySnapshot1 => {
                relations
                  .where('user2', '==', tempUser.id)
                  .where('relation2', 'in', [Relation.favorite, Relation.like])
                  .get()
                  .then(async querySnapshot2 => {
                    let docs = [];
                    if (querySnapshot1.size) {
                      docs.push(
                        ...(await Promise.all(
                          querySnapshot1.docs
                            .filter(doc => {
                              const data = doc.data();
                              if (data) {
                                if (
                                  data.checked1 === 1 ||
                                  data.relation2 === Relation.initial
                                )
                                  return false;
                                else return true;
                              } else {
                                return false;
                              }
                            })
                            .map(async doc => {
                              const docSnapshot = await users
                                .doc(doc.data().user2)
                                .get();
                              const data = docSnapshot.data();
                              if (data)
                                return {
                                  id: doc.id,
                                  userId: docSnapshot.id,
                                  name: data.name,
                                  avatar: data.avatar,
                                  relation: doc.data().relation2,
                                  whichChecked: 'checked1', // it means if tempUser is user1 or user2
                                };
                              else
                                return {
                                  id: doc.id,
                                  userId: docSnapshot.id,
                                  name: '',
                                  avatar: 'default.png',
                                  relation: doc.data().relation2,
                                  whichChecked: 'checked1',
                                };
                            }),
                        )),
                      );
                    }

                    if (querySnapshot2.size) {
                      docs.push(
                        ...(await Promise.all(
                          querySnapshot2.docs
                            .filter(doc => {
                              const data = doc.data();
                              if (data) {
                                if (
                                  data.checked2 === 1 ||
                                  data.relation1 === Relation.initial
                                )
                                  return false;
                                else return true;
                              } else {
                                return false;
                              }
                            })
                            .map(async doc => {
                              const docSnapshot = await users
                                .doc(doc.data().user1)
                                .get();
                              const data = docSnapshot.data();
                              if (data)
                                return {
                                  id: doc.id,
                                  userId: docSnapshot.id,
                                  name: data.name,
                                  avatar: data.avatar,
                                  relation: doc.data().relation1,
                                  whichChecked: 'checked2',
                                };
                              else
                                return {
                                  id: doc.id,
                                  userId: docSnapshot.id,
                                  name: '',
                                  avatar: 'default.png',
                                  relation: doc.data().relation1,
                                  whichChecked: 'checked2',
                                };
                            }),
                        )),
                      );
                    }

                    console.log('docs', docs.length);
                    if (docs.length) {
                      dispatch(setNewMatchedUsers(docs));
                    }
                  });
              });
          });
      }
    }, []),
  );

  const checkToken = () => {
    messaging()
      .getToken()
      .then(fcmToken => {
        users
          .doc(tempUser.id)
          .update({
            fcmToken,
          })
          .then(() => {
            console.log('FCM token updated!');
          })
          .catch(err => {
            console.log('Error While updating FCM token: ', err);
          });
      })
      .catch(err => {
        console.log('Error while getting FCM token: ', err);
        Alert.alert('');
      });
  };

  const changeCheckState = (user: any) => {
    console.log(user.id);
    relations
      .doc(user.id)
      .update({
        [user.whichChecked]: 1, // It represents that the relation is
      })
      .then(() => console.log('check state changed'));
  };

  const renderItem = (user: any, key: number) => {
    console.log('length', user.name, user.avatar);
    return (
      <ImageBackground
        key={key}
        source={
          user.avatar === 'default.png' ? defaultImage : {uri: user.avatar}
        }
        blurRadius={4}
      >
        <View centerV centerH style={styles.item}>
          <View row centerV spread marginB-30 style={{width: width * 0.8}}>
            <Avatar
              size={width * 0.2}
              source={
                user.avatar === 'default.png'
                  ? userIcon
                  : {
                      uri: user.avatar,
                    }
              }
              label={'IMG'}
              imageStyle={styles.avatar}
            />
            <Ionicons
              name={
                user.relatoin === Relation.dislike ? 'close-sharp' : 'heart'
              }
              color={Colors.white}
              size={width * 0.15}
            />
            <Avatar
              size={width * 0.2}
              source={
                user.avatar === 'default.png'
                  ? userIcon
                  : {
                      uri: tempUser.avatar,
                    }
              }
              label={'IMG'}
              imageStyle={styles.avatar}
            />
          </View>
          {user.relation === Relation.like ||
          user.relation === Relation.favorite ? (
            <CustomButton
              color={Colors.redBtn}
              labelStyle={styles.label_style}
              label="メッセージを送る"
              onPress={() => {
                changeCheckState(user);
                dispatch(setEntering(false));
                navigation.navigate('UserChatRoom', {
                  id: user.userId,
                  name: user.name,
                  avatar: user.avatar,
                });
              }}
            />
          ) : (
            <></>
          )}
          <View marginB-10></View>
          <CustomButton
            color={'transparent'}
            labelStyle={styles.label_style}
            label="戻る"
            onPress={() => {
              changeCheckState(user);
              dispatch(setEntering(false));
              dispatch(setNewMatchedUsers([]));
            }}
          />
        </View>
      </ImageBackground>
    );
  };

  return (
    <>
      {newMatchedUsers.length ? (
        <Carousel
          onChangePage={(nextPage: number, oldPage: number) =>
            changeCheckState(newMatchedUsers[oldPage])
          }
        >
          {newMatchedUsers.map((user: any, key: number) => {
            return renderItem(user, key);
          })}
        </Carousel>
      ) : (
        <CustomTabnav navigation={navigation} route={route}>
          <DefaultTab navigation={navigation} />
        </CustomTabnav>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  avatar_container: {
    position: 'absolute',
    top: height * 0.1,
    left: 0,
    width: width,
    // zIndex: 1,
  },
  toolBar: {
    width: '80%',
    marginTop: 20,
  },
  toolBar1: {
    width: '100%',
    padding: width * 0.1,
    paddingBottom: width * 0.3,
    height: height * 0.9 - 175,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    zIndex: -1,
  },
  whiteIcon: {
    backgroundColor: Colors.white,
    borderRadius: 50,
    shadowColor: '#171717',
    elevation: 10,
  },
  iconLabel: {
    fontSize: 15,
    color: Colors.black,
  },
  name: {
    color: Colors.black,
    fontSize: 40,
    fontWeight: 'bold',
  },
  item: {
    height: height,
    width: width,
    backgroundColor: 'transparent',
  },
  label_style: {
    color: Colors.white,
  },
  avatar: {
    borderColor: Colors.white,
    borderWidth: 2,
  },
});

export default UserDashBoard;
