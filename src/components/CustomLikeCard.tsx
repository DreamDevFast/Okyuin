import React, {useRef, useState, useCallback} from 'react';
import {
  Dimensions,
  Animated,
  ImageBackground,
  TouchableHighlight,
  StyleSheet,
  PanResponder,
} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {useFocusEffect} from '@react-navigation/native';

import CustomStamp from './CustomStamp';
import {Colors} from '../styles';

const defaultImage = require('../assets/images/empty.jpg');

const {width, height} = Dimensions.get('window');
const threshold = width * 0.1;

const CustomeLikeCard = ({
  user,
  handleLikeCard,
  scrollBegin,
  ...props
}: any) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const [direction, setDirection] = useState<1 | -1>(1);
  const [flag, setFlag] = useState<boolean>(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        console.log(gestureState.vy, gestureState.dx, gestureState.dy);
        if (gestureState.y0 > width * 0.375) {
          setDirection(-1);
        } else {
          setDirection(1);
        }
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        console.log('released', gestureState.dx);
        if (Math.abs(gestureState.dx) < width * 0.3) {
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
            x: width * (gestureState.dx / Math.abs(gestureState.dx)),
            y: 0,
          },
          useNativeDriver: false,
        }).start(({finished}) => {
          if (finished) {
          }
        });

        if (gestureState.dx > 0) {
          handleLikeCard('like');
        } else {
          handleLikeCard('dislike');
        }
        Animated.spring(pan, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  useFocusEffect(
    useCallback(() => {
      if (scrollBegin) {
        Animated.spring(pan, {
          toValue: {
            x: 0,
            y: 0,
          },
          useNativeDriver: false,
        }).start();
      }
    }, [scrollBegin]),
  );
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
      <TouchableHighlight onPress={() => console.log('pressed')}>
        <ImageBackground
          source={
            user.data.avatar === 'default.png'
              ? defaultImage
              : {
                  uri: user.data.avatar,
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
        </ImageBackground>
      </TouchableHighlight>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animated_view: {
    height: width * 0.75,
    width: width * 0.5,
    padding: 10,
  },
  imagebackground: {
    height: '100%',
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 10,
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
});

export default CustomeLikeCard;
