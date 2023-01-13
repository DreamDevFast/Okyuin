import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Appbar, Divider, Modal, TextInput} from 'react-native-paper';
import {Image, Text, View} from 'react-native-ui-lib';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser, setLoading} from '../../redux/features/globalSlice';

import {Container, CustomButton} from '../../components';
import {Colors} from '../../styles';
import Portfolio from '../../components/Portfolio';

const userIcon = require('../../assets/images/user.png');

const {width, height} = Dimensions.get('window');

type Profile = {
  id: string | undefined;
  bio: string;
  images: Array<string>;
};

const UserProfile = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
  const setting = useAppSelector((state: any) => state.setting);

  const users = firestore().collection('Users');
  const profiles = firestore().collection('Profiles');

  const [profile, setProfile] = useState<Profile>({
    id: undefined,
    bio: '',
    images: [],
  });
  const [openImagePickerModal, setOpenImagePickerModal] = useState<boolean>(
    false,
  );
  const [nthImage, setNthImage] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      profiles
        .doc(tempUser.id)
        .get()
        .then(doc => {
          if (doc.exists) {
            const profile = doc.data();
            if (profile !== undefined) {
              setProfile({
                id: doc.id,
                bio: profile.bio,
                images: profile.images,
              });
            }
          }
        });
    }, []),
  );

  const handleImage = async (url: string) => {
    if (nthImage === profile.images.length) {
      // new image portfolio
      if (profile.id === undefined) {
        try {
          await profiles.doc(tempUser.id).set({
            bio: profile.bio,
            images: [url],
          });

          setProfile({
            id: tempUser.id,
            bio: profile.bio,
            images: [url],
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await profiles.doc(profile.id).update({
            images: [...profile.images, url],
          });
          setProfile({
            ...profile,
            images: [...profile.images, url],
          });
        } catch (err) {
          console.log(err);
        }
      }
    } else if (nthImage < profile.images.length) {
      // replace image portfolio
      try {
        const images = [...profile.images];
        images[nthImage] = url;
        await profiles.doc(profile.id).update({
          images,
        });
        setProfile({
          ...profile,
          images,
        });
      } catch (err) {
        console.log(err);
      }
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
        const reference = storage().ref(
          `/${tempUser.name}/portfolio/${filenameInStore}`,
        );
        await reference.putFile(
          Platform.OS === 'ios'
            ? image.path.replace('file://', '')
            : image.path,
        );
        const url = await reference.getDownloadURL();

        await handleImage(url);

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
        const reference = storage().ref(
          `/${tempUser.name}/portfolio/${filenameInStore}`,
        );
        await reference.putFile(
          Platform.OS === 'ios'
            ? image.path.replace('file://', '')
            : image.path,
        );
        const url = await reference.getDownloadURL();
        console.log('url: ', url);
        await handleImage(url);

        dispatch(setLoading(false));
      })
      .catch(err => {
        setOpenImagePickerModal(false);
      });
  };

  const handleOpenImagePickerModal = (nth: number) => () => {
    console.log(nth);
    setNthImage(nth);
    setOpenImagePickerModal(true);
  };

  const handleBio = (bioText: string) => {
    setProfile({
      ...profile,
      bio: bioText,
    });
  };

  const handleName = (name: string) => {
    dispatch(
      setTempUser({
        ...tempUser,
        name,
      }),
    );
  };

  const handleBack = async () => {
    await users.doc(tempUser.id).update({
      name: tempUser.name,
    });
    if (profile.id === undefined) {
      try {
        await profiles.doc(tempUser.id).set({
          bio: profile.bio,
          images: profile.images,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await profiles.doc(profile.id).update({
          bio: profile.bio,
        });
      } catch (err) {
        console.log(err);
      }
    }
    navigation.navigate('UserDashBoard');
  };

  return (
    <>
      <ScrollView>
        <Container>
          <ImageBackground
            source={
              tempUser.avatar === 'default.png' || '' || undefined
                ? userIcon
                : {uri: tempUser.avatar}
            }
            style={styles.image}
          />
          <View style={styles.firstBlock}>
            {/* <Text color={Colors.black} style={styles.title}>
              {tempUser.name}
            </Text> */}
            <TextInput
              selectionColor={Colors.iconLabel}
              underlineColor={Colors.white}
              activeUnderlineColor={Colors.white}
              style={styles.name_input}
              onChangeText={handleName}
              value={tempUser.name}
            />
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
              <Text style={styles.label}>{setting.priceRange.low}円〜</Text>
            </View>
            <Divider style={styles.divider} />
            <TextInput
              selectionColor={Colors.iconLabel}
              underlineColor={Colors.white}
              activeUnderlineColor={Colors.white}
              style={styles.bio_input}
              theme={{colors: {text: Colors.iconLabel}}}
              multiline={true}
              numberOfLines={2}
              onChangeText={handleBio}
              value={profile.bio}
            />
            <Divider style={styles.divider} />
            <View row style={styles.portfolio_container}>
              {profile.images.map((imageUri, key) => (
                <Portfolio
                  key={key}
                  uri={imageUri}
                  openImagePickerModal={handleOpenImagePickerModal(key)}
                />
              ))}
              <Portfolio
                openImagePickerModal={handleOpenImagePickerModal(
                  profile.images.length,
                )}
              />
            </View>
            <Divider style={styles.divider} />
            <View centerH paddingV-50>
              <CustomButton
                color={Colors.redBtn}
                labelStyle={styles.label_style}
                label="戻る"
                onPress={handleBack}
              />
            </View>
          </View>
        </Container>
      </ScrollView>
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
  image: {
    height: width * 1.2,
    width: '100%',
  },
  firstBlock: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
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
  thumb: {
    width: width * 0.3,
  },
  thumb_image: {
    height: width * 0.3,
  },
  portfolio_container: {
    flexWrap: 'wrap',
  },
  label_style: {
    color: Colors.white,
  },
  bio_input: {
    backgroundColor: 'transparent',
  },
  name_input: {
    height: 50,
    fontSize: 30,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
});
export default UserProfile;
