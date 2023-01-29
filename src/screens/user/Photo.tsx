import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';

import {View, Text} from 'react-native-ui-lib';
import {Modal} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

import {useFocusEffect} from '@react-navigation/native';

import Portfolio from '../../components/Portfolio';

import {useAppDispatch, useAppSelector} from '../../redux/reduxHooks';
import {setTempUser, setLoading} from '../../redux/features/globalSlice';

import {Container, CustomButton, CustomText} from '../../components';
import {Colors} from '../../styles';
import CustomProgressBar from '../../components/CustomProgressBar';

type Profile = {
  id: string | undefined;
  bio: string;
  images: Array<string>;
};

const UserPhoto = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const tempUser = useAppSelector((state: any) => state.global.tempUser);
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

  return (
    <Container>
      <CustomProgressBar current={0.857} />
      <View centerH>
        <CustomText style={styles.header}>写真を追加</CustomText>
      </View>
      <View row style={styles.portfolio_container}>
        {profile.images.map((imageUri, key) => (
          <Portfolio
            key={key}
            uri={imageUri}
            openImagePickerModal={handleOpenImagePickerModal(key)}
          />
        ))}
        {6 - profile.images.length > 0
          ? Array.apply(
              0,
              Array(6 - profile.images.length),
            ).map((item, key) => (
              <Portfolio
                key={key + profile.images.length}
                openImagePickerModal={handleOpenImagePickerModal(
                  key + profile.images.length,
                )}
              />
            ))
          : Array.apply(
              0,
              Array(3 - (profile.images.length % 3)),
            ).map((item, key) => (
              <Portfolio
                key={key + profile.images.length}
                openImagePickerModal={handleOpenImagePickerModal(
                  key + profile.images.length,
                )}
              />
            ))}
      </View>
      <View centerH marginT-50>
        <CustomButton
          label="次へ"
          disabled={!!!profile.images.length}
          onPress={() => navigation.navigate('UserGuide1')}
        />
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
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  portfolio_container: {
    // paddingHorizontal: 'auto',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
});

export default UserPhoto;
