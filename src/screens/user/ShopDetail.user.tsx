import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import {Appbar, Divider, IconButton} from 'react-native-paper';
import {Image, Text, View} from 'react-native-ui-lib';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import {Container, CustomButton} from '../../components';
import {Colors} from '../../styles';
import CustomIconButton from '../../components/CustomIconButton';

const defaultImage = require('../../assets/images/empty.jpg');

const {width, height} = Dimensions.get('window');

const refreshIcon = require('../../assets/icons/refresh-main.png');
const likeIcon = require('../../assets/icons/like-main.png');
const dislikeIcon = require('../../assets/icons/dislike-main.png');
const favoriteIcon = require('../../assets/icons/favorite-main.png');
const boostIcon = require('../../assets/icons/boost-main.png');

const UserShopDetail = ({navigation, route}: any) => {
  const {id, avatar, name, high, low} = route.params;
  const [profile, setProfile] = useState<any>({bio: '', images: []});

  const profiles = firestore().collection('Profiles');

  useFocusEffect(
    useCallback(() => {
      profiles
        .doc(id)
        .get()
        .then(docSnapshot => {
          const data = docSnapshot.data();
          if (data) {
            setProfile({
              bio: data.bio,
              images: data.images,
            });
          }
        });
    }, []),
  );

  return (
    <ScrollView>
      <Container>
        <ImageBackground
          source={
            avatar === 'default.png'
              ? defaultImage
              : {
                  uri: avatar,
                }
          }
          style={styles.image}
        />
        <View style={styles.firstBlock}>
          <Text color={Colors.black} style={styles.title}>
            {name}
          </Text>
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
            <Text style={styles.label}>{low}円〜</Text>
          </View>
          <Divider style={styles.divider} />
          <Text color={Colors.white}>{profile.bio}</Text>
          <View row centerH centerV spread>
            {/* <IconButton
              icon="undo"
              color={Colors.white}
              style={styles.return}
              size={15}
              onPress={() => console.log('Pressed')}
            /> */}
            <CustomIconButton
              imageSource={refreshIcon}
              size={40}
              onPress={() => console.log('Pressed')}
            />
            {/* <IconButton
              icon="times"
              color={Colors.white}
              style={styles.dislike}
              size={20}
              onPress={() => console.log('Pressed')}
            /> */}
            <CustomIconButton
              imageSource={dislikeIcon}
              size={50}
              onPress={() => console.log('Pressed')}
            />
            {/* <IconButton
              icon="star"
              color={Colors.white}
              style={styles.favorite}
              size={15}
              onPress={() => console.log('Pressed')}
            /> */}
            <CustomIconButton
              imageSource={favoriteIcon}
              size={40}
              onPress={() => console.log('Pressed')}
            />
            {/* <IconButton
              icon="heart"
              color={Colors.white}
              style={styles.like}
              size={20}
              onPress={() => console.log('Pressed')}
            /> */}
            <CustomIconButton
              imageSource={likeIcon}
              size={50}
              onPress={() => console.log('Pressed')}
            />
            {/* <IconButton
              icon="bolt"
              color={Colors.white}
              style={styles.boost}
              size={15}
              onPress={() => console.log('Pressed')}
            /> */}
            <CustomIconButton
              imageSource={boostIcon}
              size={40}
              onPress={() => console.log('Pressed')}
            />
          </View>
          <Divider style={styles.divider} />
          <View row style={styles.portfolio_container}>
            {profile.images.map((image: string, key: number) => (
              <View padding-5 style={styles.thumb} key={key}>
                <Image
                  source={{
                    uri: image,
                  }}
                  style={styles.thumb_image}
                />
              </View>
            ))}
          </View>
          <Divider style={styles.divider} />
          <View centerH paddingB-100>
            <Text color={Colors.white}>REPORT</Text>
          </View>
        </View>
      </Container>
    </ScrollView>
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
    backgroundColor: Colors.white,
    padding: 20,
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
    borderRadius: 30,
  },
  thumb_image: {
    height: width * 0.2,
    width: width * 0.2,
    borderRadius: 10,
  },
  return: {
    backgroundColor: '#a4a9ad',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  dislike: {
    backgroundColor: '#20a39e',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  favorite: {
    backgroundColor: '#ffba49',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  like: {
    backgroundColor: '#fe3c72',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  boost: {
    backgroundColor: '#b780ff',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  portfolio_container: {
    flexWrap: 'wrap',
  },
});
export default UserShopDetail;
