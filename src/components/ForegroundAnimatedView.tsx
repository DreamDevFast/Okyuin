import React, {useState} from 'react';

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

import {View, Text} from 'react-native-ui-lib';
import {Divider} from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Colors} from '../styles';
import CustomStamp from './CustomStamp';
import FavoriteGradient from './FavoriteGradient';

const {width, height} = Dimensions.get('window');

const favoriteIcon = require('../assets/icons/favorite-main.png');
const defaultImage = require('../assets/images/empty.jpg');

const ForegroundAnimatedView = ({
  pan,
  user,
  direction,
  panResponder,
  navigation,
  favoriteValue,
}: any) => {
  const [images, setImages] = useState([user.avatar, ...user.images]);
  const [backImageNum, setBackImageNum] = useState(0);

  const handleBackPan = (name: 'prev' | 'next' | 'bottom') => () => {
    console.log(name);
    switch (name) {
      case 'prev':
        if (backImageNum !== 0) setBackImageNum(backImageNum - 1);
        break;
      case 'next':
        if (backImageNum < images.length - 1) setBackImageNum(backImageNum + 1);
        break;
      case 'bottom':
        navigation.navigate('UserShopDetail', {...user});
        break;
      default:
        break;
    }
  };

  return (
    <Animated.View
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
            images[backImageNum] === 'default.png'
              ? defaultImage
              : {
                  uri: images[backImageNum],
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
            <View style={styles.prev_button}>
              <TouchableHighlight onPress={handleBackPan('prev')}>
                <View style={styles.prev}></View>
              </TouchableHighlight>
            </View>

            <View style={styles.next_button}>
              <TouchableHighlight onPress={handleBackPan('next')}>
                <View style={styles.next}></View>
              </TouchableHighlight>
            </View>

            <View style={styles.bottom_button}>
              <TouchableHighlight onPress={handleBackPan('bottom')}>
                <View style={styles.bottom}></View>
              </TouchableHighlight>
            </View>
            {user.favorite ? (
              <View centerH style={styles.favoriteMarkContainer}>
                <FavoriteGradient>
                  <Image source={favoriteIcon} style={styles.favoriteMark} />
                </FavoriteGradient>
              </View>
            ) : (
              <></>
            )}

            <View style={styles.desc}>
              {images.length > 1 ? (
                <View row centerH>
                  {images.map((image, key) => {
                    return (
                      <View
                        key={key}
                        style={{
                          ...styles.bar_piece,
                          width: (width - 60) / images.length,
                          backgroundColor:
                            key === backImageNum
                              ? Colors.white
                              : Colors.iconLabel,
                        }}
                      ></View>
                    );
                  })}
                </View>
              ) : (
                <></>
              )}
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
                <Text style={styles.label}>{user.prefecture_name}</Text>
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
    borderWidth: 1,
    position: 'relative',
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

  animated_view: {
    position: 'absolute',
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
  prev_button: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.5,
    height: height * 0.55,
  },
  prev: {
    width: width * 0.5,
    height: height * 0.55,
  },
  next_button: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.5,
    height: height * 0.55,
  },
  next: {
    width: width * 0.5,
    height: height * 0.55,
  },
  bottom_button: {
    position: 'absolute',
    top: height * 0.55,
    left: 0,
    width: width,
    height: height * 0.45,
    zIndex: 1,
  },
  bottom: {
    width: width,
    height: height * 0.45,
  },
  bar_piece: {
    height: 5,
    marginHorizontal: 3,
    marginTop: -40,
  },
});

export default ForegroundAnimatedView;
